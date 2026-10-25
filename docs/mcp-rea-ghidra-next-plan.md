# REA/Ghidra 实际验证与下一阶段执行计划

日期：2026-10-14

## 执行原则

按用户要求，凡是可用且对源码重建有证据收益的 REA/Ghidra 能力，优先实际调用，不因调用次数或分析耗时跳过。独立分析并行运行；工具的完整证据保留在本机，不只保留概要。

REA 用于 JavaScript/Electron 静态图、语义追踪、源码/产物比较、恢复及覆盖记录；Ghidra 用于原生 PE、DLL、`.node` 的函数、调用、数据类型和 ABI 分析。两者按适用对象组合，而不是把 TypeScript 当机器码反编译。

原始目标 `D:\ShunCode` 保持只读。修改继续集中在 `E:\open_shuncode`，先备份、使用版本校验补丁，并且不覆盖或重启当前 Bridge 所在程序。

## 本轮已经实际执行的验证

以下是本轮新调用，不是历史日志的复述。

| 操作 | 结果 | 范围 |
| --- | --- | --- |
| 本机 REA CLI 版本与真实命令/schema 读取 | 可调用，版本 6.4.0 | 使用本机 CLI，不是新增 Arena 永久连接器 |
| `doctor --provider ghidra` | 退出码 0，healthy=true | Ghidra 12.1.4、JDK 21.0.12.1、Windows x64 原生反编译器与控制组件检查通过 |
| REA 扩展 JavaScript 静态分析 | 退出码 0，约 93 秒 | `D:\ShunCode\resources\app\extensions\shuncode`；约 49.7 MB 完整 Evidence |
| Ghidra 原生过程搜索 | 退出码 0，约 40 秒 | `native-is-elevated` 的 `iselevated.node`；实际找到 `napi_register_module_v1` |
| Ghidra 注册入口函数反编译 | 退出码 0，约 39 秒 | 从上一步结果选取 `0x180001130`，得到函数伪代码，不只是 binary overview |
| REA 自动 JavaScript 恢复入口探测 | 子命令退出码 1，capability_unavailable | Wakaru 后端未配置；要求绝对路径的 Linux x64 Wakaru ^1.13.0，报告解析器验证版本为 1.14.0 |
| 原文件完整性 | SHA-256 前后相同 | 原生目标与 `dist/extension.js` 均未修改 |

JavaScript 分析返回的应用图为 501 个节点、716 条边；语义图为 27,832 个节点、23,975 条关系，并明确报告 10,161 条 unknown。**这些是不同种类的图元素，不是模块数量或完成百分比。** unknown 包含动态 JavaScript 无法静态判定的关系，不能全算成缺失源码，也不能忽略其中的关键业务缺口。完整性矛盾列表为空，但这不等于运行时等价或完整源码恢复已证明。

原生注册入口的伪代码显示，它创建并导出 `isElevated`，回调指向 `FUN_180001050`。这给出了下一次函数追踪的真实种子。伪代码仍有未知类型和编译器安全检查提示，不是原始 C++，本轮也尚未证明回调的全部行为。

需要注意：恢复探测的外层 JSON 为 `ok:true`，但 data 明确包含 `capability_unavailable`，且子命令退出码为 1。本计划按实际操作失败处理，不以外层封装字段冒充成功。

## 工具环境和证据位置

已核实本机路径：

- REA：`E:\项目管理\rea\rea` / `rea.cmd`，实际入口 `node_modules/rea-agents/scripts/rea.mjs`。
- Node：`E:\nodejs\node.exe`。
- Ghidra：`E:\项目管理\ghidra\app\ghidra_12.1.4_PUBLIC`。
- JDK：`E:\项目管理\ghidra\jdk21\jdk-21.0.12.1+1`。

调用时只在子进程环境中设置 GHIDRA_INSTALL_DIR、JAVA_HOME 等路径，没有修改系统全局环境或自动升级工具。已有 REA 中文路径/Java 输出兼容修正保持不变。

证据根目录：

`artifacts/source-build/validation/rea-ghidra-plan-20261014-165750/`

包含：

- `doctor.json`、`capabilities.json`
- `extension-js-analysis.json`、`extension-analysis-summary.json`
- `native-procedures.json`、`native-entry-decompile.json`
- `native-analysis.snapshot.json`
- `javascript-recovery-probe.json`
- 对应的 stderr 日志
- `native-immutability-check.json`、`probe-immutability-check.json`

证据主体可能包含应用源码和字符串，保留在忽略的本机构建目录中，不直接提交或公开；分享前审阅敏感内容。MCP 地址与访问凭据不写入记录。

## 下一阶段：六个执行步骤

### 1. 先形成源码缺口与验收清单

