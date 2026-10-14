"use strict";
const fs=require("node:fs");
exports.run=async function() {
  const vscode=require("vscode");
  const result={passed:false};
  try {
    const extension=vscode.extensions.getExtension("shuncode.shuncode");
    if(!extension)throw new Error("ShunCode extension not discovered");
    await extension.activate();
    const commands=await vscode.commands.getCommands(true);
    for(const action of ["manage","revokeAll","disconnect","status","defaults"])if(!commands.includes("shuncode.bridge.security."+action))throw new Error("Missing permission command: "+action);
    const status=await vscode.commands.executeCommand("shuncode.bridge.getStatus");
    if(!status?.security?.defaultPermissions?.terminal || !status?.security?.defaultPermissions?.customTools || status?.security?.grantsExpire!==false)throw new Error("Permanent default flags are not active");
    if(status?.security?.defaultMode!=="device")throw new Error("Actual editor did not load the permanent device security layer");
    if(status?.buildInfo?.version!=="0.7.10")throw new Error("Actual editor loaded an unexpected build");
    await vscode.commands.executeCommand("shuncode.bridge.security.status");
    Object.assign(result,{passed:true,version:status.buildInfo.version,loadedFrom:status.buildInfo.loadedFrom,defaultMode:status.security.defaultMode,defaultPermissions:status.security.defaultPermissions,grantsExpire:status.security.grantsExpire,commands:commands.filter(x=>x.startsWith("shuncode.bridge.security."))});
  }catch(error){result.error=error instanceof Error?error.message:String(error);throw error;}
  finally{if(process.env.SHUNCODE_SMOKE_RESULT)fs.writeFileSync(process.env.SHUNCODE_SMOKE_RESULT,JSON.stringify(result,null,2));}
};
