# ShunCode MCP 连接与源码重建恢复记录

日期：2026-10-14

## 结论

MCP 已按协议直连并实际调用工具；不是仅打开链接，也不是新增平台永久连接器。上一次源码重建任务已从仓库、备份和构建记录恢复，并实际推进了源码构建与回归。

**当前不是完整产品验收完成状态。** 扩展、Agent/MCP、桌面编辑器核心 bundle 已构建，但类型检查入口、完整产品组装、独立 GUI 与 Ask/Plan/Code 功能验收仍未完成。`version.json` 的 `fullSourceBuild` 保持 `false`，未发布、未推送、未覆盖当前运行的编辑器。

## 连接与环境

| 项目 | 已核实结果 |
| --- | --- |
| MCP 服务 | `shuncode-bridge`，服务自报版本 `0.7.6` |
| 协议 | `2025-03-26`；完成 initialize、initialized 通知和 tools/list |
| 工具数量 | 16 |
| 当前工作区 | `E:\open_shuncode` |
| 工作分支 | `reconstruction/full-source-20261014-123446` |
| HEAD | `19bf489275681c4ffc800ae61b392f18425acec8`；工作树有未提交重建成果 |
| 仓库开发版本 | `0.7.10` |
| 本机构建环境 | Node.js `24.15.0`、npm `11.12.1`、Python `3.13.12` |
| 只读分析目标 | `D:\ShunCode` |
| 正在运行的程序路径 | `D:\ShunCode-Release-Candidate-0.7.8\app\ShunCode.exe`；目录名不作为已加载构建版本的证明 |

MCP 地址含访问凭据，不写入本记录、补丁或持久化工具清单。Cloudflare Quick Tunnel 重启后地址可能变化，需要重新提供地址并验证连接。

## 16 项可用工具

| 类别 | 标准工具名 |
| --- | --- |
| 文件与资源 | `list_directory`、`find_files`、`search_files`、`read_files`、`read_image`、`apply_patch` |
| 终端 | `run_command`、`get_command_output`、`send_command_input`、`cancel_command` |
| 代码语义与诊断 | `lsp`、`get_diagnostics` |
| 任务协调 | `set_todos`、`update_plan`、`report_progress` |
| PDF | `pdf_reader` |

工具清单和输入约束已读取。PDF 工具的运行依赖和具体附加参数未在本轮验证；没有虚称所有工具都已逐一执行。REA/Ghidra 不是这份 tools/list 中的专用工具。

## 执行规则

1. 默认围绕当前任务和打开的工作区工作。`D:\ShunCode` 只读；对 `E:\open_shuncode` 的现有文件先读、先备份，再修改。其他本机路径仅在任务确有需要时定位并只读检查，避免无关数据读取。
2. 文件工具受工作区边界限制。终端不是操作系统沙箱，不把工作区文件边界误当作整机隔离，不通过工具参数自行提权。
3. 定位符号优先使用 LSP；定位原始字符串使用 search_files；已知文件直接定向读取。LSP 空结果不证明符号不存在。本轮 LSP 返回 provider_state unknown、semantic_result_inconclusive true，因此不能把空诊断当作类型检查通过。
4. 修改用小范围 apply_patch，并附 read_files 返回的 SHA-256 版本。上下文或版本不匹配时先重读，不盲目重试；不并行修改同一文件。
5. 独立的读取、探测和不相交构建可并行；有依赖的读取、备份、补丁、构建和验证按顺序执行。
6. run_command 在本机 Windows 上运行原生 Bash。cwd 必须工作区相对；Bash 中 Windows 路径使用 `/e/...` 等形式。只在需要 Windows 专用设施时显式调用 PowerShell。
7. 超时返回 running 不表示命令已停止。保留返回的真实 command_id，按 next_offset 读取增量输出，不重复启动同一构建；只取消本任务拥有的命令，不干扰现有程序。
8. 多步任务维护完整有序待办、稳定 ID 和 acknowledged task_revision；最多一个 in_progress。结束前明确提交 completed 或如实 blocked/cancelled 并等待确认，不靠断连宣称完成。
9. 变更后运行相关测试和诊断；不使用占位实现、关闭授权检查或伪造通过结果来消除失败。
10. 不覆盖、部署到或自动重启当前 Bridge 所在程序；不启动付费模型调用、不公开凭据。源码、构建、GUI 和发布验收分别记录，不把其中一项成功等同于全部完成。

## 恢复出的旧任务与证据

任务目标：使用已安装程序辅助分析，补齐缺失实现，以真实源码构建与功能回归作为验收；不承诺还原不存在于产物中的原始 TypeScript 类型、注释或提交历史。

已经存在的重建成果包括 44 个共享入口 facade、292 个分拆重建模块图节点（扩展 124、Agent 65、MCP 103），以及锁定到 VS Code `1.132.0` 的编辑器源码。

上游记录见 `editor/SHUNCODE_UPSTREAM.json`：

- 上游提交：`df53daabb18cd157bdb08c7f01c34df936cf12f4`。
- 源码归档 SHA-256：`839e64034892e272d765d769e4db25c6616ecfa662b55fbe0e28f86139ab2ee0`。
- 原始恢复来源与范围见 `src/recovered/extension/provenance.json`、其他 recovered 目录对应的 provenance，以及 `editor/SHUNCODE_RECONSTRUCTION.json`。

