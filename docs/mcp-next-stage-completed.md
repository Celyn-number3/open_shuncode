# ShunCode 下一阶段任务完成与验收报告

日期：2026-10-14

## 结论与范围

本阶段约定的工作已完成：严格扩展类型契约检查、REA/Wakaru 恢复输出的跨模块链接修复、第一方源码构建与完整 Windows 产品组装、独立 GUI / Ask / Plan / Code / MCP 验收，以及证据整理。

**完成范围是第一方 JavaScript/TypeScript 源码构建与报告列出的功能场景。** Electron/Chromium、原生第三方模块、Git/cloudflared 和已锁定的第三方运行依赖仍作为运行时输入复用；不是把所有第三方 C/C++ 都从源码重编译，也不是原始 TypeScript、注释、提交历史或所有动态行为的精确还原。付费厂商模型 API、公共 ngrok/Cloudflare 服务并未因此被宣称验收完成。

## 可运行交付

- 仓库：`E:\open_shuncode`。
- 独立产品：`E:\open_shuncode\artifacts\source-product-0.7.10-verified`。
- 建议启动：该目录的 `start-source.cmd`。它使用独立 source-user-data/source-extensions 目录，不复用当前编辑器的数据或覆盖原程序。
- 主程序：同目录 `ShunCode.exe`。
- 构建/文件凭据：同目录 `SOURCE_BUILD_RECEIPT.json`。
- 已核对的产物文件：10,948 个（含独立启动器；凭据文件本身不自包含哈希）。
- 凭据 SHA-256：`256da9c029ac4646c5f9255e507c8f4dd2b4a49712030d1de87fa0831f190597`。

原始 `D:\ShunCode` 作为只读运行依赖与逆向目标，当前 Bridge 所在程序没有被覆盖或重启。测试只启动并关闭本阶段拥有的独立 Source 产品窗口。

## 验证总表

| 验收项 | 结果 |
| --- | --- |
| 严格扩展 TypeScript 检查 | 通过，退出码 0；之前的 68 条错误不再出现 |
| 第一方扩展、Agent、MCP 源码重编译 | 通过；编译输入清单未包含旧第一方 dist/runtime/legacy bundle |
| 源码回归 | 28/28 通过 |
| 原维护回归 | 35/35 通过 |
| 旧增量产物一致性 | 通过；Stale build inputs 已关闭，旧流程仍明确归类为历史基线增量构建 |
| REA/Wakaru 链接修复输出 | 3/3 运行探测通过 |
| 桌面核心 | 24 个源码 bundle、3 个 standalone 文件构建成功 |
| 内置扩展 | compile-extensions-build 完成；日志记录参与检查的扩展为 0 errors |
| 全新输出目录完整组装 | 通过；复用运行时与源码产物分开记录 |
| 产品完整性检查 | 10 项真实 SHA-256 校验已按新输出生成；未删除或关闭完整性机制 |
| 正常安装模式 Workbench 启动 | 通过，无安装损坏提示、无 renderer pageerror |
| 精确交付目录的独立 GUI/MCP 场景 | 17/17 通过 |

扩展检查保持 strict=true。现有推导声明明确标注为重建契约，不能被描述成从机器码恢复出的原始 TS。底层大型编辑器源码采用其实际 esbuild 工作流，不能把扩展检查通过冒称全部编辑器 TS 文件都经过严格类型验收。

## REA/Ghidra 实际使用与链接修复

前序已实际调用 REA 6.4.0、Ghidra 12.1.4，并在隔离 Linux x64 中用校验过的 Wakaru 1.14.0 对三份原始输入生成 39 个结构化模块、映射和 provenance；完整原始生产者结果保持不变。

本阶段修复的是这些恢复模块中被拆分后缺失的词法链接与初始化次序：

- 基于 Babel 作用域绑定，只有唯一实际定义的符号才建立跨模块 import/export；不猜测歧义所有者。
- 原 bundle 的纯 Object intrinsic helper 提取到独立初始化模块，避免因循环导入在入口定义前使用 __defProp 等变量。
- 保留 Zod 的 globalThis.__zod_globalConfig 单例，重定向原 import，解决 globalConfig 作用域丢失。
- 将默认 CommonJS namespace wrapper 放到其本地定义初始化之后。
- 原始生产者文件、映射、manifest 不覆盖；所有改动有 LINKAGE_REPAIR.json。

实际结果：

1. 扩展 CJS bundle 加载成功，真实 activate/deactivate 导出可用。
2. Agent 独立子进程关闭 stdin 正常退出，退出码 0。
3. MCP bundle 可加载真实 createFileToolsServer，并创建实际服务器实例，退出码 0。

运行探测通过不意味着所有行为与发行包完全等价。产品继续使用已有、独立回归通过的重建图；修复后的 Wakaru 产物作为可审计的恢复与交叉验证产物，没有为了替换而盲目覆盖源码。

工具：`tools/source-recovery/repair-wakaru-modules.cjs`、`tools/source-recovery/verify-wakaru-linkage.cjs`。

## 构建和组装过程中解决的实际问题

