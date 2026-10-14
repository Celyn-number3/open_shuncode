"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),vm=require("node:vm"),{createRequire}=require("node:module");
const {registerBridgeSecurity}=require("../extension/src/bridge-security.js");
function loadBundle() {
 const filename=path.resolve(__dirname,"../extension/dist/extension.js"),realRequire=createRequire(filename);
 class EventEmitter{event=()=>({dispose(){}});fire(){}dispose(){}}
 const s={module:{exports:{}},exports:{},require:id=>id==="vscode"?{EventEmitter}:realRequire(id),__dirname:path.dirname(filename),__filename:filename,process,Buffer,URL,URLSearchParams,TextEncoder,TextDecoder,AbortController,AbortSignal,Headers,Request,Response,fetch,console,setTimeout,clearTimeout,setInterval,clearInterval,setImmediate,clearImmediate,structuredClone};s.global=s;
 vm.runInNewContext(fs.readFileSync(filename,"utf8")+"\nmodule.exports.__testBridge={BridgeToolDispatcher,BridgeMcpTransport};",s,{filename});
 return s.module.exports.__testBridge;
}
const classes=loadBundle();
function setup() {
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),"shuncode-real-bundle-")),root=path.join(temp,"project");fs.mkdirSync(root);fs.writeFileSync(path.join(root,"readme.txt"),"public fixture");fs.writeFileSync(path.join(temp,"outside.txt"),"outside fixture");
 const invoked=[];const dispatcher=new classes.BridgeToolDispatcher({workspaceRoots:()=>[root],skillsEnabled:()=>false,log(){},invokeIdeTool:async(name,args)=>{invoked.push(name);return{text:"fixture command",isError:false,structuredContent:{command_id:"fixture-id",status:"completed",exit_code:0,output:"fixture command"}};}},1);
 const transport=new classes.BridgeMcpTransport({dispatchToolCall:(...args)=>dispatcher.dispatch(...args),beginRemoteConversation:o=>dispatcher.beginRemoteConversation(o),endRemoteConversation:o=>dispatcher.endRemoteConversation(o),releaseCommandOwner(){},log(){},diag(){},serverInstructions:()=>"fixture",listCustomTools:()=>[]});
 transport.sessions.set("client",{lastActivity:Date.now(),activeRequests:0,activeStreams:0,transport:{close(){}},server:{close(){}}});
 const vscode={StatusBarAlignment:{Right:1},window:{createOutputChannel:()=>({appendLine(){},clear(){},show(){},dispose(){}}),createStatusBarItem:()=>({show(){},dispose(){}}),showInformationMessage:async()=>{}},commands:{registerCommand:()=>({dispose(){}})}};
 const bridge={dispatcher,mcpTransport:transport,ideToolBroker:{releaseCommandOwner(){}},workspaceRoots:()=>[root],output:{appendLine(){}},getStatus:()=>({activities:[]})};
 const hooks=registerBridgeSecurity(vscode,{subscriptions:[],extensionPath:root},bridge,{version:"0.7.9",sourceRevision:"fixture",sourceHash:"fixture"});
 const handlers=new Map();transport.registerToolHandlers({setRequestHandler:(m,h)=>handlers.set(m,h)},()=>"client");
 const call=(name,args={})=>handlers.get("tools/call")({params:{name,arguments:args}},{signal:undefined});
 return {temp,root,bridge,hooks,invoked,handlers,call,close(){hooks.dispose();fs.rmSync(temp,{recursive:true,force:true});}};
}
test("actual bundled MCP tools/call rejects terminal before IDE execution",async()=>{const f=setup();try{const r=await f.call("run_command",{command:"echo should-not-run"});assert(r.isError);assert.equal(f.invoked.length,0);}finally{f.close();}});
test("actual bundled file registry reads project fixture and denies outside file",async()=>{const f=setup();try{const ok=await f.call("read_files",{files:[{path:"readme.txt"}]});assert(!ok.isError,JSON.stringify(ok));assert(JSON.stringify(ok).includes("public fixture"));const outside=await f.call("read_files",{files:[{path:path.join(f.temp,"outside.txt")}]});assert(outside.isError);assert(JSON.stringify(outside).includes("PATH_OUTSIDE_WORKSPACE"));}finally{f.close();}});
test("actual bundled tools/list changes per session permission and revocation",async()=>{const f=setup();try{let names=(await f.handlers.get("tools/list")()).tools.map(t=>t.name);assert(!names.includes("run_command"));assert(!names.includes("apply_patch"));f.hooks.policy.grant("bridge:client",{mode:"project"});names=(await f.handlers.get("tools/list")()).tools.map(t=>t.name);assert(names.includes("apply_patch"));assert(!names.includes("run_command"));f.hooks.policy.revokeAll();assert(!(await f.handlers.get("tools/list")()).tools.some(t=>t.name==="apply_patch"));}finally{f.close();}});
test("actual bundled patch registry writes only after project grant and refuses stale versions",async()=>{const f=setup();try{const patch="*** Begin Patch\n*** Update File: readme.txt\n@@\n-public fixture\n+changed fixture\n*** End Patch";assert((await f.call("apply_patch",{patch})).isError);f.hooks.policy.grant("bridge:client",{mode:"project"});const stale=await f.call("apply_patch",{patch,expected_versions:{"readme.txt":"sha256:"+"0".repeat(64)}});assert(stale.isError,JSON.stringify(stale));assert.equal(fs.readFileSync(path.join(f.root,"readme.txt"),"utf8"),"public fixture");const good=await f.call("apply_patch",{patch});assert(!good.isError,JSON.stringify(good));assert(fs.readFileSync(path.join(f.root,"readme.txt"),"utf8").includes("changed fixture"));}finally{f.close();}});
test("actual dispatcher checks permission again after waiting in concurrency queue",async()=>{const f=setup();try{let release;f.bridge.dispatcher.deps.invokeIdeTool=async()=>{await new Promise(resolve=>release=resolve);return{text:"done",isError:false};};f.hooks.policy.grant("bridge:client",{mode:"device",terminal:true});const first=f.call("run_command",{command:"fixture"});await new Promise(resolve=>setImmediate(resolve));const queued=f.call("run_command",{command:"fixture"});await new Promise(resolve=>setImmediate(resolve));f.hooks.policy.revokeAll();release();await first;assert((await queued).isError);}finally{f.close();}});
test("generated bundle has early security hook and private permission-sensitive tool cache",()=>{const source=fs.readFileSync(path.resolve(__dirname,"../extension/dist/extension.js"),"utf8");assert(source.includes('registerBridgeSecurity('));assert(source.indexOf('registerBridgeSecurity(')<source.indexOf('const bridgeReady = bridge.initialize()'));assert(source.includes('"tools/list": { ttlMs: 0, cacheScope: "private" }'));});