历史证据显示 REA/Ghidra 曾对一个原生 `.node` 库做概览分析，底层 Ghidra 版本为 `12.1.4`。这是已查阅的历史结果，不是本轮重新执行，也不代表所有原生组件均已恢复。REA 的自动 JavaScript 恢复曾因 Wakaru 提供者不可用而失败；可追溯模块重建使用了 AST 分拆与链接，不能把失败的 REA 调用描述成成功恢复。

## 本轮变更

- 修正 `test/source-recovery.test.cjs` 对命令 ID 归一化的错误期待。原实现会保留未知字符串供后续查表拒绝，不返回 undefined；运行时实现与权限行为未放宽。
- 在 `test/source-extension-integration.test.cjs` 中用实际源码 bundle 的 TerminalCommandManager 验证未知 ID 与跨所有者访问拒绝。测试夹具使用正确的类，而不是将内部方法误挂到 IdeToolBroker 上。
- 保留重建的旧版 voice glow 行为；新增 `editor/src/vs/workbench/contrib/chat/browser/voiceClient/voiceGlowTheme.ts`，复用锁定上游版本的真实主题/rim API，并从原 voiceGlow 模块重新导出。没有空函数占位。
- 在 `editor/src/vs/sessions/common/sessionCommands.ts` 中补回上游 `RENAME_SESSION_COMMAND_ID`，保留原有 archive/unarchive 值。
- 新增 `test/source-editor-compat.test.cjs`，执行真实颜色与会话命令实现的回归。
- 在 `package.json` 中添加显式 `test:source` 和 `verify:source:extension`，避免原 `.test.js` 测试入口漏掉重建 `.test.cjs` 测试。

上游参照文件原始 SHA-256（不是修改后文件的哈希）：

- `editor/src/vs/workbench/contrib/chat/browser/voiceClient/voiceGlow.ts`：`3716765b303957e509c4a72152a98dd457c2924ec38d86449d8dc1ab2097dc47`。
- `editor/src/vs/sessions/common/sessionCommands.ts`：`6dd7c5b74246e362edc569c088e391f074edfb7379ecfdf832343798e5069f22`。

## 实际验证结果

| 检查 | 结果与边界 |
| --- | --- |
| 扩展、Agent、MCP 源码重编译 | 成功；esbuild 输入数量分别为 341、50、105 |
| 三组件实体输入与产物 SHA-256 核对 | 成功；未将旧 `extension/dist/`、`extension/runtime/`、`extension/legacy/` 作为编译输入 |
| 桌面编辑器 source bundle | 成功，24 个 bundle，约 68.5 秒；17 个后处理 JS 的语法检查通过，3 个 standalone 文件编译完成 |
| 编辑器资源/NLS | 267 个输出文件；复制 186 项资源；提取 22,557 条消息、1,846 个模块 |
| `npm run verify:source:extension` | 最终退出码 0；源码回归 23/23 通过 |
| 原维护回归 | 35/35 通过；基础语法、版本与命令检查通过 |
| 原 `npm run verify` 总体 | 退出码 1，最后的 build:check 报 `Stale build inputs`；不能称总体通过 |
| 类型检查 | `extension/tsconfig.source.json` 当前不存在；未声称类型检查通过 |
| 完整产品独立启动、GUI、Ask/Plan/Code | 未完成验收 |

桌面编辑器核心 bundle 成功不等于已编译全部内置扩展、组装 Electron/原生依赖或通过 GUI。三组件的输入审计也不替代整个编辑器依赖图的统一审计。

## 备份与构建证据

本轮修改前备份：

`E:\项目管理\ShunCode-源码重建\backups\resume-20261014-154913`

包含 406 个文件的清单与 SHA-256；两项编辑器修改目标另存在该目录的 `editor-targets` 子目录。此前的 Git bundle 备份保持不变。

仓库中的最终证据：

- `artifacts/source-build/build-receipt.json`
- `artifacts/source-build/generated-build-info.json`
- `artifacts/source-build/validation/resume-source-verify-final.log`
- `artifacts/source-build/validation/resume-source-tests-final.log`
- `artifacts/source-build/validation/resume-editor-bundle.log`
- `artifacts/source-build/validation/resume-maintenance-verify.log`
- `artifacts/source-build/validation/resume-artifact-audit.json`
- 各输出旁的 `.build.json` 输入清单和哈希

中间失败日志保留用于追溯；最终结论以本节明确标出的最终验证结果为准。artifacts 属于忽略的本机构建证据，未提交到 Git；需要交付时应单独归档并复核敏感信息。

## 后续直接续作的待办

1. 补齐新的类型检查配置和所需声明，修正原配置中的旧外部路径；不要仅关闭检查来获得绿色结果。
2. 统一源码构建入口与输入/依赖审计，明确原增量产物流程的保留或迁移方式；处理 `Stale build inputs`，不混称源码与旧基线产物。
3. 在独立目录组装完整产品，核实扩展运行时布局、内置扩展及原生依赖，然后完成独立启动、GUI、Ask/Plan/Code、MCP 与权限回归。
4. 更新源码来源/限制说明与交付证据；只有相应验收真正通过后才标记完整源码产品完成或发布。

连接准备、本轮编译与已列回归已完成。整个源码重建目标保留未完成待办，不因本轮结束而标为完成。
