#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process");
const root=path.resolve(__dirname,"..");
const version=JSON.parse(fs.readFileSync(path.join(root,"version.json"),"utf8")).version;
for(const name of ["package.json","extension/package.json"])if(JSON.parse(fs.readFileSync(path.join(root,name),"utf8")).version!==version)throw new Error("Version mismatch: "+name);
const files=[];
for(const dir of ["tools","test","extension/src","extension/dist","extension/runtime"]) {
  const folder=path.join(root,dir);if(!fs.existsSync(folder))continue;
  for(const entry of fs.readdirSync(folder,{withFileTypes:true}))if(entry.isFile() && entry.name.endsWith(".js"))files.push(path.join(folder,entry.name));
}
for(const file of files)cp.execFileSync(process.execPath,["--check",file],{stdio:"inherit"});
const manifest=JSON.parse(fs.readFileSync(path.join(root,"extension/package.json"),"utf8"));
for(const id of ["manage","revokeAll","disconnect","status"])if(!manifest.contributes.commands.some(c=>c.command==="shuncode.bridge.security."+id))throw new Error("Missing permission command: "+id);
console.log("Syntax, version and command checks passed ("+files.length+" JavaScript files). Full legacy TypeScript compilation is not claimed.");
