#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),cp=require("node:child_process");
const root=path.resolve(__dirname,"..");
const digest=buffer=>crypto.createHash("sha256").update(buffer).digest("hex");
const baselines={
  "extension.js":"3c1fc64a8d78ee6f151608f4eb8071cc10ef1fff8cad80238653148d1d84c8d0",
  "agent-host.js":"0d036c8504ab442fc0823fb750385df552cea3d2527bf20e8e44d83f36f670aa",
  "mcp-server.js":"9e35d97fe29c5009c4741381d10f662f4cf784d528b1b73166d0cb836bc54976",
};
function replaceOnce(source,needle,replacement) {
  if(source.split(needle).length!==2)throw new Error("Incompatible baseline anchor: "+needle.slice(0,100));
  return source.replace(needle,replacement);
}
function inputHash() {
  const files=["version.json","extension/package.json","extension/src/bridge-security.js","extension/src/bridge-security-policy.js","extension/src/extension.ts","tools/build-extension.js","tools/check-project.js","tools/sync-release.js","tools/package_release.py","package.json","package-lock.json"];
  return digest(Buffer.concat(files.flatMap(file=>[Buffer.from(file+"\0"),Buffer.from(fs.readFileSync(path.join(root,file),"utf8").replace(/^\uFEFF/,"").replace(/\r\n/g,"\n"))])));
}
function build({check=false,capture=false}={}) {
  const version=JSON.parse(fs.readFileSync(path.join(root,"version.json"),"utf8"));
  const manifest=JSON.parse(fs.readFileSync(path.join(root,"extension/package.json"),"utf8"));
  if(manifest.version!==version.version)throw new Error("Manifest/version.json mismatch");
  const legacy=path.join(root,"extension/legacy");
  if(capture)fs.mkdirSync(legacy,{recursive:true});
  for(const [name,hash]of Object.entries(baselines)) {
    const stored=path.join(legacy,name);
    if(!fs.existsSync(stored)) {
      if(!capture)throw new Error("Missing audited baseline; run npm run build:bootstrap once");
      const current=path.join(root,name==="extension.js"?"extension/dist/extension.js":"extension/runtime/"+name);
      const data=Buffer.from(fs.readFileSync(current,"utf8").replace(/^\uFEFF/,"").replace(/\r\n/g,"\n"));
      if(digest(data)!==hash)throw new Error("Baseline SHA-256 mismatch: "+name);
      fs.writeFileSync(stored,data);
    }
    if(digest(fs.readFileSync(stored))!==hash)throw new Error("Audited legacy baseline changed: "+name);
  }
  let revision="unknown",dirty=true;
  try {revision=cp.execFileSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8"}).trim();dirty=!!cp.execFileSync("git",["status","--porcelain","--untracked-files=no","--","version.json","package.json","package-lock.json","extension/package.json","extension/src/bridge-security.js","extension/src/bridge-security-policy.js","extension/src/extension.ts","tools/build-extension.js","tools/check-project.js","tools/sync-release.js","tools/package_release.py"],{cwd:root,encoding:"utf8"}).trim();}catch{}
  const previousFile=path.join(root,"extension/dist/build-info.json");
  const previous=fs.existsSync(previousFile)?JSON.parse(fs.readFileSync(previousFile,"utf8")):null;
  const metadata=check && previous ? previous : {version:version.version,sourceRevision:revision,sourceHash:inputHash(),builtAt:version.buildEpoch,release:false,sourceDirty:dirty,buildKind:"audited-legacy-augmentation",fullSourceBuild:false};
  if(metadata.version!==version.version || metadata.sourceHash!==inputHash())throw new Error("Stale build inputs");
  let bundle=fs.readFileSync(path.join(legacy,"extension.js"),"utf8").replace(/\r\n/g,"\n");
  const activation=/function activate\(context\) \{\n  const output = (\w+)\.window\.createOutputChannel\("ShunCode"\);/;
  const match=bundle.match(activation);if(!match)throw new Error("Missing activation anchor");
  bundle=replaceOnce(bundle,"  const bridgeAccess = new BridgeAccessController(bridge);","  require(\"../src/bridge-security.js\").registerBridgeSecurity("+match[1]+", context, bridge, require(\"./build-info.json\"));\n  const bridgeAccess = new BridgeAccessController(bridge);");
  bundle=replaceOnce(bundle,'var SHUNCODE_BEHAVIOR_VERSION = "0.7.6";', 'var SHUNCODE_BEHAVIOR_VERSION = '+JSON.stringify(version.version)+';');
  const define=/define_SHUNCODE_BUILD_INFO_default = \{ version: "0\.7\.6", gitSha: "nogit", builtAt: "[^"]+", release: true \};/;
  if((bundle.match(new RegExp(define.source,"g"))||[]).length!==1)throw new Error("Build metadata anchor mismatch");
  bundle=bundle.replace(define,"define_SHUNCODE_BUILD_INFO_default = "+JSON.stringify({version:metadata.version,gitSha:metadata.sourceRevision,builtAt:metadata.builtAt,release:false})+";");
  bundle=replaceOnce(bundle,'"tools/list": { ttlMs: 6e4, cacheScope: "public" }','"tools/list": { ttlMs: 0, cacheScope: "private" }');
  const permissionInstructions="MCP permissions are enforced per connection. New connections are read-only. File changes require local project permission; terminal/input/output and all custom tools require a separate, time-limited local device grant. Agents cannot grant themselves permission. Project mode is not a terminal sandbox. Use the local ShunCode permissions command for consent.";
  const scope=/function bridgeWorkspaceScopeInstructions\(scope\) \{[\s\S]*?\n\}/;
  if(!scope.test(bundle))throw new Error("Scope instruction anchor mismatch");
  bundle=bundle.replace(scope,"function bridgeWorkspaceScopeInstructions(scope) {\n  return "+JSON.stringify(permissionInstructions)+";\n}");
  const outputs={"extension/dist/extension.js":bundle,"extension/dist/build-info.json":JSON.stringify(metadata,null,2)+"\n"};
  for(const name of ["agent-host.js","mcp-server.js"]) {
    let text=fs.readFileSync(path.join(legacy,name),"utf8").replace(/\r\n/g,"\n");
    text=text.replace(/(var SHUNCODE_BEHAVIOR_VERSION = )"0\.7\.6";/g,"$1"+JSON.stringify(version.version)+";");
    text=text.replace(/define_SHUNCODE_BUILD_INFO_default = \{ version: "0\.7\.6", gitSha: "nogit", builtAt: "[^"]+", release: true \};/g,"define_SHUNCODE_BUILD_INFO_default = "+JSON.stringify({version:metadata.version,gitSha:metadata.sourceRevision,builtAt:metadata.builtAt,release:false})+";");
    outputs["extension/runtime/"+name]=text;
  }
  for(const [file,text]of Object.entries(outputs)) {
    const target=path.join(root,file);
    if(check) {if(fs.readFileSync(target,"utf8")!==text)throw new Error("Generated artifact out of sync: "+file);}
    else {fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,text);}
  }
  return metadata;
}
if(require.main===module) {
  const result=build({check:process.argv.includes("--check"),capture:process.argv.includes("--capture-baseline")});
  console.log(JSON.stringify(result,null,2));
}
module.exports={build,replaceOnce,baselines};
