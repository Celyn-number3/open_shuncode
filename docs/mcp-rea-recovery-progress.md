# 源码重建续作：REA 恢复后端、覆盖清单与严格类型检查

日期：2026-10-14

## 本轮实际推进

1. 恢复原源码任务句柄，继续同一重建分支；没有把整个源码目标标为完成。
2. 在隔离 Linux x64 分析环境部署 Node 24.15.0、REA 6.4.0、Wakaru 1.14.0 与 prlimit。Node 归档核对官方 SHA-256，Wakaru 二进制 SHA-256 与本机 REA 文档一致。没有改动 Windows 全局环境或安装 WSL。
3. 将三份原始 bundle 按分块哈希及整文件 SHA-256 核对后送入恢复流程；不执行原应用代码。实际调用 REA recover-javascript-sources，而不是只查阅历史结果。
4. 生成现有重建模块清单和真实 REA 候选验收义务账本。
5. 通过 Ghidra 实际追踪 isElevated 回调的伪代码、汇编、调用关系和引用。
6. 添加有效的严格类型检查入口，暴露真实类型缺口，并重跑已有源码构建/回归。

## REA/Wakaru 的实际恢复结果

| 原始目标 | 原始 SHA-256 | 工具输出模块数 | 子命令退出码 |
| --- | --- | --- | --- |
| 扩展 entry bundle | `5090c3f35fe4a6ddebbf1a12a5cce954fb8a5473591b14e8633f7b3dd01d026b` | 14 | 0 |
| Agent runtime | `0d036c8504ab442fc0823fb750385df552cea3d2527bf20e8e44d83f36f670aa` | 17 | 0 |
| MCP runtime | `9e35d97fe29c5009c4741381d10f662f4cf784d528b1b73166d0cb836bc54976` | 8 | 0 |

总计 39 个结构化输出模块，带 source map、原始字节范围、manifest 与生产者报告。三个原始输入前后哈希一致。

- 引擎：Wakaru 1.14.0。
- 执行二进制 SHA-256：`664fa06782a61eda7ed15885134b52525fd565dd77607e642062ceb6cd927c38`。
- 参数：structural extraction、standard rewrite。
- 工具报告 status=complete、failed=0，但 runtime_equivalence=unknown。
- 原始 TypeScript、注释及变量语义没有因此被证明恢复。

扩展和 MCP 各有一条 commonjs_export_unrecovered 警告：ESM 输出仍访问 module.exports。随后实际把这些输出重新 bundle 为 CJS，三个 bundle 都能生成，但运行探测发现更深的跨模块绑定问题：

| 验证 | 结果 |
| --- | --- |
| 扩展恢复输出重新 bundle | 成功；未进行完整扩展激活或 GUI 验收 |
| Agent 恢复输出重新 bundle | 成功 |
| Agent 关闭 stdin 的独立运行 | 退出码 1，ReferenceError: globalConfig is not defined |
| MCP 恢复输出重新 bundle | 成功 |
| MCP 实际导出/工厂加载 | 退出码 1，ReferenceError: __defProp is not defined |

源文件核对显示：globalConfig 在 Agent entry 中定义、却被拆出的 util 模块引用；__defProp 等原始 bundle helper 在 MCP entry 中定义、被拆出的 exports 模块引用。这是需要修复和验证的跨模块闭包/初始化绑定问题，不能仅用“编译通过”或“工具 complete”判定运行可用。

**没有将这批未通过运行验证的输出替换现有 src/recovered 实现。** 当前通过 23 项回归的实现仍保留。

## 已保存到本机仓库

证据目录：`artifacts/source-build/validation/rea-continuation-20261014/`。

REA/Wakaru 完整恢复树已按归档 SHA-256 核对回传到：

`artifacts/source-build/validation/rea-continuation-20261014/linux-wakaru-recovery/`

- 包含 97 个文件：输入快照、39 个模块及相应映射、manifest、stdout/provenance 和本轮结果。
- 归档：`rea-wakaru-recovery-20261014.zip`，2,198,005 字节。
- 归档 SHA-256：`447b3ac9d44b7f21ed8606b92285ba943bbae24fa2559e8a03d576e802ee689e`。
- 镜像凭据：`linux-recovery-mirror-receipt.json`，记录每个文件的哈希。
- 原生产者报告中的 Linux 执行路径保留为历史执行坐标，没有改写原证据冒充 Windows 本机执行。

这些目录属于忽略的本机构建证据，不自动提交。原始源码/字符串可能含敏感内容，分享前应审阅。MCP 访问地址与凭据没有写入报告。