test("real HTTP MCP handshake, permission denial, local grant and DELETE teardown",async()=>{
 const f=setup();const token="shuncode-test-"+Date.now();
 try {
  await f.bridge.mcpTransport.start({provider:"cloudflare",routeToken:token,namedTunnelLocalPort:0});
  const port=f.bridge.mcpTransport.snapshot().localPort;
  const url="http://127.0.0.1:"+port+"/mcp/"+token;
  let sid;
  const rpc=async(method,params,id)=>{
   const headers={"Content-Type":"application/json","Accept":"application/json, text/event-stream"};if(sid)headers["Mcp-Session-Id"]=sid;
   const response=await fetch(url,{method:"POST",headers,body:JSON.stringify({jsonrpc:"2.0",method,params,id})});
   if(response.headers.get("Mcp-Session-Id"))sid=response.headers.get("Mcp-Session-Id");
   const text=await response.text();
   assert(response.ok,text);
   return text ? JSON.parse(text.startsWith("event:") || text.startsWith("data:") ? text.split("\n").find(x=>x.startsWith("data:")).slice(5) : text) : null;
  };
  const init=await rpc("initialize",{protocolVersion:"2024-11-05",capabilities:{},clientInfo:{name:"security-regression",version:"1"}},1);assert(init.result.serverInfo);assert(sid);
  await rpc("notifications/initialized",{},undefined);
  const denied=await rpc("tools/call",{name:"run_command",arguments:{command:"fixture"}},2);assert(denied.result.isError);assert.equal(f.invoked.length,0);
  f.hooks.policy.grant("bridge:"+sid,{mode:"device",terminal:true});
  const allowed=await rpc("tools/call",{name:"run_command",arguments:{command:"fixture"}},3);assert(!allowed.result.isError,JSON.stringify({allowed,security:f.hooks.policy.snapshot()}));assert.equal(f.invoked.length,1);
  const closed=await fetch(url,{method:"DELETE",headers:{"Mcp-Session-Id":sid,"Accept":"application/json, text/event-stream"}});assert(closed.ok);assert(!f.hooks.policy.sessions.has("bridge:"+sid));
 }finally{await f.bridge.mcpTransport.closeListener();f.bridge.mcpTransport.destroySessionsAndStopPruning();f.close();}
});
