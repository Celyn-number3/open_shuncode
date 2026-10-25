'use strict';
const path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'..');
const {_electron}=require(path.join(root,'editor/node_modules/playwright-core'));
(async()=>{
 const proof=path.join(root,'artifacts/source-build/validation/final-stage/gui-production-verified');fs.mkdirSync(proof,{recursive:true});
 const fixture=path.join(root,'artifacts/source-gui-fixture');fs.mkdirSync(fixture,{recursive:true});fs.writeFileSync(path.join(fixture,'hello.ts'),'export const message = "source-build-fixture";\n');
 const user=path.join(root,'artifacts/source-gui-profile-production-verified'),ext=path.join(root,'artifacts/source-gui-external-extensions');fs.mkdirSync(path.join(user,'User'),{recursive:true});fs.mkdirSync(ext,{recursive:true});
 fs.writeFileSync(path.join(user,'User/settings.json'),JSON.stringify({'workbench.startupEditor':'none','telemetry.telemetryLevel':'off','extensions.autoCheckUpdates':false,'extensions.autoUpdate':false,'update.mode':'none','security.workspace.trust.enabled':false,'workbench.enableExperiments':false,'window.restoreWindows':'none','chat.commandCenter.enabled':true,'window.title':'[SOURCE VALIDATION] ${activeEditorShort}'},null,2));
 const env={...process.env};for(const k of ['ELECTRON_RUN_AS_NODE','VSCODE_IPC_HOOK_CLI','VSCODE_PID','VSCODE_NLS_CONFIG'])delete env[k];
 let app;const logs=[],errors=[];const result={product:path.join(root,'artifacts/source-product-0.7.10-verified'),freshProfile:user,fixture,original_app_untouched:true};
 try{
  app=await _electron.launch({executablePath:path.join(result.product,'ShunCode.exe'),args:['--new-window','--user-data-dir='+user,'--extensions-dir='+ext,'--skip-welcome','--skip-release-notes','--disable-updates','--disable-telemetry','--enable-proposed-api=shuncode.shuncode','--locale=en',fixture],env,timeout:90000});
  app.process().stdout?.on('data',x=>logs.push(x.toString()));app.process().stderr?.on('data',x=>logs.push(x.toString()));
  result.main=await app.evaluate(({app})=>({version:app.getVersion(),appPath:app.getAppPath(),userData:app.getPath('userData'),name:app.getName()}));
  const win=await app.firstWindow({timeout:60000});win.on('pageerror',e=>errors.push(e.stack||e.message));
  await win.waitForSelector('.monaco-workbench',{timeout:90000});
  await win.waitForTimeout(12000);
  result.title=await win.title();result.url=win.url();result.body=await win.locator('body').innerText();
  result.windows=app.windows().length;result.rendererErrors=errors;result.status='workbench-launched';result.noCorruptionWarning=!result.body.includes('installation appears to be corrupt');
  await win.screenshot({path:path.join(proof,'source-workbench.png'),fullPage:true});
 }catch(e){result.status='failed';result.error=e.stack||e.message;}
 finally{
  fs.writeFileSync(path.join(proof,'launch-probe.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(proof,'process-output.log'),logs.join(''));
  if(app)await app.close().catch(e=>fs.appendFileSync(path.join(proof,'process-output.log'),'\nclose: '+e.message));
 }
 console.log(JSON.stringify(result,null,2).slice(0,14000));if(result.status==='failed')process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
