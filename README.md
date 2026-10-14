# ShunCode 开源维护版

基于 Code-OSS 的 Windows AI 编程编辑器，包含原生 Ask / Plan / Code 智能体、多模型协作，以及将本地工作区连接到网页 AI 的远程 MCP Bridge。

维护仓库：[Celyn-number3/open_shuncode](https://github.com/Celyn-number3/open_shuncode)。上游：[HP-Patience/open_shuncode](https://github.com/HP-Patience/open_shuncode)。保留上游许可证和提交历史。

## 当前版本与下载

- [发行版本与下载](https://github.com/Celyn-number3/open_shuncode/releases)
- [问题反馈](https://github.com/Celyn-number3/open_shuncode/issues)
- 仓库当前开发版本：**0.7.10**。未完成编辑器 GUI 验收前，不作为新的稳定版发布。
- 仓库与 Release 的可见性遵循 GitHub 仓库设置；私有仓库需要获得访问权限。

## 0.7.10 的个人高强度使用权限模型

按维护者明确选择，新连接默认 **整机模式＋终端权限＋自定义工具权限**，不按时间或闲置自动过期。拿到有效 MCP 连接凭据的客户端都能执行高权限操作；这是个人使用的高风险默认，不是安全沙箱。AI 仍不能通过工具参数修改本机权限设置。

| 权限 | 项目读取 | 项目补丁 | 终端执行、输入和输出 | 自定义工具 |
| --- | --- | --- | --- | --- |
| 可选只读 | 允许 | 禁止 | 禁止 | 禁止 |
| 项目文件修改 | 允许 | 允许 | 禁止 | 禁止 |
| 整机授权 | 允许 | 允许 | 单独授权 | 单独授权 |

- 永久默认设置保存在编辑器全局状态中。重载、重启或重新连接后使用该默认设置；首次安装默认整机、终端与自定义工具全部开启。
- 会话授权不按时间、闲置自动撤销。手动切换权限仍会检查，并请求取消被撤销的相关执行。
- `撤销全部` 同时将持久默认改为只读，避免换一个连接又自动恢复整机权限。重新开启请使用 `设置 MCP 永久默认权限`。
- 会话式与现代无状态客户端均可使用本机统一选择的默认权限。无状态客户端的自报标识不是认证身份，不能据此提供个人身份隔离；全开默认依赖连接凭据保密。默认只读时仍禁止无状态客户端单独提升权限。
- 自定义工具可能运行任意命令，即使其声明为只读，也不能绕过本机授权。
- 兼容工具别名默认拒绝，避免别名混淆绕过权限；客户端应使用 `tools/list` 返回的标准名称。
- 文件路径检查包括已有父目录的真实路径，拒绝显式目录穿越、工作区外路径、符号链接和 Windows junction 越界。
- **整机终端不是沙箱。** 授权后可访问 Windows 账号有权访问的其他文件，并可能访问网络。项目模式通过关闭任意终端和自定义命令控制风险，不宣称实现操作系统级隔离。
- 默认只读也不是秘密扫描器：工作区内文件可能包含敏感内容，请不要开放含私钥或生产凭证的工作区。

本机命令：

- `ShunCode: 设置 MCP 永久默认权限`
- `ShunCode: 管理 MCP 会话权限`
- `ShunCode: 撤销全部 MCP 会话权限`
- `ShunCode: 断开 MCP 会话`
- `ShunCode: 查看 MCP 权限与构建信息`

状态栏明确显示 `MCP 默认整机 · 永久` 或当前受限默认。权限状态含版本、源码提交、输入哈希和实际加载路径。传统 Bridge 设置页的工作范围仅为兼容提示，不再代表提升权限。

## 使用发行包

1. 下载 Windows x64 ZIP，解压后运行 `shuncode_start.bat` 或 `ShunCode.exe`。
2. 仅对来源可信的项目启用工作区信任。
3. 在 Bridge 设置页启动 Bridge，把 MCP 地址交给支持 MCP 的 AI。
4. AI 连接后默认可直接修改项目、运行命令和调用自定义工具；不需要每 15 分钟确认。需要限制时，在本机设置默认或单个会话权限。
5. 不使用时停止 Bridge；地址泄露时轮换端点。

MCP URL 包含访问凭证，不要公开分享。日志会对常见 token、Bearer 认证和密钥字段脱敏，但不应把任意终端输出视为绝对安全的日志。内置模型需要相应 API Key 或账号，模型服务可能收费。Windows 安全提示并不证明程序安全或恶意，应核对来源和校验值。

## 可重复的增量构建

需要 Node.js 20+；打包另需 Python 3.10+。新增维护工具不依赖第三方 npm 包。

```bash
npm ci
npm run build
npm run verify
node tools/sync-release.js --app "D:/path/to/app"
node tools/sync-release.js --app "D:/path/to/app" --apply
python tools/package_release.py --app "D:/path/to/app" --output "D:/releases/ShunCode-oss-0.7.10-win-x64.zip"
```

- `version.json` 是版本来源；清单一致性在构建时检查。
- `extension/legacy/` 保存经过固定 SHA-256 校验、统一 LF 的上游预编译基线。
- 构建脚本从基线重建增量产物，不叠加补丁；锚点或基线不匹配时失败。
- `build:check` 核对生成产物和安全模块输入哈希；`verify` 执行语法、回归和产物一致性检查。
- 同步默认只预览；`--apply` 先备份，在逐文件原子替换后核对哈希，失败时回滚已安装文件。它不是文件系统级全局原子事务。
- 运行中的扩展不会热加载。同步之后需要重载编辑器才能使用新版本，不应在远程维护中自动重启当前 Bridge。
- 打包剔除本地配置目录、快捷方式、备份及部分凭证文件名，生成 ZIP 和 SHA-256 文件。此筛查不构成任意秘密检测。

## 构建限制（重要）

**本仓库目前不是完整的 Code-OSS 源码发行树。** 27 个共享模块、工作台定制源码以及 Agent/MCP 运行时的完整源码仍缺失。

当前流程是可重复的 **已审计基线增量构建**，不是从全部源码独立编译：新增权限模块是可维护的 JavaScript 源码，激活入口的 TypeScript 参考同步更新；遗留预编译产物仍明确保留。不能凭此宣称完整源码构建已完成，也不能用命令字符串过滤代替终端沙箱。

详情见 [安全说明](docs/SECURITY.md)、[发布流程](docs/RELEASING.md)、[永久权限说明](docs/mcp-v0.7.10-permanent-permissions.md)（0.7.9 报告保留为历史记录）。

## 目录结构

```text
extension/src/        扩展参考源码及可执行安全模块
extension/dist/       实际扩展入口及构建信息
extension/runtime/    Agent/MCP 预编译运行时
extension/legacy/     校验固定的上游运行基线
extension/agents/     Ask / Plan / Code 提示词
extension/media/      图标与 Workspace Hub
 test/                权限、路径、协议和补丁回归测试
 tools/               构建、检查、同步和打包工具
 docs/                安全说明、发布流程、交付记录
```

## 许可证

ShunCode 自有代码遵循 [MIT](LICENSE)。发行包包含 Code-OSS/Electron 等组件及 Git for Windows、cloudflared 等工具，需保留各自许可证和第三方声明。本项目不隶属于 Microsoft、OpenAI、Anthropic 或 Cloudflare。