- 在现有扩展分析基础上，用 REA 扩展分析到 Agent、MCP，以及编辑器 main/workbench/sessions 的应用边界。
- 对照已有 `src/recovered`、扩展 TypeScript、编辑器重建源码、source map 和锁定上游，逐项分类：原始可读源码、同版本上游、重建实现、仍缺失或行为未知。
- 用 REA 的重建义务清单/覆盖工具建立模块与功能表，关键 unknown 关联到具体待验证行为，而不是按代码行数或工具调用次数宣称完成。
- 明确保留已选择的维护改动，例如权限模型的预期变化，避免把所有与旧发行包的差异都当作重建错误。

交付：每个关键模块的来源、输入哈希、依赖、入口、尚缺内容和对应验收项。

### 2. 打通 REA JavaScript 恢复后端，继续原生函数级分析

- 核实已有 WSL 或隔离 Linux x64 环境，部署文档支持的 Wakaru 后端；验证版本、二进制哈希、prlimit 及 REA 调用结果。
- 优先使用可获得的真实 source map 与同版本源码；用 REA 恢复结果与现有 AST 分拆作交叉验证，保留每项变换的来源和限制。
- 对 esbuild scope-hoisted 产物，检查真实输出：工具可能只返回一个脚本，不能把“命令成功”当成成功分拆或完整还原。
- 对缺失源码或接口有疑点的原生组件，用 Ghidra 追踪实际函数、调用关系、导入导出和 ABI。已经找到的 `FUN_180001050` 可作为 `isElevated` 后续追踪种子。
- 第三方组件已有官方源码时，使用对应版本源码并以 Ghidra/ABI 证据交叉核对，不凭不完整伪代码重新发明整套实现。

交付：真实恢复产物、原生接口与行为记录，或者明确的不可用原因。若需要安装 WSL、修改系统组件或新增高权限服务，先确认；不为了绕过限制擅自改全局环境。

### 3. 对关键实现做双向核对并修补

- 用 REA 的源码/产物比较、导出形状比较、语义追踪核对 API、状态、IPC、初始化顺序和资源引用。
- 优先检查原来整段替换过的编辑器模块，避免重建再次丢掉上游调用者需要的导出。
- 对动态分支和关键 unknown 加定向行为测试或被动运行时证据，不把静态名字相同当作语义等价。
- 每次只修复可解释的差异，先读取与备份，附版本哈希补丁，并记录来源与回归结果。

交付：通过对照与定向测试的关键模块，不只是漂亮、能解析的 JavaScript。

### 4. 关闭当前构建阻塞，建立完整源码构建入口

- 补齐 `extension/tsconfig.source.json`，修正旧外部路径，补充真实契约支撑的重建类型声明；不通过全局 any、通配声明或新增大范围 ts-nocheck 掩盖问题。
- 统一扩展、Agent/MCP、编辑器、内置扩展、资源及原生依赖的构建和组装入口，锁定版本与环境。
- 从干净输出目录构建，并对各阶段记录输入清单、输出哈希和构建信息；所有第一方编译输入不能依赖旧发行包的可执行 JS bundle。
- 处理原 `build:check` 的 Stale build inputs，明确旧增量维护流程与新源码流程的关系，不混用其验收结论。

交付：可重复的完整构建命令、真实类型检查结果及整个产品的输入/产物审计。

### 5. 独立组装、启动并做 GUI 与功能回归

- 在新目录组装产品，核对扩展 runtime 的相对布局、清单、media/agents、内置扩展、Electron 与原生模块 ABI。
- 使用独立 user-data、扩展与测试项目目录启动，不覆盖当前运行的程序、不替换当前 Bridge。
- 检查 REA 的 Electron/CDP 与场景采集能力；可用则实际使用。Windows 上不可用的 macOS 原生 UI 工具不算作可用 GUI 验收工具；必要时用相应的 Electron/Playwright 自动化。
- 测试编辑器打开/保存、工作区、Bridge 页面、MCP 连接和文件工具、终端持续性、任务状态、取消、权限拒绝/撤销，以及 Ask/Plan/Code 流程。
- 模型与工具流程先用可控本地服务/夹具验证；真实付费模型接口或读取个人密钥另行确认，不把离线测试冒称实际厂商服务验收。

交付：独立运行记录、截图/日志/场景证据和逐功能通过/失败表。

### 6. 最后交付，完成与未完成分开报告

- 更新源码来源、许可证/第三方说明、构建文档、限制和证据索引。
- 交付可追溯源码、构建命令、独立产物、哈希、回归记录及剩余缺口。
- 只有相应全产品验收通过后，才标记 fullSourceBuild/发布状态；原始 TypeScript 类型、注释和提交历史仍不能因反编译成功而声称恢复。

## 目前的完成状态

本轮完成的是工具能力的实际验证与下一阶段计划，不是六个执行步骤全部完成。

上一轮已验证的扩展/Agent/MCP 重编译、24 个桌面核心 bundle、源码回归 23/23 和维护回归 35/35 仍是分项证据；旧整体 verify 的产物一致性失败、类型检查入口和完整产品 GUI 验收仍待处理。源码重建原任务没有被标为完成，当前程序没有被覆盖或重启。

接下来优先执行第 1、2 步：覆盖清单与 REA 恢复后端并行推进，再按证据修补类型/构建及独立产品验收。
