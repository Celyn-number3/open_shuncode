'use strict';
// Source-only linkage repair for Wakaru output. Original producer bytes stay intact.
// This repairs proven lexical ownership, not original TypeScript or arbitrary equivalence.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const tooling=process.env.SHUNCODE_AST_TOOLING;
if(!tooling)throw Error('Provide SHUNCODE_AST_TOOLING containing Babel parser/traverse/generator');
const parser=require(path.join(tooling,'@babel/parser'));
const traverse=require(path.join(tooling,'@babel/traverse')).default;
const generate=require(path.join(tooling,'@babel/generator')).default;
const t=require(path.join(tooling,'@babel/types'));
const [input,output]=process.argv.slice(2);
if(!input||!output||fs.existsSync(output))throw Error('Input and absent output directory required');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const relative=(from,to)=>{let p=path.relative(path.dirname(from),to).replaceAll('\\','/');return p.startsWith('.')?p:'./'+p;};
const globals=new Set(['undefined','NaN','Infinity','globalThis','global','Object','Function','Boolean','Symbol','Error','AggregateError','EvalError','RangeError','ReferenceError','SyntaxError','TypeError','URIError','Number','BigInt','Math','Date','String','RegExp','Array','Int8Array','Uint8Array','Uint8ClampedArray','Int16Array','Uint16Array','Int32Array','Uint32Array','Float32Array','Float64Array','BigInt64Array','BigUint64Array','Map','Set','WeakMap','WeakSet','WeakRef','FinalizationRegistry','ArrayBuffer','SharedArrayBuffer','Atomics','DataView','JSON','Promise','Generator','Reflect','Proxy','Intl','WebAssembly','decodeURI','decodeURIComponent','encodeURI','encodeURIComponent','escape','unescape','isFinite','isNaN','parseFloat','parseInt','eval','console','process','Buffer','require','module','exports','__dirname','__filename','setTimeout','clearTimeout','setInterval','clearInterval','setImmediate','clearImmediate','queueMicrotask','URL','URLSearchParams','TextEncoder','TextDecoder','AbortController','AbortSignal','Headers','Request','Response','fetch','ReadableStream','WritableStream','TransformStream','Blob','File','FormData','navigator','performance','crypto','structuredClone','atob','btoa','window','self','document','DOMException','localStorage','arguments']);
const files=walk(path.join(input,'modules')).filter(f=>f.endsWith('.js'));
const modules=new Map(files.map(file=>[file,{file,ast:parser.parse(fs.readFileSync(file,'utf8'),{sourceType:'module',allowReturnOutsideFunction:true}),imports:new Map(),exports:new Set()}]));
const repairs=[];
// Pure bundle intrinsics must initialize before dependent module evaluation.
const entry=modules.get(path.join(input,'modules','entry.js'));
const intrinsics=['__create','__defProp','__getOwnPropDesc','__getOwnPropNames','__getProtoOf','__hasOwnProp'];
const moved=[];
for(const node of [...entry.ast.program.body]){
 if(!t.isVariableDeclaration(node))continue;
 node.declarations=node.declarations.filter(d=>{
  if(t.isIdentifier(d.id)&&intrinsics.includes(d.id.name)&&t.isMemberExpression(d.init)&&(t.isIdentifier(d.init.object,{name:'Object'}) || (t.isMemberExpression(d.init.object) && t.isIdentifier(d.init.object.object,{name:'Object'})))){
   moved.push(t.variableDeclaration(node.kind,[d]));return false;
  }
  return true;
 });
}
entry.ast.program.body=entry.ast.program.body.filter(n=>!t.isVariableDeclaration(n)||n.declarations.length);
if(moved.length){
 const file=path.join(input,'modules','_shuncode_bundle_intrinsics.js');
 const names=moved.map(n=>n.declarations[0].id.name);
 modules.set(file,{file,ast:t.file(t.program([...moved,t.exportNamedDeclaration(null,names.map(n=>t.exportSpecifier(t.identifier(n),t.identifier(n))))])),imports:new Map(),exports:new Set()});
 for(const n of names)entry.imports.set(n,file);
 repairs.push({kind:'initialize-pure-intrinsics-before-import-evaluation',symbols:names});
}
// Zod's registry is intentionally a global singleton; avoid a cyclic entry import.
let needsRegistry=false;
for(const m of modules.values()){
 traverse(m.ast,{Program(p){const b=p.scope.getBinding('globalConfig');
  if(b&&b.path.isVariableDeclarator()&&t.isMemberExpression(b.path.node.init)&&t.isIdentifier(b.path.node.init.object,{name:'globalThis'})&&t.isIdentifier(b.path.node.init.property,{name:'__zod_globalConfig'})){
   const declaration=b.path.parentPath;b.path.remove();if(declaration.node&&declaration.node.declarations.length===0)declaration.remove();needsRegistry=true;
  }
  p.stop();}});
}
if(needsRegistry){
 const file=path.join(input,'modules','_shuncode_zod_registry.js');
 const ast=parser.parse('export const globalConfig = globalThis.__zod_globalConfig ?? (globalThis.__zod_globalConfig = {});',{sourceType:'module'});
 modules.set(file,{file,ast,imports:new Map(),exports:new Set()});repairs.push({kind:'preserve-global-singleton',symbol:'globalConfig',property:'globalThis.__zod_globalConfig'});
 for(const m of modules.values()){if(m.file===file)continue;for(const node of [...m.ast.program.body])if(t.isImportDeclaration(node)){const previous=node.specifiers.length;node.specifiers=node.specifiers.filter(s=>!(t.isImportSpecifier(s)&&t.isIdentifier(s.imported,{name:'globalConfig'})));if(node.specifiers.length!==previous){m.imports.set('globalConfig',file);if(!node.specifiers.length)m.ast.program.body=m.ast.program.body.filter(n=>n!==node);}}}
}
const owners=new Map();
for(const m of modules.values())traverse(m.ast,{Program(p){p.scope.crawl();for(const [name,b] of Object.entries(p.scope.bindings))if(b.kind!=='module'){const candidates=owners.get(name)||[];candidates.push(m.file);owners.set(name,candidates);}p.stop();}});
const unresolved=[],ambiguous=[];
for(const m of modules.values()){
 traverse(m.ast,{ReferencedIdentifier(p){const name=p.node.name;if(p.scope.hasBinding(name,true)||globals.has(name))return;
  const candidates=owners.get(name)||[];
  if(candidates.length===1&&candidates[0]!==m.file){m.imports.set(name,candidates[0]);modules.get(candidates[0]).exports.add(name);}
  else if(candidates.length===0)unresolved.push({file:path.relative(input,m.file).replaceAll('\\','/'),symbol:name});
  else ambiguous.push({file:path.relative(input,m.file).replaceAll('\\','/'),symbol:name,owners:candidates.map(f=>path.relative(input,f).replaceAll('\\','/'))});
 }});
 // Do not evaluate namespace default wrappers before their local definitions.
 const defaults=m.ast.program.body.filter(n=>t.isExportDefaultDeclaration(n));
 m.ast.program.body=[...m.ast.program.body.filter(n=>!t.isExportDefaultDeclaration(n)),...defaults];
 if(defaults.length)repairs.push({kind:'defer-default-namespace-wrapper',file:path.relative(input,m.file).replaceAll('\\','/')});
}
fs.mkdirSync(output,{recursive:false});
for(const m of modules.values()){
 const byFile=new Map();for(const [name,file] of m.imports){if(!byFile.has(file))byFile.set(file,[]);byFile.get(file).push(name);}
 const imports=[...byFile].map(([file,names])=>t.importDeclaration(names.sort().map(n=>t.importSpecifier(t.identifier(n),t.identifier(n))),t.stringLiteral(relative(m.file,file))));
 const already=new Set();for(const node of m.ast.program.body)if(t.isExportNamedDeclaration(node)){
  for(const spec of node.specifiers||[])if(t.isIdentifier(spec.local))already.add(spec.local.name);
  if(node.declaration&&t.isVariableDeclaration(node.declaration))for(const d of node.declaration.declarations)if(t.isIdentifier(d.id))already.add(d.id.name);
  if(node.declaration&&(t.isFunctionDeclaration(node.declaration)||t.isClassDeclaration(node.declaration)))already.add(node.declaration.id.name);
 }
 const names=[...m.exports].filter(n=>!already.has(n));
 m.ast.program.body=[...imports,...m.ast.program.body,...(names.length?[t.exportNamedDeclaration(null,names.map(n=>t.exportSpecifier(t.identifier(n),t.identifier(n))))]:[])];
 const dest=path.join(output,path.relative(input,m.file));fs.mkdirSync(path.dirname(dest),{recursive:true});
 const body='// Repaired lexical linkage derived from actual Wakaru source. See LINKAGE_REPAIR.json.\n'+generate(m.ast,{comments:true}).code+'\n';
 fs.writeFileSync(dest,body);
 repairs.push({kind:'lexical-cross-module-linkage',file:path.relative(input,m.file).replaceAll('\\','/'),imports:[...m.imports].map(([symbol,owner])=>({symbol,owner:path.relative(input,owner).replaceAll('\\','/')})),exports:names,sha256:crypto.createHash('sha256').update(body).digest('hex')});
}
const unique=items=>[...new Map(items.map(x=>[JSON.stringify(x),x])).values()];
const receipt={schema:1,input,output,source_only:true,original_producer_unchanged:true,repairs,unresolved:unique(unresolved),ambiguous:unique(ambiguous),runtime_equivalence:'not-proven'};
fs.writeFileSync(path.join(output,'LINKAGE_REPAIR.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({files:modules.size,unresolved:receipt.unresolved,ambiguous:receipt.ambiguous},null,2));
