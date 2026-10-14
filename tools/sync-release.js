#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),cp=require("node:child_process");
const root=path.resolve(__dirname,"..");
const hash=data=>crypto.createHash("sha256").update(data).digest("hex");
function sync(app,{apply=false}={}) {
  app=path.resolve(app);
  if(!fs.existsSync(path.join(app,"ShunCode.exe")) || !fs.existsSync(path.join(app,"resources/app/product.json")))throw new Error("Not a ShunCode app directory");
  cp.execFileSync(process.execPath,[path.join(root,"tools/build-extension.js"),"--check"],{stdio:"inherit"});
  const targetRoot=path.join(app,"resources/app/extensions/shuncode");
  const files=["package.json","dist/extension.js","dist/build-info.json","runtime/agent-host.js","runtime/mcp-server.js",...fs.readdirSync(path.join(root,"extension/src")).filter(n=>/\.(ts|mts|js|d\.ts)$/.test(n)).map(n=>"src/"+n)];
  const entries=files.map(file=>({file:"resources/app/extensions/shuncode/"+file,src:path.join(root,"extension",file),dst:path.join(targetRoot,file)}));
  for(const file of ["README.md","docs/SECURITY.md","docs/RELEASING.md","docs/mcp-v0.7.9-maintenance.md","docs/mcp-v0.7.10-permanent-permissions.md"])if(fs.existsSync(path.join(root,file)))entries.push({file,src:path.join(root,file),dst:path.join(app,file)});
  const changes=entries.map(x=>({...x,data:fs.readFileSync(x.src),old:fs.existsSync(x.dst)?fs.readFileSync(x.dst):null})).filter(x=>!x.old || hash(x.data)!==hash(x.old));
  const version=JSON.parse(fs.readFileSync(path.join(root,"version.json"),"utf8")).version;
  const backup=path.join(path.dirname(app),"..","ShunCode-maintenance-backups",version+"-"+Date.now());
  console.log(JSON.stringify({app,apply,changes:changes.map(x=>x.file),backup},null,2));
  if(!apply)return;
  fs.mkdirSync(backup,{recursive:true});
  const installed=[];
  try {
    for(const x of changes) {
      if(x.old){const f=path.join(backup,x.file);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,x.old);}
      if(fs.existsSync(x.dst) && (!x.old || hash(fs.readFileSync(x.dst))!==hash(x.old)))throw new Error("Destination changed during sync: "+x.file);
      fs.mkdirSync(path.dirname(x.dst),{recursive:true});const staged=x.dst+".shuncode-stage";
      fs.writeFileSync(staged,x.data);fs.renameSync(staged,x.dst);installed.push(x);
    }
    for(const x of changes)if(hash(fs.readFileSync(x.dst))!==hash(x.data))throw new Error("Sync verification failed: "+x.file);
    fs.writeFileSync(path.join(backup,"manifest.json"),JSON.stringify({version,app,files:changes.map(x=>({path:x.file,old:x.old?hash(x.old):null,new:hash(x.data)}))},null,2)+"\n");
  }catch(error){for(const x of installed.reverse()){if(x.old)fs.writeFileSync(x.dst,x.old);else fs.rmSync(x.dst,{force:true});}throw error;}
  console.log("Sync verified. Running extension is unchanged until reload; do not restart an active maintenance Bridge automatically.");
}
if(require.main===module){const i=process.argv.indexOf("--app");if(i<0 || !process.argv[i+1])throw new Error("Usage: node tools/sync-release.js --app <app> [--apply]");sync(process.argv[i+1],{apply:process.argv.includes("--apply")});}
module.exports={sync};
