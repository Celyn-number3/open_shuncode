# 构建与发布流程

## 版本管理

`version.json` 为版本来源，根 `package.json` 和 `extension/package.json` 必须一致。构建更新扩展与 Agent/MCP 运行时中已知版本标识，并生成 `extension/dist/build-info.json`。Code-OSS 核心版本不等于插件版本，不应把其 `1.132.0` 改成 `0.7.9`。

构建信息记录源提交、输入内容哈希、开发状态以及 `fullSourceBuild:false`。固定 `buildEpoch` 保证相同提交与输入的增量产物可重复生成；它是确定性构建时间标记，不冒充本机实际完成时间。生成产物提交晚于源码提交是正常的，元数据指向用来构建的源码提交。

## 本地验收

1. 检查工作树，保留用户未提交文件，不执行 `git add .`。
2. 执行 `npm ci`、`npm run build`、`npm run verify`。
3. CI 在 Windows 和 Linux 上重复构建并执行安全测试；GitHub Actions 是否实际运行需独立确认。
4. 执行同步预览，核对 app 目录后 `--apply`。备份在发行目录外，旧 ZIP 不覆盖。
5. 打包工具校验版本和安全模块，拒绝覆盖已有 ZIP；打包后进行完整 CRC 和 SHA-256 校验。
6. 在独立用户目录启动编辑器，确认激活、权限状态栏、授权确认、到期、撤销、断开及 MCP 端到端行为。原生 Chat、多模型合并和隧道恢复另做 GUI 回归。
7. 验收完成后才创建新稳定版；先创建 Release 草稿，上传和核对附件，再公开发布。Private 仓库不应被自动改为 Public。

## 当前构建类型

`npm run build` 是固定预编译基线上的可重复增量构建，不是完整源码重建。不得删除 `extension/legacy/` 或修改其哈希后绕过兼容性检查。完整源码构建仍需补齐共享模块、类型、运行时源码及工作台定制源码。

旧 `tools/patch-shuncode-codex-skills-ui.js` 保留用于旧发行包兼容，不是新的发布入口。新流程不修改工作台主 JS，避免破坏现有 Code-OSS 产品校验和。
