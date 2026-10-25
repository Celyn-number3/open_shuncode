'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'..'),out=path.join(root,'artifacts','source-build');
const cp=require('node:child_process');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const sourceFiles=[...files(path.join(root,'src')),...files(path.join(root,'extension','src'))].sort();
const sourceHasher=crypto.createHash('sha256');for(const f of sourceFiles){sourceHasher.update(path.relative(root,f).replaceAll('\\','/'));sourceHasher.update(fs.readFileSync(f));}
const sourceBuildInfo={version:JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8')).version,sourceRevision:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),sourceHash:sourceHasher.digest('hex'),builtAt:new Date().toISOString(),release:false,sourceDirty:!!cp.execFileSync('git',['status','--porcelain'],{cwd:root,encoding:'utf8'}).trim(),buildKind:'reconstructed-extension-source',fullSourceBuild:false};
function hashFile(p){return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');}
async function build(entry,outfile,extra={}){
 const result=await esbuild.build({absWorkingDir:root,entryPoints:[entry],outfile:path.join(out,outfile),bundle:true,platform:'node',format:'cjs',target:'node22',define:{__SHUNCODE_SOURCE_BUILD_INFO__:JSON.stringify(sourceBuildInfo)},external:['vscode'],sourcemap:'external',metafile:true,logLevel:'info',...extra});
 const inputs=Object.keys(result.metafile.inputs).sort();
 const rejected=inputs.filter(f=>!f.startsWith('src/')&&!f.startsWith('extension/src/')&&!f.startsWith('node_modules/')&&f!=='<define:__SHUNCODE_SOURCE_BUILD_INFO__>');
 if(rejected.length)throw new Error('Source-only build rejected unexpected inputs: '+rejected.join(', '));
 for(const f of inputs)if(/(?:^|\/)(?:dist|runtime)\/(?:extension|agent-host|mcp-server)\.js$/.test(f)&&!f.startsWith('node_modules/')&&f!=='<define:__SHUNCODE_SOURCE_BUILD_INFO__>')throw new Error('Old bundle cannot be a compilation input: '+f);
 const record={entry,output:outfile,output_sha256:hashFile(path.join(out,outfile)),input_count:inputs.length,inputs:inputs.map(f=>({file:f,sha256:f==='<define:__SHUNCODE_SOURCE_BUILD_INFO__>'?crypto.createHash('sha256').update(JSON.stringify(sourceBuildInfo)).digest('hex'):hashFile(path.resolve(root,f)),generated:f==='<define:__SHUNCODE_SOURCE_BUILD_INFO__>'})),metafile:result.metafile};
 fs.writeFileSync(path.join(out,outfile+'.build.json'),JSON.stringify(record,null,2)+'\n');return {entry,output:outfile,input_count:inputs.length,output_sha256:record.output_sha256};
}
(async()=>{
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'generated-build-info.json'),JSON.stringify(sourceBuildInfo,null,2)+'\n');const results=[];
 for(const name of ['agent-host','mcp-server'])results.push(await build('src/'+name+'.js','runtime/'+name+'.js'));
 if(!process.argv.includes('--runtimes-only'))results.push(await build('extension/src/extension.ts','extension/dist/extension.js'));
 const receipt={schema:1,application:'ShunCode',scope:process.argv.includes('--runtimes-only')?'agent-and-mcp-source-build':'extension-agent-and-mcp-source-build',built_at:new Date().toISOString(),old_bundle_inputs:false,full_editor_source_build:false,results};
 fs.writeFileSync(path.join(out,'build-receipt.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
