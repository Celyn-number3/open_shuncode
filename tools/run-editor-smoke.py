#!/usr/bin/env python3
"""Activate the extension in an isolated editor profile; never restart the active Bridge."""
import argparse, json, os, pathlib, subprocess, tempfile, time
parser=argparse.ArgumentParser()
parser.add_argument('--app',required=True)
parser.add_argument('--source',action='store_true',help='Load the repository extension instead of the packaged extension')
args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parent.parent
exe=pathlib.Path(args.app).resolve()/'ShunCode.exe'
if not exe.is_file():raise ValueError('ShunCode.exe not found')
user=pathlib.Path(tempfile.mkdtemp(prefix='shuncode-v079-smoke-'))
(user/'User').mkdir()
(user/'User/settings.json').write_text(json.dumps({'security.workspace.trust.enabled':False,'shuncode.bridge.persistentMode':False,'extensions.autoUpdate':False,'update.mode':'none'}))
result=user/'smoke-result.json'
env=os.environ.copy()
for key in ['ELECTRON_RUN_AS_NODE','VSCODE_CLI','NODE_OPTIONS']:env.pop(key,None)
env['SHUNCODE_SMOKE_RESULT']=str(result)
command=[str(exe),'--new-window','--user-data-dir',str(user),'--extensions-dir',str(user/'extensions'),'--extensionTestsPath',str(root/'test/vscode-smoke'),'--enable-proposed-api','shuncode.shuncode','--disable-gpu',str(root)]
# Editor test execution needs development mode. The dummy host keeps the actual
# packaged ShunCode extension in place instead of silently testing repository code.
command.extend(['--extensionDevelopmentPath',str(root/'extension' if args.source else root/'test/host-fixture')])
print('Isolated editor smoke profile:',str(user),flush=True)
with (user/'launch-output.log').open('wb') as log:
    process=subprocess.Popen(command,env=env,stdout=log,stderr=log)
    deadline=time.monotonic()+100
    while time.monotonic()<deadline:
        if result.exists():
            data=json.loads(result.read_text(encoding='utf-8'))
            print(json.dumps(data,ensure_ascii=False,indent=2),flush=True)
            try:process.wait(timeout=20)
            except subprocess.TimeoutExpired:process.terminate()
            if not data.get('passed'):raise RuntimeError('Editor smoke failed')
            break
        if process.poll() is not None and process.returncode:break
        time.sleep(1)
    else:process.terminate()
    if not result.exists():raise RuntimeError('No successful smoke result; inspect '+str(user/'launch-output.log'))
