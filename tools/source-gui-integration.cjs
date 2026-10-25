'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),{_electron}=require(path.join(root,'editor/node_modules/playwright-core'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// Optional overrides so the same suite can validate a freshly assembled product
// without rewriting the recorded 2026-10-14 evidence.
const argOf=name=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined;};
(async()=>{
 const proof=path.resolve(argOf('--proof')||path.join(root,'artifacts/source-build/validation/final-stage/gui-integration-verified'));fs.mkdirSync(proof,{recursive:true});
 const fixture=path.join(root,'artifacts/source-gui-fixture');fs.mkdirSync(fixture,{recursive:true});fs.writeFileSync(path.join(fixture,'hello.ts'),'export const message = "source-build-fixture";\n');
 const requests=[],model=http.createServer(async(req,res)=>{
  let raw='';for await(const p of req)raw+=p;let body;try{body=raw?JSON.parse(raw):{};}catch{body={};}
  if(req.url.split('?')[0].endsWith('/models')){res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({object:'list',data:[{id:'source-fixture',object:'model',owned_by:'local-test'}]}));return;}
  const text=JSON.stringify(body.messages||[]);const mode=text.includes('SOURCE_FIXTURE_CODE')?'CODE':text.includes('SOURCE_FIXTURE_PLAN')?'PLAN':'ASK';
  requests.push({url:req.url,mode,stream:body.stream,tools:(body.tools||[]).map(t=>t.function?.name),model:body.model,messages:body.messages});
  const messages=body.messages||[];const lastUser=messages.map((m,i)=>m.role==='user'&&JSON.stringify(m.content).includes('SOURCE_FIXTURE_'+mode)?i:-1).filter(i=>i>=0).at(-1)??-1;
  const alreadyReturned=messages.slice(lastUser+1).some(m=>m.role==='tool');const tool=mode==='CODE'?'apply_patch':mode==='PLAN'?'list_directory':'read_files';
  if(body.stream&&!alreadyReturned&&(body.tools||[]).some(t=>t.function?.name===tool)){
   const args=tool==='apply_patch'?{patch:'*** Begin Patch\n*** Add File: code-mode-owned.txt\n+CODE_AGENT_TOOL_OK\n*** End Patch\n'}:tool==='read_files'?{files:[{path:'hello.ts'}]}:{path:'.',depth:1};
   res.writeHead(200,{'content-type':'text/event-stream'});res.write('data: '+JSON.stringify({id:'source-tool-'+requests.length,object:'chat.completion.chunk',choices:[{index:0,delta:{role:'assistant',tool_calls:[{index:0,id:'owned_'+mode+'_call',type:'function',function:{name:tool,arguments:JSON.stringify(args)}}]},finish_reason:null}]})+'\n\n');
   res.write('data: '+JSON.stringify({id:'source-tool-'+requests.length,object:'chat.completion.chunk',choices:[{index:0,delta:{},finish_reason:'tool_calls'}]})+'\n\ndata: [DONE]\n\n');res.end();return;
  }
  const content='SOURCE_FIXTURE_'+mode+'_OK';
  if(body.stream){res.writeHead(200,{'content-type':'text/event-stream','cache-control':'no-cache'});for(const delta of [{role:'assistant'},{content}])res.write('data: '+JSON.stringify({id:'source-local-'+requests.length,object:'chat.completion.chunk',choices:[{index:0,delta,finish_reason:null}]})+'\n\n');res.write('data: '+JSON.stringify({id:'source-local-'+requests.length,object:'chat.completion.chunk',choices:[{index:0,delta:{},finish_reason:'stop'}]})+'\n\ndata: [DONE]\n\n');res.end();}
  else{res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({id:'source-local-'+requests.length,object:'chat.completion',choices:[{index:0,message:{role:'assistant',content},finish_reason:'stop'}]}));}
 });await new Promise(r=>model.listen(0,'127.0.0.1',r));
 const modelUrl='http://127.0.0.1:'+model.address().port+'/v1';
 const user=path.resolve(argOf('--profile')||path.join(root,'artifacts/source-gui-profile-integration-verified')),extensions=path.join(root,'artifacts/source-gui-empty-extensions');
 // The suite ends by revoking all permissions, which persists a read-only default, and it
 // registers a model group by name. Reusing a profile therefore fails for the wrong reason.
 if(fs.existsSync(path.join(user,'User/globalStorage/state.vscdb')))throw Error('Profile already has state; pass a fresh --profile directory ('+user+')');
 fs.mkdirSync(path.join(user,'User'),{recursive:true});fs.mkdirSync(extensions,{recursive:true});
 fs.writeFileSync(path.join(user,'User/settings.json'),JSON.stringify({'workbench.startupEditor':'none','telemetry.telemetryLevel':'off','extensions.autoCheckUpdates':false,'extensions.autoUpdate':false,'update.mode':'none','security.workspace.trust.enabled':false,'window.restoreWindows':'none','git.openRepositoryInParentFolders':'never','chat.commandCenter.enabled':true,'shuncode.model.baseUrl':modelUrl,'shuncode.model.name':'source-fixture','shuncode.chat.sharedHistory':false,'window.title':'[SOURCE INTEGRATION] ${activeEditorShort}'},null,2));
 const product=path.resolve(argOf('--product')||path.join(root,'artifacts/source-product-0.7.10-verified')),sourceExt=path.join(product,'resources/app/extensions/shuncode'),harness=path.join(root,'artifacts/source-test-harness');
 // Screenshots are supporting evidence, not assertions. Retry a slow capture instead of failing the run.
 const shot=async name=>{for(let attempt=0;attempt<3;attempt++){try{await win.screenshot({path:path.join(proof,name),fullPage:true,animations:'disabled',timeout:60000});return;}catch(e){if(attempt===2)throw e;await sleep(2000);}}};
 const env={...process.env,SHUNCODE_SOURCE_PROOF:proof,SHUNCODE_BRIDGE_SMOKE_LOCAL:'1'};for(const k of ['ELECTRON_RUN_AS_NODE','VSCODE_IPC_HOOK_CLI','VSCODE_PID','VSCODE_NLS_CONFIG'])delete env[k];
 let app,win;const steps=[],consoleErrors=[],processLogs=[];const report={product,profile:user,fixture,modelService:'loopback fixture; no paid vendor calls',steps};
 let endpoint;
 const control=async(op,data={})=>{const response=await fetch('http://127.0.0.1:'+endpoint.port,{method:'POST',headers:{'content-type':'application/json','x-source-test-token':endpoint.token},body:JSON.stringify({op,...data}),signal:AbortSignal.timeout(60000)});const value=await response.json();if(!value.ok)throw Error(value.error);return value.result;};
 const save=()=>{fs.writeFileSync(path.join(proof,'gui-integration.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(proof,'model-requests.json'),JSON.stringify(requests,null,2)+'\n');fs.writeFileSync(path.join(proof,'process-output.log'),processLogs.join(''));};
 try{
  const endpointFile=path.join(proof,'harness-endpoint.private.json');if(fs.existsSync(endpointFile))fs.unlinkSync(endpointFile);
  app=await _electron.launch({executablePath:path.join(product,'ShunCode.exe'),args:['--new-window','--user-data-dir='+user,'--extensions-dir='+extensions,'--skip-welcome','--skip-release-notes','--disable-updates','--disable-telemetry','--enable-proposed-api=shuncode.shuncode','--enable-proposed-api=local.source-verification-harness','--extensionDevelopmentPath='+sourceExt,'--extensionDevelopmentPath='+harness,'--locale=en',fixture],env,timeout:90000});
  app.process().stdout?.on('data',x=>processLogs.push(x.toString()));app.process().stderr?.on('data',x=>processLogs.push(x.toString()));
  win=await app.firstWindow({timeout:60000});win.on('pageerror',e=>consoleErrors.push(e.stack||e.message));await win.waitForSelector('.monaco-workbench',{timeout:90000});
  for(let i=0;i<90&&!fs.existsSync(endpointFile);i++)await sleep(500);if(!fs.existsSync(endpointFile))throw Error('Owned verification extension did not start');endpoint=JSON.parse(fs.readFileSync(endpointFile));
  report.activation=await control('status');save();steps.push({name:'actual-source-extension-activation',pass:report.activation.isActive});
  const edited=await control('edit',{file:'hello.ts',text:'export const message = "source-edit-save-ok";\n'});steps.push({name:'open-edit-save',pass:edited.saved&&fs.readFileSync(path.join(fixture,'hello.ts'),'utf8').includes('source-edit-save-ok')});
  await win.waitForTimeout(10000);const initialBody=await win.locator('body').innerText();steps.push({name:'product-integrity-notification',pass:!initialBody.includes('installation appears to be corrupt')});
  await shot('editor-source.png');
  // Enter only an explicit non-secret loopback fixture key through the real command/UI.
  const keyPromise=control('command',{command:'shuncode.setApiKey'});await win.waitForSelector('.quick-input-widget input:visible',{timeout:15000});report.keyDialogBefore=await win.locator('.quick-input-widget').innerText();await shot('api-key-dialog.png');await win.locator('.quick-input-widget input:visible').click();await win.locator('.quick-input-widget input:visible').fill('source-local-fixture-key');await win.keyboard.press('Enter');await win.waitForTimeout(1000);report.keyAfterEnter=await win.locator('body').innerText();save();await win.keyboard.press('Escape');const clearToasts=win.locator('.notification-toast .codicon-notifications-clear,.notification-toast [aria-label*="Clear Notification"]');for(let i=0;i<await clearToasts.count();i++)await clearToasts.nth(i).click({force:true}).catch(()=>{});keyPromise.catch(e=>{report.notificationCommandPending=e.message;});if(!report.keyAfterEnter.includes('ShunCode API key saved'))throw Error('Real key storage did not confirm');steps.push({name:'real-UI-loopback-key-configuration',pass:true});await win.keyboard.press('Escape');
  let bridge;
  for(let i=0;i<30;i++){bridge=await control('command',{command:'shuncode.bridge.getStatus'});if(bridge.state==='running'&&bridge.localUrl)break;await sleep(500);}
  save();report.bridgeState={state:bridge?.state,localPort:bridge?.localPort,hasLocalEndpoint:Boolean(bridge?.localUrl)};
  if(!bridge?.localUrl)throw Error('Owned local MCP endpoint did not start: '+JSON.stringify(report.bridgeState));
  const url=bridge.localUrl;let sid;const mcp=async(method,params,id)=>{
   const headers={'content-type':'application/json',accept:'application/json, text/event-stream'};if(sid)headers['Mcp-Session-Id']=sid;
   const response=await fetch(url,{method:'POST',headers,body:JSON.stringify({jsonrpc:'2.0',method,params,id}),signal:AbortSignal.timeout(40000)});if(response.headers.get('Mcp-Session-Id'))sid=response.headers.get('Mcp-Session-Id');const text=await response.text();if(!response.ok)throw Error(method+': '+response.status+' '+text);
   if(!text)return null;return JSON.parse(text.startsWith('event:')||text.startsWith('data:')?text.split('\n').find(x=>x.startsWith('data:')).slice(5):text);
  };
  const init=await mcp('initialize',{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'owned-source-verification',version:'1'}},1);await mcp('notifications/initialized',{},undefined);steps.push({name:'live-packaged-MCP-handshake',pass:Boolean(init?.result?.serverInfo)});
  const read=await mcp('tools/call',{name:'read_files',arguments:{files:[{path:'hello.ts'}]}},2);steps.push({name:'live-packaged-MCP-read',pass:!read.result.isError&&JSON.stringify(read).includes('source-edit-save-ok')});
  const ownedPatchFile=path.join(fixture,'mcp-owned.txt');if(fs.existsSync(ownedPatchFile)){if(fs.readFileSync(ownedPatchFile,'utf8').trim()!=='MCP_SOURCE_WRITE_OK')throw Error('Unexpected preexisting fixture');fs.unlinkSync(ownedPatchFile);}const patch=await mcp('tools/call',{name:'apply_patch',arguments:{patch:'*** Begin Patch\n*** Add File: mcp-owned.txt\n+MCP_SOURCE_WRITE_OK\n*** End Patch\n'}},3);steps.push({name:'live-packaged-MCP-patch',pass:!patch.result.isError&&fs.readFileSync(path.join(fixture,'mcp-owned.txt'),'utf8').includes('MCP_SOURCE_WRITE_OK')});
  const command=await mcp('tools/call',{name:'run_command',arguments:{command:'printf SOURCE_TERMINAL_OK','cwd':'.','timeout_ms':10000}},4);steps.push({name:'live-packaged-MCP-terminal',pass:!command.result.isError&&command.result.structuredContent?.exit_code===0&&String(command.result.structuredContent?.output||'').includes('SOURCE_TERMINAL_OK')});
  await control('command',{command:'shuncode.bridge.openSession'});await win.waitForTimeout(1500);report.bridgePageText=(await win.locator('body').innerText()).slice(-18000);await shot('bridge-source.png');
  steps.push({name:'Bridge-settings-and-session-UI',pass:report.bridgePageText.includes('BRIDGE')||report.bridgePageText.includes('Bridge')});
  await control('command',{command:'shuncode.openChat'});await win.waitForTimeout(1000);
  report.chatControls=await win.locator('button,[role=button],[role=combobox]').evaluateAll(es=>es.map(e=>({text:e.textContent,aria:e.getAttribute('aria-label'),title:e.getAttribute('title')})).filter(e=>e.text||e.aria));
  report.chatText=await win.locator('body').innerText();await shot('chat-source.png');
  // Configure the provider through the real public model-group action; legacy settings are intentionally not advertised.
  await control('command',{command:'lm.addLanguageModelsProviderGroup',args:[{name:'Owned local fixture',vendor:'shuncode',baseUrl:modelUrl,apiKey:'source-local-fixture-key',protocol:'openai-chat-completions',modelIds:'source-fixture'}]});
  for(let i=0;i<40;i++){const state=await control('status');if(state.models?.length){report.configuredModels=state.models;break;}await sleep(500);}
  if(!report.configuredModels?.length)throw Error('Configured provider did not expose real models');
  const codeFile=path.join(fixture,'code-mode-owned.txt');if(fs.existsSync(codeFile)){if(fs.readFileSync(codeFile,'utf8').trim()!=='CODE_AGENT_TOOL_OK')throw Error('Unexpected preexisting Code fixture');fs.unlinkSync(codeFile);}
  // Exercise the real registered participant, runtime and rendered UI in each custom mode.
  for(const mode of ['ASK','PLAN','CODE']){
   const responseMarker='SOURCE_FIXTURE_'+mode+'_OK';
   await control('command',{command:'workbench.action.chat.open',args:[{query:'SOURCE_FIXTURE_'+mode,mode:'ShunCode '+mode[0]+mode.slice(1).toLowerCase(),modelSelector:{vendor:'shuncode'},isPartialQuery:false}]});
   const started=Date.now();let visible=false;
   while(Date.now()-started<45000){const text=await win.locator('body').innerText();if(text.includes(responseMarker)){visible=true;break;}await sleep(500);}
   const request=requests.find(r=>r.mode===mode);
   steps.push({name:'real-GUI-'+mode+'-provider-runtime-stream',pass:visible&&Boolean(request),requestSeen:Boolean(request),responseVisible:visible,toolNames:request?.tools});
   await shot('chat-'+mode.toLowerCase()+'-source.png');save();
   if(!visible)throw Error('No rendered '+mode+' response through the actual source pipeline');
  }
  steps.push({name:'Code-mode-real-agent-file-edit',pass:fs.existsSync(codeFile)&&fs.readFileSync(codeFile,'utf8').trim()==='CODE_AGENT_TOOL_OK'});
  for(const mode of ['ASK','PLAN']){const r=requests.find(r=>r.mode===mode);steps.push({name:mode+'-read-only-tool-surface',pass:Boolean(r)&&!r.tools.includes('apply_patch')&&!r.tools.includes('run_command')});}
  const background=await mcp('tools/call',{name:'run_command',arguments:{command:'sleep 30',cwd:'.',background:true,timeout_ms:1000}},30);
  const ownedCommand=background.result?.structuredContent?.command_id;if(!ownedCommand)throw Error('No real managed command handle');
  const cancelled=await mcp('tools/call',{name:'cancel_command',arguments:{command_id:ownedCommand,grace_ms:1000}},31);
  steps.push({name:'live-packaged-terminal-cancellation',pass:!cancelled.result.isError&&cancelled.result.structuredContent?.cancel_requested===true});
  const revocation=control('command',{command:'shuncode.bridge.security.revokeAll'});revocation.catch(()=>{});await sleep(1000);
  const restricted=await mcp('tools/list',{},32);const names=restricted.result.tools.map(t=>t.name);
  const denied=await mcp('tools/call',{name:'run_command',arguments:{command:'printf SHOULD_NOT_RUN'}},33);
  steps.push({name:'live-packaged-permission-revocation',pass:!names.includes('run_command')&&denied.result.isError===true});
  report.pageErrors=consoleErrors;report.status='complete';save();
 }catch(e){report.status='failed';report.error=e.stack||e.message;report.pageErrors=consoleErrors;try{if(win){report.failureBody=await win.locator('body').innerText();await shot('failure.png');}}catch{}save();}
 finally{if(app)await app.close().catch(e=>processLogs.push('close:'+e.message));await new Promise(r=>model.close(r));save();}
 console.log(JSON.stringify({status:report.status,steps,error:report.error,activation:report.activation,bridge:report.bridgeState,chatControls:report.chatControls,chatText:report.chatText,pageErrors:report.pageErrors},null,2).slice(0,21000));if(report.status==='failed'||steps.some(s=>!s.pass))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