## 覆盖清单与 REA 义务账本

`source-inventory.json` 和 `source-inventory.csv` 已记录 346 项现有重建记录：

- 扩展：124。
- Agent：65。
- MCP：103。
- 编辑器：54。

346 项对应文件全部存在。四项 provenance 记录哈希与当前文件不同：voiceGlow.ts、sessionCommands.ts、workbench.desktop.main.ts、sessions.desktop.main.ts。前两项与之前的已知修补相关；其余修改来源和记录同步仍需审阅。哈希差异不自动视为损坏，也不自动判为已验证。

REA 初次手工构造的账本请求返回 unreadable_output。随后改用 REA 自己的 createImmutableEvidenceBundle 认证原始记录、生成规范化 bundle，并通过真实账本服务重新生成成功；没有绕过认证或伪造 Evidence ID，也不把首次失败报成成功。

最终账本：`reconstruction-obligations-canonical.json`。

- ledger_id：`rol_6fb0d4f840ebc77fa321776f4eedeb94223020eb5a96df8dae434d6877083597`。
- 状态：unknown。
- 候选义务：954，已验证：0。
- CLI 8、protocol 44、runtime 834、packaging 1、application 67。
- 这些是静态候选，不是 954 个已证明的源码缺口或已通过的功能。
- 当前尚未绑定唯一实现所有者、原始/重建测试样本及相应 verifier；不能把已有 23 项回归直接算作这 954 项都关闭。

## Ghidra 的函数级证据

Ghidra 12.1.4 实际生成 `0x180001050` 回调的函数 dossier，证据文件为 `native-is-elevated-callback.json`。记录包含 201 字节函数体、伪代码、汇编、调用和引用。

观察到的调用链包括：

- AllocateAndInitializeSid，构造管理员组 SID。
- CheckTokenMembership。
- FreeSid。
- napi_get_boolean，向 JavaScript 返回布尔结果。

这比注册入口概览更深入，但仍是反编译证据，不是原始 C++，也没有完成对所有原生组件的源码或 ABI 验收。目标原生文件哈希仍一致。

## 类型检查：入口已补齐，问题没有隐藏

新增 `extension/tsconfig.source.json`：

- 指向仓库中的锁定编辑器 vscode.d.ts 与所需 proposed 声明，不再引用不存在的外部 vscode-main 路径。
- TypeScript strict=true、noEmit=true，采用与 esbuild 工作流一致的 Bundler 模块解析。
- 重建 JavaScript 作为允许的 JS 输入参与模块/类型推断，checkJs=false；这不构成原始 JS 类型完整恢复或逐行严格检查声明。
- 未增加通配模块声明、大范围 any 或 ts-nocheck 来掩盖 TypeScript 错误。

实际 tsc 退出码 2，发现 68 条错误，分布于 7 个文件，主要类别为：

- 缺失重建类型导出：TS2305/TS2724。
- JS class 值重导出缺少可用实例类型：TS2749。
- 丢失泛型与回调上下文类型：TS2558/TS7006/TS7031。
- 共享返回形状和上游 ChatSimpleToolResultData 差异：TS2339/TS2345/TS2322/TS2353。

完整记录：`source-typecheck-initial.log`、`typecheck-diagnostics.json`。IDE diagnostics 返回 0，不作为类型检查通过的证据。

## 本轮回归

重新运行 `npm run verify:source:extension`，退出码 0：

- 现有扩展、Agent、MCP 源码重编译成功。
- 源码回归 23/23 通过。
- 这套回归针对现有重建实现，不是对新 Wakaru 输出运行失败的否认。
- 未覆盖 D:\ShunCode，也没有覆盖或重启当前 Bridge 程序。

## 下一步的具体工作

1. 为缺失共享接口/泛型/类实例表面补充标注为推导重建的声明，依据实际 JS 实现和原调用方；处理 68 条严格类型错误，不使用宽泛声明盖住问题。
2. 对 Wakaru 拆分输出修复跨模块作用域与初始化链接，保留未经修改的生产者证据，并重新跑 Agent/MCP 实际加载和权限/文件工具探测；通过前不替换稳定重建代码。
3. 将 954 条静态候选归属到当前实现与逐功能验收样本，区分必要功能、第三方依赖和静态不确定性，不能按数量宣称完成。
4. 统一完整源码构建、解决旧产物 Stale build inputs，并推进独立产品组装与 GUI/Ask/Plan/Code 验收。

本轮已打通真实 REA 恢复后端并生成、保存实际产物与覆盖基础。整个全源码产品仍未完成，fullSourceBuild 保持 false。
