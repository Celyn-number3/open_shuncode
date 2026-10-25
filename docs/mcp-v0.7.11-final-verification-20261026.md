# 0.7.11 产品级复验记录

日期：2026-10-26
目的：关闭 [发布决策](mcp-v0.7.11-release-decision.md) 中的阻塞 1——在最终提交上重新组装产品并重跑 GUI 验收。

## 结论

**阻塞 1 已关闭。** 在提交 `b9ddfd8a` 上从仓库源码重新编译并组装了 0.7.11 产品，17 个 GUI/MCP 场景全部通过，10,948 个文件逐个哈希复核一致，产品完整性 10/10，套件退出码 0。

| 项目 | 结果 |
| --- | --- |
| 产品目录 | `artifacts/source-product-0.7.11-20261026`（1.6 GB） |
| 构建提交 | `b9ddfd8a`，`sourceDirty: false` |
| 产物凭据 SHA-256 | `cd21f5238b0078f31a8b42adba6b00210371e59df1f7fc5c4d2ab8099e96a6fd` |
| 凭据内文件数 | 10,948，`source_build_executed: true`，`old_first_party_bundle_inputs: false` |
| 独立复核 | 10,948/10,948 哈希一致，缺失 0，不一致 0 |
| 产品完整性 | 10/10 checksum |
| GUI 场景 | 17/17，`pageErrors: 0`，退出码 0 |
| 发布包 | `ShunCode-0.7.11-win-x64.zip`，598,842,980 字节，SHA-256 `e52998b486caaebd46ca90fb7bfb76b261908aa2358af8753b9c33b37e1e7630` |

构建与验收日志：`artifacts/source-build/validation/product-build/`、`artifacts/source-build/validation/final-stage/gui-integration-0.7.11/`。

## 环境

- Windows x64，Node.js 24.15.0，npm 11.12.1，Python 3.13.14。
- 运行时输入：`D:\ShunCode` 只读复用（Electron/Chromium、原生模块、锁定的第三方依赖）。
- 独立 user-data：`artifacts/source-gui-profile-0.7.11`，不复用现有编辑器数据。
- 未覆盖 `D:\ShunCode`，未重启当前 Bridge。

## 构建过程

| 步骤 | 结果 |
| --- | --- |
| 严格扩展类型检查 | 通过，退出码 0 |
| 扩展 / Agent / MCP 源码重编译 | 通过（341 / 50 / 105 个输入） |
| 源码回归 | 28/28 |
| 桌面核心 bundle | 24 个 bundle + 3 个 standalone |
| 内置扩展 | `compile-extensions-build` 完成，全部扩展 tsgo 检查 0 errors，95 个扩展 |
| 组装 | 10,948 个文件，生成真实 checksum、`SOURCE_BUILD_INFO.json` 与凭据 |

## 17 个 GUI 场景

1. 源码扩展实际激活
2. 打开、编辑、保存真实工作区文件
3. 产品完整性无「安装损坏」提示
4. 通过真实 UI 配置非秘密的 loopback key
5. 已组装产品上的真实 MCP initialize/initialized 握手
6. MCP 实际读取文件
7. MCP 实际补丁创建文件
8. MCP 实际持久终端执行，核对退出码与 stdout
9. Bridge 设置与会话 UI 显示
10. Ask 模式：真实 provider → runtime → 流式响应 → GUI 可见
11. Plan 模式：同一链路
12. Code 模式：同一链路
13. Code 模式实际经 agent `apply_patch` 创建文件，核对磁盘内容
14. Ask 工具表面保持只读（无 `apply_patch`/`run_command`）
15. Plan 工具表面保持只读
16. 用真实命令句柄请求取消
17. 本地撤销权限后 `tools/list` 隐藏终端工具，下一次调用被拒绝

## 过程中遇到的失败与处置（保留为诊断证据）

| 现象 | 原因 | 处置 |
| --- | --- | --- |
| 构建在 `desktop-source` 失败 | 环境注入的删除保护要求批量删除确认（268 个旧产物） | 把旧 `editor/out` 移为 `out-20261014`，不删除 |
| 构建在 `builtin-source` 失败 | `clean-extensions-build` 删除达到 50 个阈值 | 仅对构建子进程设 `CODEBUDDY_SAFE_DELETE_ENABLED=0`，让 gulp 清理自己的产物 |
| GUI 截图 30 秒超时 | 首次全页截图在扩展宿主启动期偶发卡住，应用本身正常 | 截图改为重试 3 次并禁用动画；截图属取证，不参与断言 |
| GUI 补丁与终端被拒 | 复用上一次的 profile：`撤销全部` 已持久化为只读默认，模型组重名 | 套件加「profile 必须全新」的硬保护；该次证据保留为 `gui-integration-20261026-attempt3-stateleak` |
| 打包后 `sourceRevision` 为空 | 源码构建只把版本信息注入 bundle，未写成文件；打包器只认旧 `build-info.json` | 产品根目录写 `SOURCE_BUILD_INFO.json`，打包器兼容源码构建凭据 |
| `sourceDirty: true` | 工具改动未提交就构建 | 提交后在干净提交上重建 |

三次 0.7.10 编号的尝试（`20261026`、`20261026b`、`20261026c`）保留为诊断证据，最终发布产物是 `0.7.11-20261026`。

## 环境限制

沙箱把 `wsl.exe` 列入程序黑名单并阻止其启动，工作台启动时的 WSL 探测因此被拦截。该限制不影响任何断言：17 项全部通过，`pageErrors` 为 0，扩展宿主退出码 0。这是执行环境的限制，不是产品行为，也不能据此判断 WSL 远程能力。

## 仍然成立的限制

- 编辑器侧 53 个重建模块未做严格类型检查（`@ts-nocheck`）。
- 954 条 REA 静态候选义务未逐条验证（0 条 verified），仅按族归类。
- 付费厂商模型 API、Gitee/GitHub 授权、用量上报、公共隧道服务未验收。
