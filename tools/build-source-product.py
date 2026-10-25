#!/usr/bin/env python3
"""Build first-party application JS from source and assemble owned Windows output.
Electron, native modules and pinned marketplace extensions are third-party runtime
inputs, recorded separately. This is not a claim to rebuilding Chromium/Electron.
"""
from pathlib import Path
import argparse,subprocess,shutil,json,hashlib,datetime,os
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--runtime',required=True,help='Existing matching Electron distribution; only runtime/dependency files are read')
parser.add_argument('--output',required=True,help='Absent output directory; existing user apps are never overwritten')
parser.add_argument('--assemble-only',action='store_true',help='Assemble already-built source outputs (does not itself establish build verification)')
args=parser.parse_args()
runtime=Path(args.runtime).resolve();output=Path(args.output).resolve()
assert runtime.is_dir() and (runtime/'ShunCode.exe').is_file()
assert not output.exists(),'Output must be absent; refusing to overwrite an application'
proof=ROOT/'artifacts/source-build/validation/product-build';proof.mkdir(parents=True,exist_ok=True)
def run(label,command,cwd=ROOT):
 with (proof/(label+'.log')).open('w',encoding='utf-8') as log:
  result=subprocess.run(command,cwd=cwd,shell=True,stdout=log,stderr=subprocess.STDOUT)
 if result.returncode:raise RuntimeError(f'{label} failed ({result.returncode}); see {proof/(label+".log")}')
if not args.assemble_only:
 run('extension-types','npm run typecheck:source:extension')
 run('extension-source','npm run build:source:extension')
 run('source-tests','npm run test:source')
 run('desktop-source','node --max-old-space-size=8192 build/next/index.ts bundle --nls --out ../artifacts/source-build/editor/out',ROOT/'editor')
 run('builtin-source','npm run gulp -- compile-extensions-build',ROOT/'editor')
output.mkdir(parents=True)
runtime_inputs=[]
def copy(source,target,kind):
 if source.is_dir():shutil.copytree(source,target)
 else:target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(source,target)
 runtime_inputs.append({'origin':str(source),'target':str(target.relative_to(output)),'kind':kind})
for item in runtime.iterdir():
 if item.name.startswith('unins') or item.name=='resources':continue
 if item.is_file() or item.name in ['locales','bin','tools']:copy(item,output/item.name,'third-party-electron-runtime')
app=output/'resources/app';app.mkdir(parents=True)
for name in ['node_modules.asar','node_modules.asar.unpacked','node_modules','resources','LICENSE.txt','ThirdPartyNotices.txt']:
 p=runtime/'resources/app'/name
 if p.exists():copy(p,app/name,'third-party-runtime-dependency-or-resource')
# Overlay newer locked upstream dependencies required by the reconstructed editor.
for package_name in ['@vscode/tree-sitter-wasm','@github/copilot','@github/copilot-win32-x64','@github/copilot-sdk','detect-libc']:
 source=ROOT/'editor/node_modules'/package_name
 if not source.is_dir():raise RuntimeError('Missing pinned source dependency: '+package_name)
 target=app/'node_modules'/package_name
 if target.exists():shutil.rmtree(target)
 target.parent.mkdir(parents=True,exist_ok=True)
 copy(source,target,'pinned-upstream-runtime-dependency')
shutil.copytree(ROOT/'artifacts/source-build/editor/out',app/'out')
for name in ['package.json','product.json']:shutil.copy2(ROOT/'editor'/name,app/name)
# Generate checksums for the newly compiled first-party output; do not disable integrity.
import base64
product=json.loads((app/'product.json').read_text(encoding='utf-8'))
checksums={}
for relative in product.get('checksums',{}):
 target=app/'out'/relative
 if not target.is_file():raise RuntimeError('Missing integrity target: '+relative)
 checksums[relative]=base64.b64encode(hashlib.sha256(target.read_bytes()).digest()).decode('ascii').rstrip('=')
product['checksums']=checksums
(app/'product.json').write_text(json.dumps(product,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
package=json.loads((app/'package.json').read_text(encoding='utf-8'));package.update(name='ShunCode',main='./out/main.js');(app/'package.json').write_text(json.dumps(package,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
shutil.copytree(ROOT/'editor/.build/extensions',app/'extensions')
ext=app/'extensions/shuncode';ext.mkdir()
for name in ['package.json','media','agents','src','icons']:
 p=ROOT/'extension'/name
 if p.is_dir():shutil.copytree(p,ext/name)
 elif p.is_file():shutil.copy2(p,ext/name)
shutil.copytree(ROOT/'artifacts/source-build/extension/dist',ext/'dist');shutil.copytree(ROOT/'artifacts/source-build/runtime',ext/'runtime')
for name in ['git','cloudflared.exe','cloudflared','ngrok','ngrok.exe']:
 p=runtime/'resources/app/extensions/shuncode/runtime'/name
 if p.exists():copy(p,ext/'runtime'/name,'third-party-bridge-tool')
source_receipt=json.loads((ROOT/'artifacts/source-build/build-receipt.json').read_text(encoding='utf-8'))
def git(*arguments):
 try:
  return subprocess.run(['git',*arguments],cwd=ROOT,capture_output=True,text=True,check=True).stdout.strip()
 except Exception:
  return None
extension_result=next((item for item in source_receipt.get('results',[]) if item.get('entry')=='extension/src/extension.ts'),{})
# The product carries its own provenance so a shipped zip can be traced without the build machine.
source_build_info={'schema':1,'application':'ShunCode','version':json.loads((ROOT/'package.json').read_text(encoding='utf-8'))['version'],'buildKind':'reconstructed-source-product','firstPartySourceBuild':True,'fullSourceBuild':False,'sourceRevision':git('rev-parse','HEAD'),'sourceDirty':bool(git('status','--porcelain')),'assembledAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'extensionBuiltAt':source_receipt.get('built_at'),'extensionBuild':{'entry':extension_result.get('entry'),'input_count':extension_result.get('input_count'),'output_sha256':extension_result.get('output_sha256')}}
(output/'SOURCE_BUILD_INFO.json').write_text(json.dumps(source_build_info,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
receipt={'schema':1,'created_at':datetime.datetime.now().isoformat(),'output':str(output),'source_build_executed':not args.assemble_only,'old_first_party_bundle_inputs':False,'third_party_runtime_inputs':runtime_inputs,'gui_verified':False,'complete_product_verified':False,'source_build_info':source_build_info,'source_receipt':source_receipt}
files=[]
for file in sorted(output.rglob('*')):
 if file.is_file():files.append({'path':file.relative_to(output).as_posix(),'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'bytes':file.stat().st_size})
receipt['files']=files
(output/'SOURCE_BUILD_RECEIPT.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('SOURCE_PRODUCT_ASSEMBLED',output,'FILES',len(files))