- 保留推导的共享接口、泛型、类实例表面与 ShunCode Chat 结果字段，严格检查通过；没有使用通配模块声明或全局关闭 strict 获取绿色结果。
- 新增完整组装入口 `tools/build-source-product.py`；输出目录必须不存在，拒绝覆盖已有应用。
- 在实际 GUI 启动时发现旧 product checksums 导致“安装损坏”提示：改为对新源码输出计算真实 SHA-256/base64 校验值，而不是绕过检查。
- 补回锁定上游的 AI customization workspace service、harness service、management contribution 和 items model 注册，解决 UNKNOWN service / command not found。
- 组装时覆盖锁定的新运行依赖，包括 tree-sitter WASM 和 Windows Copilot CLI，解决新源码请求的依赖路径缺失。
- 为 Gulp facade 所需 gulp-vinyl-zip 增加精确依赖；Windows CLI 可选依赖精确锁定，更新后的包/锁文件留在重建分支。
- 实际 MCP 终端调用揭示 pseudoterminal 等待 renderer open 事件可无限挂起：使用有界等待和合法默认尺寸，后台调用不依赖用户先打开终端标签；后续 VS Code dimensions/open 回调仍正常更新显示。
- 再次实际验证 MCP 终端输出、取消、权限撤销，均通过。

所有现有文件修改前有备份；重要源码和构建器改动用 read_files SHA-256 版本预条件补丁安装。旧遗留产物再生前另保存完整哈希备份，且其流程不被用作新产品第一方源码编译输入。

## 精确交付产品的 17 项 GUI 场景

测试使用 `source-product-0.7.10-verified`，独立 user-data、扩展目录、工作区和测试 harness。正常安装模式另外做了启动探测；需要本地无公网 MCP 的完整场景使用 Development Host 的显式 smoke guard。

1. 实际 ShunCode 源码扩展激活。
2. 打开、编辑、保存真实工作区文件。
3. 产品完整性无损坏提示。
4. 通过真实 UI 配置非秘密的本地模型测试 key。
5. 已组装产品的真实 MCP initialize/initialized 握手。
6. MCP 实际读取文件。
7. MCP 实际补丁创建文件。
8. MCP 实际持久 PTY 终端执行，核对退出码和 stdout。
9. Bridge 设置与会话 UI 显示。
10. Ask 模式：真实 provider → runtime → 流式响应 → GUI 可见。
11. Plan 模式：同一真实链路。
12. Code 模式：同一真实链路。
13. Code 实际通过 agent apply_patch 创建文件；核对磁盘内容。
14. Ask 的工具表面保持只读，不包含 apply_patch/run_command。
15. Plan 的工具表面保持只读。
16. 使用实际返回的命令能力句柄请求取消。
17. 本地撤销权限后 tools/list 隐藏终端工具，下一次调用被拒绝。

模型服务为可控 loopback OpenAI-compatible fixture，不是替换 Chat handler 的假响应。真实产品 provider、运行时、工具派发、文件修改及 GUI 渲染都在链路中；没有使用个人密钥或产生付费厂商调用。公共模型互操作和长期稳定性仍应单独验证。

工具：`tools/source-gui-integration.cjs`、`tools/source-gui-probe.cjs`。Private harness endpoint 文件是测试凭据，不公开。

## 证据索引

统一目录：`artifacts/source-build/validation/final-stage/`。

- `final-stage-acceptance.json`、`final-product-audit.json`
- `source-verify-final.log`、`legacy-verify.log`
- `wakaru-linkage-verification.json`、`wakaru-verify-final.log`
- `repaired-*/LINKAGE_REPAIR.json`、各 verified-*.cjs.metafile.json
- `gui-integration-verified/gui-integration.json`
- `gui-integration-verified/model-requests.json`（fixture 数据，分享前审阅）
- `gui-integration-verified/editor-source.png`、`bridge-source.png`
- `gui-integration-verified/chat-ask-source.png`、`chat-plan-source.png`、`chat-code-source.png`
- `gui-production-verified/launch-probe.json`、`source-workbench.png`
- `pre-gui-fix/`、`legacy-before-regenerate/`、依赖修改前备份

完整构建日志：`artifacts/source-build/validation/product-build/`。

旧失败尝试保留为诊断证据；最终结论取以上精确交付目录、最终日志和凭据，不用中间失败输出冒充成功。

## 可重复命令

需对应 Windows x64、Node 24.15.0、Python 3.13 与锁定依赖。首次准备依赖以项目锁文件为准，并保留 npm 的平台可选依赖：

```bash
npm ci
npm --prefix editor ci --include=optional
npm --prefix editor/build ci
npm run verify:source:extension
python tools/build-source-product.py --runtime "D:/ShunCode" --output "E:/an-absent-owned-output"
```

runtime 仅提供匹配的第三方 Electron/native/dependency/resource 输入。新输出目录不能已存在。构建器生成新第一方 JS、内置扩展、扩展 runtime 及产品 integrity，再分别记录所有输入和文件哈希。

GUI harness 是本地驗收工具，不进入正常 source-user-data，也不直接发布其 private endpoint 或 fixture 数据。没有提交 Git、推送、发布稳定版或自动替换当前程序。

## 尚不在本阶段完成声明中的事项

- 原始 TS 类型、注释、提交历史的精确还原。
- Electron/Chromium 与所有第三方 native 依赖的源码重编译。
- 954 条静态候选义务的逐项所有者/行为证据绑定与全关闭。
- 所有动态路径、跨机器、长期运行与所有厂商 API 的完全等价性。
- 公共 ngrok/Cloudflare 账户服务与真实付费模型接口验收。

这些限制不改变本阶段列出的已完成项，但不能被省略成“所有原始源码已经完整还原”。
