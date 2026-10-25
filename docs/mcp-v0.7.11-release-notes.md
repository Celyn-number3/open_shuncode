# ShunCode 0.7.11 发布说明

> 已发布：<https://github.com/Celyn-number3/open_shuncode/releases/tag/v0.7.11>（2026-10-26）。仓库为私有，访问需要授权。

## 下载与校验

| 项目 | 值 |
| --- | --- |
| 文件名 | `ShunCode-0.7.11-win-x64.zip` |
| 大小 | 598,842,980 字节（约 571 MiB） |
| SHA-256 | `e52998b486caaebd46ca90fb7bfb76b261908aa2358af8753b9c33b37e1e7630` |
| 包内文件 | 10,949 个应用文件 + 1 个 `SHUNCODE_BUILD_INFO.json` |
| 构建提交 | `b9ddfd8a`（`sourceDirty: false`） |
| 产物凭据 | `SOURCE_BUILD_RECEIPT.json`，SHA-256 `cd21f5238b0078f31a8b42adba6b00210371e59df1f7fc5c4d2ab8099e96a6fd`，10,948 个文件 |

校验：

```powershell
Get-FileHash .\ShunCode-0.7.11-win-x64.zip -Algorithm SHA256
```

或使用随包生成的 `ShunCode-0.7.11-win-x64.zip.sha256`。

## 安装

1. 解压到任意目录，运行 `start-source.cmd` 或 `ShunCode.exe`。
2. `start-source.cmd` 使用独立的 `source-user-data` 与 `source-extensions` 目录，不会读写你现有的 ShunCode 数据。
3. 仅对来源可信的项目启用工作区信任。
4. 需要远程 AI 接入时，在 Bridge 设置页启动 Bridge，把 MCP 地址交给支持 MCP 的客户端。

包内不含 `SOURCE_BUILD_RECEIPT.json` 与 `SOURCE_PRODUCT_AUDIT.json`：这两个文件记录的是构建机的绝对路径，属于本机审计材料，其哈希已写入 `SHUNCODE_BUILD_INFO.json`。

## 与 0.7.10 的差别

功能集合相同，差别在构建方式：

- **0.7.11 的第一方 JavaScript/TypeScript 全部由本仓库源码编译**，扩展、Agent、MCP 运行时与编辑器核心（24 个 desktop bundle）都来自源码。
- 0.7.10 是在预编译基线上的增量补丁构建（`ShunCode-oss-0.7.10`），仍可在 Releases 中下载。
- 0.7.11 的产物自带 `SOURCE_BUILD_INFO.json`，记录版本、源码提交、脏标记、组装时间与扩展构建哈希，下载后可独立追溯。
- 权限模型与 0.7.10 相同：新连接默认整机 + 终端 + 自定义工具，永久有效。

## 必须披露的限制

以下文字应与发布一同出现，不应删改：

> 本版本的第一方 JavaScript/TypeScript 由仓库源码编译，Electron/Chromium 与第三方原生模块复用匹配的运行时，未从源码重编译。编辑器侧有 53 个重建模块未做严格类型检查；原始 TypeScript 类型、注释与提交历史无法从产物中恢复。REA 账本中的 954 条静态候选义务未逐条验证（0 条 verified），仅按族归类。模型功能使用本地 loopback 兼容服务验收，未调用付费厂商 API；Gitee/GitHub 授权、用量上报与公共隧道服务未验收。MCP 终端权限不是操作系统沙箱。

补充事实：

- 954 条义务的归类见 [义务归类](mcp-obligation-triage.md)：918 条族级回归覆盖、22 条厂商服务、14 条无所有者静态候选。
- 编辑器侧 53 个重建文件带 `@ts-nocheck`，严格类型检查只覆盖扩展。

## 验收记录

| 项目 | 结果 |
| --- | --- |
| 源码回归 | 28/28 |
| 维护回归 | 35/35 |
| GUI / MCP 场景 | 17/17，`pageErrors: 0`，套件退出码 0 |
| 文件哈希复核 | 10,948/10,948 一致 |
| 产品完整性 | 10/10 checksum |

证据：`artifacts/source-build/validation/final-stage/gui-integration-0.7.11/`、[最终提交复验](mcp-v0.7.11-final-verification-20261026.md)。

## 已知问题

- 首次启动时工作台会探测 WSL；在受限环境里 `wsl.exe` 可能被安全策略拦截。拦截不影响编辑器与 MCP 功能，但 WSL 远程能力未在本次验收范围内。
- `SHUNCODE_BUILD_INFO.json` 的 `builtAt` 是组装时间（UTC），扩展构建时间单独记录在产物凭据中。

## 未完成事项

- 付费厂商模型 API、公共隧道服务未做真实链路验收。
- 编辑器侧 53 个重建模块的严格类型检查未完成。
- 954 条静态候选义务未逐条验证，仅按族归类。
