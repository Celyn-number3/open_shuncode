# 0.7.10 发布决策与检查清单

日期：2026-10-26
适用对象：`E:\open_shuncode` 的 `reconstruction/full-source-20261014-123446` 分支，版本 `0.7.10`。

## 建议

**阻塞 1 已于 2026-10-26 关闭，发布包已在本机备好，等待人工确认后发布。**

在提交 `b8db5585` 上重新组装的产品通过了 17/17 个 GUI 场景，10,948 个文件逐个哈希复核一致，完整性 10/10，退出码 0；发布 ZIP 已生成并校验，见 [发布说明](mcp-v0.7.10-release-notes.md)。

发布前仍有两件事需要人来做，不是技术问题：

1. 确认「新连接默认整机 + 终端 + 自定义工具且永久有效」是 0.7.10 想发布的默认行为。
2. 确认 release notes 原文带上「必须披露的限制」一节，不删改。

如果这两条不成立，就仍按 `0.7.10-rc` 或继续 `development` 处理。

## 已具备的条件

| 项目 | 状态 | 证据 |
| --- | --- | --- |
| 第一方源码构建 | 完成 | 扩展 341 / Agent 50 / MCP 105 输入；24 个 desktop bundle |
| 独立产品组装 | 完成 | `artifacts/source-product-0.7.10-20261026d`，10,948 个文件逐个复核 |
| 发布包 | 已生成 | `ShunCode-0.7.10-win-x64.zip`，571 MiB，SHA-256 `5fc97663…c83d` |
| 源码回归 | 通过 | 2026-10-26 复核 28/28 |
| 维护回归 | 通过 | 2026-10-26 复核 35/35 |
| GUI 场景（最终提交） | 通过 | 2026-10-26，17/17，`pageErrors: 0`，退出码 0 |
| 来源哈希一致性 | 通过 | `check-provenance-hashes.cjs` 报告 drift 0（6 处已知变更已记录） |
| 成果已固化 | 完成 | 重建成果已提交（`d3bc75b0` 起）+ `backups/open_shuncode-reconstruction-20261026.bundle`（54 MB，完整历史） |
| 义务范围 | 已归类 | 954 条拆为 918 族级回归 / 22 厂商服务 / 14 无所有者静态候选 |

## 发布阻塞项

| # | 阻塞 | 现状 | 关闭方式 |
| --- | --- | --- | --- |
| 1 | ~~GUI 验收未在最终提交上重跑~~ | **已关闭**：2026-10-26 在 `b8db5585` 上重跑 17/17 | 见 [发布说明](mcp-v0.7.10-release-notes.md) |
| 2 | 编辑器类型覆盖缺口 | 53 个重建文件带 `@ts-nocheck`，strict 仅覆盖扩展 | 逐模块补推导声明；或在 release notes 明确「编辑器重建模块未做严格类型验收」 |
| 3 | 厂商服务未验收 | Gitee/GitHub 授权、用量上报、许可校验、公共隧道均未真实调用 | 做一次真实链路验证，或在 release notes 披露「未覆盖」 |
| 4 | 高风险默认权限需产品确认 | 新连接默认整机 + 终端 + 自定义工具，且不自动过期 | 由维护者确认这是 0.7.10 的发布意图；README 已如实描述 |
| 5 | 954 条义务未逐条关闭 | 账本 `status: unknown`，0 条 verified | 不阻塞发布，但必须在 release notes 披露；归类见 [义务归类](mcp-obligation-triage.md) |

阻塞 2–5 都可以通过「如实披露」处理，前提是披露文字不被删改。真正需要动手的只剩维护者对默认权限的确认。

## 发布前检查清单

按顺序执行，任一步失败即停止。前 9 项已于 2026-10-26 在 `b8db5585` 上执行通过：

- [x] `npm ci && npm --prefix editor ci --include=optional && npm --prefix editor/build ci`
- [x] `npm run verify:source:extension`（类型检查 + 三组件重编译 + 28 项回归）
- [x] `npm test`（35 项维护回归）
- [x] `npm run triage:obligations`（确认 954 条归类仍为 918/22/14）
- [x] `node tools/source-recovery/check-provenance-hashes.cjs`（drift 必须为 0）
- [x] `python tools/build-source-product.py --runtime "D:/ShunCode" --output "<全新目录>"`
- [x] 在新产品上重跑 GUI 场景，核对 17/17
- [x] 核对 `SOURCE_BUILD_RECEIPT.json` 与 `SOURCE_BUILD_INFO.json`（10,948 文件，`sourceDirty: false`）
- [x] `python tools/package_release.py --app <产品目录> --output <zip>`，ZIP 内含 `LICENSES.chromium.html`、`resources/app/ThirdPartyNotices.txt`，CRC 校验通过
- [ ] 更新 `version.json` 的 `status` 与 README 版本说明
- [ ] 打 tag、推送、创建 Release（人工执行，本仓库当前未推送）

## 必须披露的限制

以下文字建议原文进入 release notes：

> 本版本的第一方 JavaScript/TypeScript 由仓库源码编译，Electron/Chromium 与第三方原生模块复用匹配的运行时，未从源码重编译。编辑器侧有 53 个重建模块未做严格类型检查；原始 TypeScript 类型、注释与提交历史无法从产物中恢复。REA 账本中的 954 条静态候选义务未逐条验证（0 条 verified），仅按族归类。模型功能使用本地 loopback 兼容服务验收，未调用付费厂商 API；Gitee/GitHub 授权、用量上报与公共隧道服务未验收。MCP 终端权限不是操作系统沙箱。

## 本次未执行的动作

- 未推送远端、未创建 tag、未创建 GitHub Release。
- 未改动 `D:\ShunCode`，未重启或替换当前运行中的 Bridge 程序。

清单中的 1–8 项已于 2026-10-26 在提交 `8341e318` 上执行并通过（见 [最终提交复验](mcp-v0.7.10-final-verification-20261026.md)）；打包、改版本号、打 tag 与发布仍未执行。
