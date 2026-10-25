'use strict';
// Evidence-driven module/linkage reconstruction. Never executes the input application.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const tooling='E:/项目管理/ShunCode-源码重建/ast-tooling/node_modules';
const parser=require(tooling+'/@babel/parser'), traverse=require(tooling+'/@babel/traverse').default, generate=require(tooling+'/@babel/generator').default,t=require(tooling+'/@babel/types');
const root='E:/项目管理/ShunCode-源码重建', app='D:/ShunCode/resources/app', out=path.join(root,'reconstructed'), upstream=path.join(root,'upstream/archive/vscode-1.132.0');
fs.mkdirSync(out,{recursive:true});const all=[];
function sha(text){return crypto.createHash('sha256').update(text).digest('hex');}
function recover(name,relative){
 const input=path.join(app,relative),text=fs.readFileSync(input,'utf8'), ast=parser.parse(text,{sourceType:'unambiguous',allowReturnOutsideFunction:true});
 const headers=(ast.comments||[]).filter(c=>c.type==='CommentLine'&&c.loc.start.column===0&&/^(?:src\/|extensions\/|node_modules\/|<define:)/.test(c.value.trim())).map(c=>({start:c.start,name:c.value.trim()}));
 const chunks=new Map(), owners=new Map(); let hi=0,current='__bundle-runtime';
 for(const node of ast.program.body){while(hi<headers.length&&headers[hi].start<node.start)current=headers[hi++].name; if(!chunks.has(current))chunks.set(current,{origin:current,nodes:[],bindings:[],dependencies:new Map()});chunks.get(current).nodes.push(node);owners.set(node,current);}
 function owner(p){while(p&&p.parentPath&&!p.parentPath.isProgram())p=p.parentPath;return p?owners.get(p.node):null;}
 traverse(ast,{Program(p){p.scope.crawl(); for(const [name,b] of Object.entries(p.scope.bindings)){
  const own=owner(b.path);if(!own)throw new Error('Unowned binding '+name);chunks.get(own).bindings.push(name);
  for(const use of [...b.referencePaths,...b.constantViolations]){const other=owner(use);if(!other||other===own)continue;const dep=chunks.get(other).dependencies;if(!dep.has(own))dep.set(own,new Set());dep.get(own).add(name);}
 }p.stop();}});
 const dir=path.join(out,name), files=new Map();
 function filename(origin){let s=origin==='__bundle-runtime'?'runtime/helpers':origin.startsWith('<define:')?'runtime/build-info':origin.replace(/^node_modules\//,'vendor/');return s.replace(/\.(?:[cm]?[jt]sx?)$/, '')+'.mjs';}
 for(const [origin,c]of chunks)files.set(origin,path.join(dir,'modules',filename(origin)));
 const metadata=[];
 for(const [origin,c]of chunks){const file=files.get(origin);fs.mkdirSync(path.dirname(file),{recursive:true});
  const imports=[];for(const [dep,names]of c.dependencies){let spec=path.relative(path.dirname(file),files.get(dep)).replaceAll('\\','/');if(!spec.startsWith('.'))spec='./'+spec;imports.push(t.importDeclaration([...names].sort().map(n=>t.importSpecifier(t.identifier(n),t.identifier(n))),t.stringLiteral(spec)));}
  const exports=c.bindings.length?[t.exportNamedDeclaration(null,c.bindings.map(n=>t.exportSpecifier(t.identifier(n),t.identifier(n))))]:[];
  const body=generate(t.file(t.program([...imports,...c.nodes,...exports])),{comments:true,compact:false}).code+'\n';
  const nodeSource=c.nodes.map(n=>text.slice(n.start,n.end)).join('\n');
  const provenance={original_module:origin,input_artifact:relative,input_sha256:sha(text),source_ranges:c.nodes.map(n=>({start:n.start,end:n.end,start_line:n.loc.start.line,end_line:n.loc.end.line})),classification:origin.startsWith('node_modules/')?'recovered-vendored-dependency':'recovered-javascript-implementation',runtime_equivalence:'not-yet-verified',output_sha256:sha(body)};
  fs.writeFileSync(file,'// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.\n'+body);
  metadata.push({...provenance,file:path.relative(dir,file).replaceAll('\\','/'),bindings:c.bindings,dependencies:[...c.dependencies].map(([p,n])=>({module:p,names:[...n].sort()})),initializers:c.bindings.filter(n=>n.startsWith('init_')),bytes:Buffer.byteLength(nodeSource)});
 }
 const manifest={schema:1,entry:name,input:relative,input_sha256:sha(text),module_count:metadata.length,modules:metadata,limitations:['Original TypeScript interfaces, type annotations and comments absent from the bundle cannot be recovered.','Generated import linkage and lazy-initialization order require build and behavior validation.','Vendored third-party executable JavaScript is reconstructed as separate modules; official package sources are preferred where available.']};
 fs.writeFileSync(path.join(dir,'provenance.json'),JSON.stringify(manifest,null,2)+'\n');
 const notices=(ast.comments||[]).filter(c=>c.type==='CommentBlock'&&/license|copyright/i.test(c.value)).map(c=>'/*'+c.value+'*/').join('\n\n');fs.writeFileSync(path.join(dir,'THIRD_PARTY_NOTICES.txt'),notices+'\n');
 all.push(manifest);console.log('RECOVERED_GRAPH',JSON.stringify({entry:name,modules:metadata.length,bindings:metadata.reduce((n,m)=>n+m.bindings.length,0),firstParty:metadata.filter(m=>m.original_module.startsWith('src/')).map(m=>({module:m.original_module,bindings:m.bindings,initializers:m.initializers,bytes:m.bytes}))}));
}
recover('extension','extensions/shuncode/dist/extension.js');recover('agent-host','extensions/shuncode/runtime/agent-host.js');recover('mcp-server','extensions/shuncode/runtime/mcp-server.js');
// Missing Code-OSS modules and callers of ShunCode-specific modules.
for(const rel of ['out/vs/workbench/workbench.desktop.main.js','out/vs/sessions/sessions.desktop.main.js','out/main.js']){const text=fs.readFileSync(path.join(app,rel),'utf8');const labels=[...new Set([...text.matchAll(/^\/\/ (src\/[^\r\n]+\.[cm]?[jt]s)$/gm)].map(m=>m[1]))];const missing=labels.filter(s=>!fs.existsSync(path.join(upstream,s)));console.log('EDITOR_MISSING_SOURCE_MODULES',JSON.stringify({bundle:rel,missing}));}
fs.writeFileSync(path.join(out,'recovery-index.json'),JSON.stringify(all.map(a=>({entry:a.entry,input:a.input,input_sha256:a.input_sha256,module_count:a.module_count})),null,2)+'\n');
