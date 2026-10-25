'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'artifacts/source-build/tests');fs.mkdirSync(dir,{recursive:true});
const file=path.join(dir,'http-contracts.cjs');esbuild.buildSync({absWorkingDir:root,stdin:{contents:"export { handleBridgeHttpRequest } from './src/bridge-http-router.js';",resolveDir:root,sourcefile:'http-contract-probe.mjs'},bundle:true,platform:'node',format:'cjs',target:'node22',outfile:file,logLevel:'error'});
const {handleBridgeHttpRequest}=require(file);
test('actual source router rejects ambiguous identity-header arrays before dispatch',async()=>{
 let invoked=false,status,body;
 const req={url:'/mcp/fixture',method:'GET',headers:{'mcp-session-id':['a','b']}};
 const response={headersSent:false,setHeader(){},writeHead(code){status=code;return this;},end(value){body=value;}};
 await handleBridgeHttpRequest({routes:{endpointPath:'/mcp/fixture',healthPath:'/health/fixture'},maxRequestBytes:1024,standaloneGetEnabled:true},{getSessionCount:()=>0,handleGet:async()=>{invoked=true;}},req,response);
 assert.equal(status,400);assert.equal(invoked,false);assert.match(body,/single value/);
});
test('source product uses separate shared-data and mutex identities',()=>{
 const product=JSON.parse(fs.readFileSync(path.join(root,'editor/product.json'),'utf8'));
 assert.equal(product.sharedDataFolderName,'.shuncode-source-shared');assert.equal(product.win32MutexName,'shuncode-source');
});
test('source Browser command identities and ShunCode context keys are restored',()=>{
 const browser=fs.readFileSync(path.join(root,'editor/src/vs/platform/browserView/common/browserView.ts'),'utf8');
 assert.match(browser,/NewIncognitoTab/);assert.match(browser,/NewSecondAccountTab/);
 const context=fs.readFileSync(path.join(root,'editor/src/vs/workbench/contrib/chat/common/actions/chatContextKeys.ts'),'utf8');
 for(const key of ['shunCodeBridgeMode','shunCodeBranchHasNext','shunCodeBranchCanMerge'])assert.match(context,new RegExp(key));
});

test('pinned upstream customization registrations remain wired into the reconstructed workbench',()=>{
 const content=fs.readFileSync(path.join(root,'editor/src/vs/workbench/contrib/chat/browser/chat.shared.contribution.ts'),'utf8');
 for(const file of ['aiCustomizationWorkspaceService','customizationHarnessService','aiCustomizationManagement.contribution','aiCustomizationItemsModel'])assert(content.includes('./aiCustomization/'+file+'.js'));
});
test('product assembly retains real integrity checking and locked runtime dependency overlay',()=>{
 const content=fs.readFileSync(path.join(root,'tools/build-source-product.py'),'utf8');
 assert(content.includes('Missing integrity target:'));assert(content.includes("product['checksums']=checksums"));
 for(const name of ['@vscode/tree-sitter-wasm','@github/copilot-win32-x64'])assert(content.includes(name));
 const source=fs.readFileSync(path.join(root,'extension/src/ide-tool-broker.ts'),'utf8');assert(source.includes('setTimeout(resolve, 1_500)'));
});
