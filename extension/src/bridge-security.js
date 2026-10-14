"use strict";
const { BridgeSecurityPolicy, READ_TOOLS, BUILTIN_TOOLS, redact, redactObject, validateToolPaths } = require("./bridge-security-policy.js");
const DEFAULT_KEY="shuncode.bridge.defaultPermissions";
const DEFAULT_PERMISSIONS=Object.freeze({mode:"device",terminal:true,customTools:true});
function denied(message) { return { isError:true, content:[{type:"text",text:message}], structuredContent:{status:"error",error_code:message.split(":")[0]} }; }
function registerBridgeSecurity(vscode,context,bridge,buildInfo) {
  const dispatcher=bridge.dispatcher, transport=bridge.mcpTransport;
  if(!dispatcher || typeof dispatcher.handleToolCall !== "function" || !transport || typeof transport.registerToolHandlers !== "function") throw new Error("BRIDGE_SECURITY_INCOMPATIBLE: refusing to start an unguarded Bridge");
  const disposables=[];
  const activeControllers=new Map();
  const releaseOwner=owner=>{
    for(const controller of activeControllers.get(owner) ?? [])controller.abort(new Error("BRIDGE_PERMISSION_REVOKED"));
    try { const r=bridge.ideToolBroker.releaseCommandOwner(owner); Promise.resolve(r).catch(()=>{}); } catch {} };
  const policy=new BridgeSecurityPolicy({onRevoke:releaseOwner,defaultPermissions:context.globalState?.get(DEFAULT_KEY,DEFAULT_PERMISSIONS) ?? DEFAULT_PERMISSIONS});
  const log=vscode.window.createOutputChannel("ShunCode 权限与审计"); disposables.push(log);
  const append=bridge.output.appendLine.bind(bridge.output);
  bridge.output.appendLine=message=>append(redact(String(message)));
  const original=dispatcher.handleToolCall;
  dispatcher.handleToolCall=async function(name,args,extra) {
    const owner=extra?.commandOwnerId;
    try {
      // Fail closed on compatibility aliases: an alias must never turn a custom-tool grant into terminal permission.
      if(typeof name !== "string" || (!BUILTIN_TOOLS.has(name) && dispatcher.findCustomToolSafe?.(name)?.name !== name))return denied("BRIDGE_PERMISSION_DENIED: unknown or noncanonical tool name");
      if(!READ_TOOLS.has(name) && !policy.defaultAllows(name) && !transport.sessions?.has(owner?.slice("bridge:".length)))return denied("BRIDGE_SESSION_BINDING_REQUIRED: 提升权限仅支持服务器签发的会话式连接；无状态客户端保持只读。");
      if(!policy.allows(owner,name)) { policy.record(owner,"deny",name); return denied("BRIDGE_PERMISSION_DENIED: 此会话权限不足；请在本机权限管理中调整。项目模式不允许终端或自定义工具。"); }
      if(BUILTIN_TOOLS.has(name))validateToolPaths(name,args ?? {},bridge.workspaceRoots());
      if(!READ_TOOLS.has(name))policy.record(owner,"tool",name);
      if(READ_TOOLS.has(name))return await original.call(this,name,args,extra);
      const controller=new AbortController();
      const abort=()=>controller.abort(extra?.signal?.reason);
      if(extra?.signal?.aborted)abort();else extra?.signal?.addEventListener("abort",abort,{once:true});
      const running=activeControllers.get(owner) ?? new Set();running.add(controller);activeControllers.set(owner,running);
      try{return await original.call(this,name,args,{...extra,signal:controller.signal});}
      finally{extra?.signal?.removeEventListener("abort",abort);running.delete(controller);if(!running.size)activeControllers.delete(owner);}
    } catch(error) {
      const code=error instanceof Error ? error.message : String(error);
      policy.record(owner,"deny",code);
      return denied(redact(code));
    }
  };
  const begin=transport.deps.beginRemoteConversation;
  transport.deps.beginRemoteConversation=owner=>{policy.touch(owner);return begin(owner);};
  const end=transport.deps.endRemoteConversation;
  transport.deps.endRemoteConversation=owner=>{policy.forget(owner);return end(owner);};
  const register=transport.registerToolHandlers;
  transport.registerToolHandlers=function(server,resolveSessionId,taskOwnerId) {
    const set=server.setRequestHandler;
    server.setRequestHandler=function(method,handler) {
      if(method === "tools/list") {
        const originalHandler=handler;
        handler=async (...args)=>{
          const result=await originalHandler(...args);
          const sid=resolveSessionId();
          const owner=typeof sid === "string" && sid.trim() ? "bridge:"+sid.trim() : undefined;
          result.tools=result.tools.filter(tool=>READ_TOOLS.has(tool.name) || (owner && (policy.defaultAllows(tool.name) || transport.sessions?.has(sid)) && policy.allows(owner,tool.name)));
          return result;
        };
      }
      return set.call(this,method,handler);
    };
    try{return register.call(this,server,resolveSessionId,taskOwnerId);}finally{server.setRequestHandler=set;}
  };
  const status=bridge.getStatus;
  bridge.getStatus=function() {
    const result=status.call(this);
    return {...result,activities:redactObject(result.activities),lastError:redact(result.lastError),security:policy.snapshot(),buildInfo:{...buildInfo,loadedFrom:context.extensionPath}};
  };
  const bar=vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right,95); disposables.push(bar);
  bar.command="shuncode.bridge.security.manage";
  function render() {
    const s=policy.snapshot();const elevated=s.sessions.filter(x=>x.mode!=="readOnly");
    bar.text=s.defaultMode==="device" ? "$(warning) MCP 默认整机 · 永久" : elevated.length ? "$(warning) MCP 已授权 "+elevated.length : "$(shield) MCP 默认 "+s.defaultMode;
    bar.tooltip="ShunCode "+buildInfo.version+" · "+buildInfo.sourceRevision.slice(0,12)+"\n会话 "+s.sessions.length+"；终端权限不是沙箱。点击管理权限。";
    bar.show();
  }
  async function pickSession() {
    policy.expire();
    const sessions=[...policy.sessions.values()];
    if(!sessions.length){await vscode.window.showInformationMessage("尚无 MCP 会话。让 AI 连接或调用工具后再管理权限。");return;}
    return vscode.window.showQuickPick(sessions.map(s=>({label:s.id,description:s.mode+(s.terminal?" · 终端":"")+(s.customTools?" · 自定义工具":""),detail:"最后活动 "+new Date(s.lastActivity).toLocaleString(),owner:s.owner})),{title:"选择 MCP 会话（权限仅限此会话）"});
  }
  async function manage(defaults=false) {
    const item=defaults ? null : await pickSession();if(!defaults && !item)return;
    const choice=await vscode.window.showQuickPick([
      {label:"只读 / 撤销权限",mode:"readOnly"},
      {label:"项目文件修改（无终端、无自定义工具）",mode:"project"},
      {label:"整机终端（高风险）",mode:"device",terminal:true},
      {label:"自定义工具（高风险，无终端工具）",mode:"device",customTools:true},
      {label:"整机终端与自定义工具（高风险）",mode:"device",terminal:true,customTools:true},
    ],{title:defaults ? "选择所有连接的永久默认权限（立即应用）" : "选择本次会话永久权限"});if(!choice)return;
    if(!defaults && !transport.sessions?.has(item.owner.slice("bridge:".length)) && ((choice.mode!=="readOnly" && !policy.defaultAllows("apply_patch")) || (choice.terminal && !policy.defaultAllows("run_command")) || (choice.customTools && !policy.defaultAllows("__custom_permission__")))) {
      await vscode.window.showInformationMessage("此连接没有服务器签发的会话，不能安全绑定提升权限。无状态客户端保持只读；请使用支持 Mcp-Session-Id 的会话式连接。");return;
    }
    if(choice.mode!=="readOnly") {
      const answer=await vscode.window.showWarningMessage(choice.mode==="device" ? "允许此 AI 执行本机命令，可能读取、修改项目外文件或向网络发送数据。这不是沙箱。授权不自动过期，直到你手动修改或撤销。" : "允许此 AI 修改打开的项目文件。终端和自定义工具仍被禁止。授权不自动过期，直到你手动修改或撤销。",{modal:true},"永久授权");
      if(answer!=="永久授权")return;
    }
    if(defaults)await updateDefaults(choice);else policy.grant(item.owner,choice);render();
  }
  async function updateDefaults(value) {
    policy.setDefaults(value);render();
    await context.globalState?.update(DEFAULT_KEY,{...policy.defaultPermissions});
  }
  function command(id,fn){disposables.push(vscode.commands.registerCommand(id,fn));}
  command("shuncode.bridge.security.manage",()=>manage(false));
  command("shuncode.bridge.security.defaults",()=>manage(true));
  command("shuncode.bridge.security.revokeAll",async()=>{await updateDefaults({mode:"readOnly",terminal:false,customTools:false});vscode.window.showInformationMessage("已撤销全部授权，并将永久默认权限改为只读；新连接也不会自动恢复整机权限。已请求取消相关执行。");});
  command("shuncode.bridge.security.disconnect",async()=>{
    const item=await pickSession();if(!item)return;
    policy.forget(item.owner,"local-disconnect");releaseOwner(item.owner);
    const sid=item.owner.slice("bridge:".length);
    if(transport.sessions?.has(sid))transport.sessions.destroy(sid,"local-disconnect");
    // Reconnection uses the persisted global defaults. Disconnect alone is not a permanent ban.
    render();
  });
  command("shuncode.bridge.security.status",()=>{
    log.clear();log.appendLine(JSON.stringify({buildInfo:{...buildInfo,loadedFrom:context.extensionPath},security:policy.snapshot()},null,2));log.show();
  });
  const timer=setInterval(render,10_000);timer.unref?.();render();
  const disposable={dispose(){clearInterval(timer);policy.revokeAll("extension-dispose");dispatcher.handleToolCall=original;transport.registerToolHandlers=register;transport.deps.beginRemoteConversation=begin;transport.deps.endRemoteConversation=end;bridge.getStatus=status;bridge.output.appendLine=append;for(const d of disposables)d.dispose();}};
  context.subscriptions.push(disposable);
  return {policy,dispose:()=>disposable.dispose()};
}
module.exports={registerBridgeSecurity};
