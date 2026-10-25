'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),vm=require('node:vm'),crypto=require('node:crypto'),{createRequire}=require('node:module'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'../..'),base=path.join(root,'artifacts/source-build/validation/final-stage');
(async()=>{
 const results=[];
 for(const name of ['extension','agent-host','mcp-server']){
  const input=path.join(base,'repaired-'+name,'modules/entry.js'),output=path.join(base,'verified-'+name+'.cjs');
  try{
   const build=await esbuild.build({absWorkingDir:root,entryPoints:[input],outfile:output,bundle:true,platform:'node',format:'cjs',target:'node22',external:['vscode'],metafile:true,sourcemap:'external',logLevel:'silent'});
   fs.writeFileSync(output+'.metafile.json',JSON.stringify(build.metafile,null,2)+'\n');
   const result={name,bundle:'passed',input_count:Object.keys(build.metafile.inputs).length,sha256:crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex'),runtime_tests:[]};
   if(name==='agent-host'){
    const run=cp.spawnSync(process.execPath,[output],{input:'',encoding:'utf8',timeout:15000,cwd:base});
    result.runtime_tests.push({test:'closed-stdin',pass:run.status===0,exit_code:run.status,stderr:run.stderr});
   }else if(name==='mcp-server'){
    const run=cp.spawnSync(process.execPath,['-e',`const m=require(${JSON.stringify(output)});if(typeof m.createFileToolsServer!=='function')throw Error('Missing actual export');const s=m.createFileToolsServer([${JSON.stringify(base)}]);if(!s)throw Error('Factory failed');console.log('MCP_FACTORY_OK');`],{input:'',encoding:'utf8',timeout:15000,cwd:base});
    result.runtime_tests.push({test:'export-and-real-server-factory',pass:run.status===0,exit_code:run.status,stdout:run.stdout,stderr:run.stderr});
   }else{
    class EventEmitter{event=()=>({dispose(){}});fire(){}dispose(){}}
    const req=createRequire(output),mod={exports:{}};
    const context={module:mod,exports:mod.exports,require:id=>id==='vscode'?{EventEmitter}:req(id),__filename:output,__dirname:path.dirname(output),process,Buffer,URL,URLSearchParams,TextEncoder,TextDecoder,AbortController,AbortSignal,Headers,Request,Response,DOMException,fetch,console,setTimeout,clearTimeout,setInterval,clearInterval,setImmediate,clearImmediate,queueMicrotask,structuredClone};context.global=context;
    vm.runInNewContext(fs.readFileSync(output,'utf8'),context,{filename:output,timeout:15000});
    result.runtime_tests.push({test:'actual-extension-export-load',pass:typeof mod.exports.activate==='function'&&typeof mod.exports.deactivate==='function',exports:Object.keys(mod.exports)});
   }
   result.status=result.runtime_tests.every(x=>x.pass)?'passed':'failed';results.push(result);
  }catch(error){results.push({name,status:'failed',error:error.stack,build_errors:error.errors?.map(x=>x.text)});}
 }
 fs.writeFileSync(path.join(base,'wakaru-linkage-verification.json'),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
 if(results.some(x=>x.status!=='passed'))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
