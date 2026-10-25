# 0.7.11 发布决策与检查清单

日期：2026-10-26
适用对象：`E:\open_shuncode` 的 `reconstruction/full-source-20261014-123446` 分支。

## 背景

`v0.7.10` 已于 2026-10-14 用旧的预编译基线增量流程发布（资产 `ShunCode-oss-0.7.10-win-x64.zip`，414 MB，当前为 Latest）。源码重建版功能集合相同但构建方式不同，**不能以同一版本号覆盖已发布资产**，因此本次以 `0.7.11` 发布。

## 决定

**已于 2026-10-26 发布 `v0.7.11`。**

维护者确认了两件事：新连接默认「整机 + 终端 + 自定义工具且永久有效」就是本版的发布意图；release notes 原文保留「必须披露的限制」一节。

## 已具备的条件

| 项目 | 状态 | 证据 |
| --- | --- | --- |
| 第一方源码构建 | 完成 | 扩展 341 / Agent 50 / MCP 105 输入；24 个 desktop bundle |
| 独立产品组装 | 完成 | `artifacts/source-product-0.7.11-20261026`，10,948 个文件逐个复核 |
| 发布包 | 已上传 | `ShunCode-0.7.11-win-x64.zip`，571 MiB，SHA-256 `e52998b4…7630` |
| 源码回归 | 通过 | 28/28 |
| 维护回归 | 通过 | 35/35 |
| GUI 场景 | 通过 | 17/17，`pageErrors: 0`，退出码 0 |
| 来源哈希一致性 | 通过 | `check-provenance-hashes.cjs` 报告 drift 0（6 处已知变更已记录） |
| 成果已固化 | 完成 | 重建成果已提交（`d3bc75b0` 起）+ `backups/open_shuncode-reconstruction-20261026.bundle` |
| 义务范围 | 已归类 | 954 条拆为 918 族级回归 / 22 厂商服务 / 14 无所有者静态候选 |

## 发布阻塞项

| # | 阻塞 | 现状 | 关闭方式 |
| --- | --- | --- | --- |
| 1 | GUI 验收未在最终提交上重跑 | **已关闭**：在 `b9ddfd8a` 上重跑 17/17 | 见 [最终提交复验](mcp-v0.7.11-final-verification-20261026.md) |
| 2 | 编辑器类型覆盖缺口 | 53 个重建文件带 `@ts-nocheck`，strict 仅覆盖扩展 | 已在 release notes 披露；补声明可后续做 |
| 3 | 厂商服务未验收 | Gitee/GitHub 授权、用量上报、许可校验、公共隧道均未真实调用 | 已在 release notes 披露「未覆盖」 |
| 4 | 高风险默认权限需产品确认 | **已确认**：维护者确认该默认即发布意图（2026-10-26） | 已在 release notes 与 README 如实描述 |
| 5 | 954 条义务未逐条关闭 | 账本 `status: unknown`，0 条 verified | 已在 release notes 披露；归类见 [义务归类](mcp-obligation-triage.md) |

阻塞 2、3、5 以「如实披露」处理，披露文字已写入 [发布说明](mcp-v0.7.11-release-notes.md)。

## 发布前检查清单

按顺序执行，任一步失败即停止。全部已执行：

- [x] `npm ci && npm --prefix editor ci --include=optional && npm --prefix editor/build ci`
- [x] `npm run verify:source:extension`（类型检查 + 三组件重编译 + 28 项回归）
- [x] `npm test`（35 项维护回归）
- [x] `npm run triage:obligations`（954 条归类仍为 918/22/14）
- [x] `node tools/source-recovery/check-provenance-hashes.cjs`（drift 0）
- [x] `python tools/build-source-product.py --runtime "D:/ShunCode" --output "<全新目录>"`
- [x] 在新产品上重跑 GUI 场景，17/17
- [x] 核对 `SOURCE_BUILD_RECEIPT.json` 与 `SOURCE_BUILD_INFO.json`（10,948 文件，`sourceDirty: false`）
- [x] `python tools/package_release.py`，ZIP 内含 `LICENSES.chromium.html`、`resources/app/ThirdPartyNotices.txt`，CRC 通过
- [x] 更新 `version.json`（`0.7.11`）与 README 版本说明
- [x] 打 tag `v0.7.11`、推送 `main` 与 tag、创建 GitHub Release 并上传 ZIP

## 必须披露的限制

> 本版本的第一方 JavaScript/TypeScript 由仓库源码编译，Electron/Chromium 与第三方原生模块复用匹配的运行时，未从源码重编译。编辑器侧有 53 个重建模块未做严格类型检查；原始 TypeScript 类型、注释与提交历史无法从产物中恢复。REA 账本中的 954 条静态候选义务未逐条验证（0 条 verified），仅按族归类。模型功能使用本地 loopback 兼容服务验收，未调用付费厂商 API；Gitee/GitHub 授权、用量上报与公共隧道服务未验收。MCP 终端权限不是操作系统沙箱。

## 发布记录

- 2026-10-26：维护者确认默认权限与披露文字，执行发布。
- 推送 `main`（快进）与 tag `v0.7.11` 到 `Celyn-number3/open_shuncode`。
- Release：<https://github.com/Celyn-number3/open_shuncode/releases/tag/v0.7.11>，资产 `ShunCode-0.7.11-win-x64.zip` 与 `.sha256`。
- `v0.7.10` 及其 `ShunCode-oss-0.7.10` 资产保持原样，未修改、未删除。
- 未改动 `D:\ShunCode`，未重启或替换当前运行中的 Bridge 程序。
