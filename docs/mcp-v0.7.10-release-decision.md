# 0.7.10 发布决策与检查清单

日期：2026-10-26
适用对象：`E:\open_shuncode` 的 `reconstruction/full-source-20261014-123446` 分支，版本 `0.7.10`。

## 建议

**暂缓发布稳定版，保持 `status: development`。**

理由不是源码重建没做完，而是「验收证据与要发布的那个提交还没有绑死」：17 个 GUI 场景的证据产生于 2026-10-14，之后代码没有再改，但清单、状态和工具改过 4 个提交，还没有在最终提交上重跑一次产品级验收。在没有重跑之前发布，等于用一个未经该提交验证的凭据对外声明。

如果只需要内部试用，可以发 `0.7.10-rc`，但 release notes 必须原文带上本文件「必须披露的限制」一节。

## 已具备的条件

| 项目 | 状态 | 证据 |
| --- | --- | --- |
| 第一方源码构建 | 完成 | 扩展 341 / Agent 50 / MCP 105 输入；24 个 desktop bundle |
| 独立产品组装 | 完成 | `artifacts/source-product-0.7.10-verified`，10,948 个文件校验 |
| 源码回归 | 通过 | 2026-10-26 复核 28/28 |
| 维护回归 | 通过 | 2026-10-26 复核 35/35 |
| 来源哈希一致性 | 通过 | `check-provenance-hashes.cjs` 报告 drift 0（6 处已知变更已记录） |
| 成果已固化 | 完成 | 4 个提交 + `backups/open_shuncode-reconstruction-20261026.bundle`（54 MB，完整历史） |
| 义务范围 | 已归类 | 954 条拆为 918 族级回归 / 22 厂商服务 / 14 无所有者静态候选 |

## 发布阻塞项

| # | 阻塞 | 现状 | 关闭方式 |
| --- | --- | --- | --- |
| 1 | GUI 验收未在最终提交上重跑 | 17 场景证据来自 2026-10-14 | 用 `tools/source-gui-integration.cjs` 在最终提交重新组装的产品上重跑，产出新的 `gui-integration.json` |
| 2 | 编辑器类型覆盖缺口 | 53 个重建文件带 `@ts-nocheck`，strict 仅覆盖扩展 | 逐模块补推导声明；或在 release notes 明确「编辑器重建模块未做严格类型验收」 |
| 3 | 厂商服务未验收 | Gitee/GitHub 授权、用量上报、许可校验、公共隧道均未真实调用 | 做一次真实链路验证，或在 release notes 披露「未覆盖」 |
| 4 | 高风险默认权限需产品确认 | 新连接默认整机 + 终端 + 自定义工具，且不自动过期 | 由维护者确认这是 0.7.10 的发布意图；README 已如实描述 |
| 5 | 954 条义务未逐条关闭 | 账本 `status: unknown`，0 条 verified | 不阻塞发布，但必须在 release notes 披露；归类见 [义务归类](mcp-obligation-triage.md) |

阻塞 1 是唯一必须动手的一项。2–5 都可以通过「如实披露」处理，前提是披露文字不被删改。

## 发布前检查清单

按顺序执行，任一步失败即停止：

- [ ] `npm ci && npm --prefix editor ci --include=optional && npm --prefix editor/build ci`
- [ ] `npm run verify:source:extension`（类型检查 + 三组件重编译 + 28 项回归）
- [ ] `npm test`（35 项维护回归）
- [ ] `npm run triage:obligations`（确认 954 条归类仍为 918/22/14）
- [ ] `node tools/source-recovery/check-provenance-hashes.cjs`（drift 必须为 0）
- [ ] `python tools/build-source-product.py --runtime "D:/ShunCode" --output "<全新目录>"`
- [ ] 在新产品上重跑 GUI 场景，核对 17/17
- [ ] 核对 `SOURCE_BUILD_RECEIPT.json` 的 `artifact_files_verified` 与 `receipt_sha256`
- [ ] `python tools/package_release.py --app <产品目录> --output <zip>`，确认 ZIP 内含 `LICENSES.chromium.html`、`resources/app/ThirdPartyNotices.txt`
- [ ] 更新 `version.json` 的 `status` 与 README 版本说明
- [ ] 打 tag、推送、创建 Release（人工执行，本仓库当前未推送）

## 必须披露的限制

以下文字建议原文进入 release notes：

> 本版本的第一方 JavaScript/TypeScript 由仓库源码编译，Electron/Chromium 与第三方原生模块复用匹配的运行时，未从源码重编译。编辑器侧有 53 个重建模块未做严格类型检查；原始 TypeScript 类型、注释与提交历史无法从产物中恢复。REA 账本中的 954 条静态候选义务未逐条验证（0 条 verified），仅按族归类。模型功能使用本地 loopback 兼容服务验收，未调用付费厂商 API；Gitee/GitHub 授权、用量上报与公共隧道服务未验收。MCP 终端权限不是操作系统沙箱。

## 本次未执行的动作

- 未推送远端、未创建 tag、未创建 GitHub Release。
- 未改动 `D:\ShunCode`，未重启或替换当前运行中的 Bridge 程序。
- 未重新组装产品、未重跑 GUI 场景（阻塞 1 仍未关闭）。
