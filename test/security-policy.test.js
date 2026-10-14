"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {BridgeSecurityPolicy,redact,redactObject,checkWorkspacePath,validateToolPaths}=require("../extension/src/bridge-security-policy.js");
const owner="bridge:test-a";
test("new sessions are read-only; commands, output, writes and custom tools denied",()=>{
 const p=new BridgeSecurityPolicy();for(const name of ["read_files","find_files","lsp","set_todos"])assert.equal(p.allows(owner,name),true);
 for(const name of ["run_command","get_command_output","send_command_input","apply_patch","pdf_reader"])assert.equal(p.allows(owner,name),false);
 assert.equal(p.snapshot().sandboxed,false);
});
test("project grant permits patches, not shell or custom tools",()=>{const p=new BridgeSecurityPolicy();p.grant(owner,{mode:"project"});assert(p.allows(owner,"apply_patch"));assert(!p.allows(owner,"run_command"));assert(!p.allows(owner,"pdf_reader"));assert.throws(()=>p.grant(owner,{mode:"project",terminal:true}));});
test("terminal and custom-tool permissions are separate and session-bound",()=>{
 const p=new BridgeSecurityPolicy();p.grant(owner,{mode:"device",terminal:true});assert(p.allows(owner,"run_command"));assert(!p.allows(owner,"pdf_reader"));assert(!p.allows("bridge:test-b","run_command"));
 p.grant(owner,{mode:"device",customTools:true});assert(!p.allows(owner,"run_command"));assert(p.allows(owner,"pdf_reader"));
});
test("grant expiry cancels commands and restores read-only",()=>{let now=0;const revoked=[];const p=new BridgeSecurityPolicy({now:()=>now,onRevoke:x=>revoked.push(x)});p.grant(owner,{mode:"device",terminal:true,minutes:1});now=60_000;assert(!p.allows(owner,"run_command"));assert.deepEqual(revoked,[owner]);});
test("revocation, disconnect and idle expiry drop grants",()=>{let now=0;const p=new BridgeSecurityPolicy({now:()=>now,idleMs:1000});p.grant(owner,{mode:"project"});p.revokeAll();assert(!p.allows(owner,"apply_patch"));p.grant(owner,{mode:"project"});p.forget(owner);assert(!p.allows(owner,"apply_patch"));now=2000;p.expire();assert.equal(p.snapshot().sessions.length,0);});
test("invalid identities, excessive grants and session flood fail closed",()=>{const p=new BridgeSecurityPolicy({maxSessions:1});assert.throws(()=>p.allows(undefined,"read_files"));assert.throws(()=>p.grant(owner,{mode:"device",minutes:61}));p.touch(owner);assert.throws(()=>p.touch("bridge:other"));});
test("logs redact route capabilities, API keys, bearer credentials and sensitive fields",()=>{
 const token="ghp_"+"a".repeat(36);const text=redact("https://example.com/mcp/abcdef Bearer abcdefg password=hunter2 "+token+" sk-proj-"+"b".repeat(30));
 for(const secret of ["abcdef","hunter2",token,"b".repeat(30)])assert(!text.includes(secret));assert.equal(redactObject({password:"short",safe:"ok"}).password,"[REDACTED]");assert(!redact("session destroyed: session-secret-123 reason=test").includes("session-secret-123"));assert.equal(redactObject({sessionId:"private-session"}).sessionId,"[REDACTED]");
});
function withPaths(fn){const temp=fs.mkdtempSync(path.join(os.tmpdir(),"shuncode-policy-"));const root=path.join(temp,"workspace"),outside=path.join(temp,"outside");fs.mkdirSync(root);fs.mkdirSync(outside);fs.writeFileSync(path.join(root,"ok.txt"),"ok");try{fn(root,outside);}finally{fs.rmSync(temp,{recursive:true,force:true});}}
test("workspace path guard rejects traversal and sibling-prefix paths",()=>withPaths((root,outside)=>{checkWorkspacePath("ok.txt",[root]);checkWorkspacePath("new/deep/file.txt",[root]);assert.throws(()=>checkWorkspacePath(outside,[root]));assert.throws(()=>checkWorkspacePath("../outside/file.txt",[root]));assert.throws(()=>checkWorkspacePath(root+"-other/file.txt",[root]));}));
test("symlinks and Windows junctions cannot redirect explicit file paths",()=>withPaths((root,outside)=>{const link=path.join(root,"escape");fs.symlinkSync(outside,link,process.platform==="win32"?"junction":"dir");assert.throws(()=>checkWorkspacePath("escape/new.txt",[root]));}));
test("patch add/update/delete/move destinations stay in workspace",()=>withPaths((root,outside)=>{
 validateToolPaths("apply_patch",{patch:"*** Begin Patch\n*** Add File: new.txt\n+ok\n*** End Patch"},[root]);
 for(const directive of ["Add File","Update File","Delete File","Move to"])assert.throws(()=>validateToolPaths("apply_patch",{patch:"*** Begin Patch\n*** "+directive+": ../outside/leak.txt\n*** End Patch"},[root]));
}));
test("diagnostic and batch read paths are checked individually",()=>withPaths((root,outside)=>{assert.throws(()=>validateToolPaths("read_files",{files:[{path:"ok.txt"},{path:outside}]},[root]));assert.throws(()=>validateToolPaths("get_diagnostics",{paths:[outside]},[root]));}));
test("permission snapshots cannot reveal owner capability or mutate policy",()=>{const p=new BridgeSecurityPolicy();p.touch(owner);const s=p.snapshot();assert(!JSON.stringify(s).includes(owner));s.sessions[0].mode="device";assert(!p.allows(owner,"run_command"));});
