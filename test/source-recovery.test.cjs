'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'artifacts','source-build','tests');fs.mkdirSync(dir,{recursive:true});
const fixture=path.join(dir,'shared.cjs');
esbuild.buildSync({absWorkingDir:root,stdin:{contents:[
 "export { BridgeTaskStore } from './src/bridge-task-store.js';",
 "export { BridgeSessionRegistry } from './src/bridge-session-registry.js';",
 "export { Semaphore } from './src/concurrency.js';",
 "export { parseBridgeTodos, parseBridgePlan, parseBridgeProgress } from './src/bridge-coordination-validation.js';",
 "export { normalizeFileToolName, normalizeFileToolInput } from './src/file-tool-input-compat.js';",
 "export { FILE_TOOL_DEFINITIONS, invokeFileTool } from './src/file-tool-registry.js';",
 "export { validateToolInput } from './src/tool-input-validation.js';",
 "export { createCanonicalUnifiedDiff } from './src/canonical-diff.js';",
 "export { createManagedCommandId, normalizeManagedCommandId } from './src/managed-command-id.js';",
 "export { bridgeOwnerFromIdentity, MODERN_TASK_OWNER_PREFIX, MODERN_COMMAND_OWNER_PREFIX } from './src/bridge-task-owner.js';"
].join('\n'),resolveDir:root,sourcefile:'source-recovery-test-entry.mjs'},bundle:true,platform:'node',format:'cjs',target:'node22',outfile:fixture,logLevel:'error'});
const api=require(fixture);
test('reconstructed source graph loads real APIs',()=>{assert.equal(typeof api.BridgeTaskStore,'function');assert.equal(typeof api.invokeFileTool,'function');assert.equal(api.FILE_TOOL_DEFINITIONS.length,5);});
test('task lifecycle revisions and owner isolation',()=>{const store=new api.BridgeTaskStore(24,()=>1000);const first=store.update('owner-a',[{id:'build',title:'build',status:'in_progress'}],{new_task:true});assert.equal(first.revision,1);assert.throws(()=>store.update('owner-b',[],{task_id:first.id,expected_revision:1}),/different client/);assert.throws(()=>store.update('owner-a',[],{task_id:first.id,expected_revision:0}),/revision conflict/);const done=store.update('owner-a',[{id:'build',title:'build',status:'completed'}],{task_id:first.id,expected_revision:1,lifecycle:'completed'});assert.equal(done.state,'completed');assert.equal(done.revision,2);});
test('todo validation enforces one active step and stable IDs',()=>{assert.throws(()=>api.parseBridgeTodos({todos:[{id:'a',title:'a',status:'in_progress'},{id:'b',title:'b',status:'in_progress'}]},24),/at most one/);assert.throws(()=>api.parseBridgeTodos({todos:[{id:'a',title:'a',status:'pending'},{id:'a',title:'b',status:'pending'}]},24),/duplicate/);assert.equal(api.parseBridgePlan({plan:[{step:'Compile',status:'pending'}]},24)[0].id,'plan-1');});
test('permanent sessions survive arbitrary idle age but retain bounded capacity',()=>{const destroyed=[];const sessions=new api.BridgeSessionRegistry({onSessionDestroyed:(id,s,reason)=>destroyed.push([id,reason])});sessions.set('idle',{activeRequests:0,activeStreams:0,lastActivity:0});sessions.set('busy',{activeRequests:1,activeStreams:0,lastActivity:0});sessions.prune(1e12,Infinity,64);assert.equal(sessions.size,2);sessions.makeRoom(2);assert.equal(sessions.has('idle'),false);assert.equal(sessions.has('busy'),true);assert.equal(destroyed[0][1],'capacity-eviction');});
test('semaphore queues, releases once, and aborts waiters',async()=>{const s=new api.Semaphore(1),release=await s.acquire();let admitted=false;const queued=s.acquire().then(r=>{admitted=true;r();});await new Promise(r=>setImmediate(r));assert.equal(admitted,false);assert.equal(s.waiting,1);release();release();await queued;assert.equal(s.active,0);const held=await s.acquire();const controller=new AbortController();const cancelled=s.acquire(controller.signal);controller.abort();await assert.rejects(cancelled);held();assert.equal(s.waiting,0);});
test('file aliases and structured tool validation are reconstructed',()=>{assert.equal(api.normalizeFileToolName('read_file'),'read_files');assert.throws(()=>api.validateToolInput('example',{type:'object',properties:{count:{type:'integer'}},required:['count']},{count:'bad'}));});
test('file tools read and patch a disposable fixture through their actual registry',async()=>{const temp=fs.mkdtempSync(path.join(dir,'file-tools-'));try{fs.writeFileSync(path.join(temp,'sample.txt'),'before\n');const read=await api.invokeFileTool('read_files',{files:[{path:'sample.txt'}]},{workspaceRoots:[temp]});assert.equal(read.isError,undefined);assert.match(read.text,/before/);const patched=await api.invokeFileTool('apply_patch',{patch:'*** Begin Patch\n*** Update File: sample.txt\n@@\n-before\n+after\n*** End Patch\n'},{workspaceRoots:[temp]});assert.notEqual(patched.isError,true,patched.text);assert.equal(fs.readFileSync(path.join(temp,'sample.txt'),'utf8'),'after\n');const invalid=await api.invokeFileTool('read_files',{files:[{path:path.join(temp,'..','outside.txt')}]},{workspaceRoots:[temp]});assert.equal(invalid.isError,true);}finally{fs.rmSync(temp,{recursive:true,force:true});}});
test('managed command IDs retain entropy and normalization contracts',()=>{
 const a=api.createManagedCommandId(),b=api.createManagedCommandId();
 assert.notEqual(a,b);
 assert.match(a,/^cmd_[a-f0-9]{48}$/);
 assert.equal(api.normalizeManagedCommandId(a),a);
 assert.equal(api.normalizeManagedCommandId('  command_id: '+a+'\nstatus: completed  '),a);
 assert.equal(api.normalizeManagedCommandId(a+'unexpected-suffix'),a+'unexpected-suffix');
 // Normalization is not authorization: unknown values remain available for the
 // broker's owner-scoped lookup to reject, matching the recovered implementation.
 assert.equal(api.normalizeManagedCommandId(' invalid '),'invalid');
 assert.equal(api.normalizeManagedCommandId('  '),'');
 assert.equal(api.createManagedCommandId(()=>Buffer.alloc(24,0x1a)),'cmd_'+'1a'.repeat(24));
 assert.throws(()=>api.createManagedCommandId(()=>Buffer.alloc(23)),/exactly 24 bytes/);
});
test('modern task and command namespaces remain distinct and deterministic',()=>{const id={clientId:'test',account:'local',workspace:'fixture',authorization:'',clientName:'test',clientVersion:'1'};const task=api.bridgeOwnerFromIdentity(api.MODERN_TASK_OWNER_PREFIX,id),command=api.bridgeOwnerFromIdentity(api.MODERN_COMMAND_OWNER_PREFIX,id);assert.equal(task,api.bridgeOwnerFromIdentity(api.MODERN_TASK_OWNER_PREFIX,id));assert.notEqual(task,command);});
test('MCP runtime exports are usable, not only syntactically valid',()=>{const runtime=require(path.join(root,'artifacts/source-build/runtime/mcp-server.js'));assert.equal(typeof runtime.createFileToolsServer,'function');const server=runtime.createFileToolsServer([dir]);assert.ok(server);});
test('Agent runtime handles closed input in an isolated subprocess',()=>{const result=cp.spawnSync(process.execPath,[path.join(root,'artifacts/source-build/runtime/agent-host.js')],{cwd:dir,input:'',encoding:'utf8',timeout:10000});assert.equal(result.status,0,result.stderr);assert.doesNotMatch(result.stderr,/ReferenceError|TypeError/);});
test('all build receipts reject legacy bundle compilation inputs',()=>{const receipt=JSON.parse(fs.readFileSync(path.join(root,'artifacts/source-build/build-receipt.json'),'utf8'));assert.equal(receipt.old_bundle_inputs,false);assert.equal(receipt.results.length,3);for(const r of receipt.results){const evidence=JSON.parse(fs.readFileSync(path.join(root,'artifacts/source-build',r.output+'.build.json'),'utf8'));assert.ok(evidence.input_count>1);assert.equal(evidence.inputs.some(i=>i.file.startsWith('extension/dist/')||i.file.startsWith('extension/runtime/')),false);}});
