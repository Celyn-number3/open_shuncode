"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),cp=require("node:child_process"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {replaceOnce}=require("../tools/build-extension.js");
test("build refuses absent or ambiguous legacy patch anchors",()=>{assert.throws(()=>replaceOnce("none","anchor","replacement"));assert.throws(()=>replaceOnce("anchor anchor","anchor","replacement"));assert.equal(replaceOnce("one anchor","anchor","replacement"),"one replacement");});
test("packager excludes personal files, verifies CRC and refuses archive overwrite",()=>{
 const code=String.raw`import importlib.util, pathlib, tempfile, json, zipfile
spec=importlib.util.spec_from_file_location('packager', 'tools/package_release.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
with tempfile.TemporaryDirectory() as directory:
 root=pathlib.Path(directory);app=root/'app';ext=app/'resources/app/extensions/shuncode'
 (ext/'dist').mkdir(parents=True);(ext/'src').mkdir()
 (ext/'package.json').write_text(json.dumps({'version':'0.7.9'}));(ext/'dist/build-info.json').write_text(json.dumps({'version':'0.7.9','fullSourceBuild':False}))
 (ext/'src/bridge-security.js').write_text('module.exports={};');(app/'ShunCode.exe').write_bytes(b'fixture')
 (app/'shortcut.lnk').write_bytes(b'private');(app/'auth.json').write_text('private');(app/'.shuncode').mkdir();(app/'.shuncode'/'secret').write_text('private')
 result=m.package(app,root/'release.zip','0.7.9');assert result['bytes']>0 and len(result['sha256'])==64
 with zipfile.ZipFile(root/'release.zip') as z:
  assert z.testzip() is None;assert 'ShunCode.exe' in z.namelist();assert 'SHUNCODE_BUILD_INFO.json' in z.namelist()
  assert not any('secret' in n or n.endswith('.lnk') or n=='auth.json' for n in z.namelist())
 try:m.package(app,root/'release.zip','0.7.9')
 except FileExistsError:pass
 else:raise AssertionError('existing archive overwritten')
 try:m.package(app,app/'inside.zip','0.7.9')
 except ValueError:pass
 else:raise AssertionError('recursive packaging allowed')
print('Packaging fixture passed')`;
 const stdout=cp.execFileSync(process.platform==="win32"?"python":"python3",["-c",code],{cwd:path.resolve(__dirname,".."),encoding:"utf8"});assert(stdout.includes("Packaging fixture passed"));
});
