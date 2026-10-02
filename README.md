<div align="center">

<img src="extension/media/shuncode.svg" width="96" alt="ShunCode logo" />

# ShunCode · 开源版

**让任何网页端 AI 直接操作你的本地项目。**

基于 Code-OSS（VS Code）的 AI 编程编辑器，内置远程 MCP Bridge、原生 Agent、多模型协作 —— 全部免费、无需登录、无需激活。

[下载 Windows 版](https://github.com/HP-Patience/open_shuncode/releases/latest) ·
[功能](#-功能) ·
[快速开始](#-快速开始) ·
[首次使用](#-首次使用必看) ·
[开源版改动](docs/OPEN_SOURCE_CHANGES.md) ·
[English](#english)

![platform](https://img.shields.io/badge/platform-Windows%20x64-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![base](https://img.shields.io/badge/base-Code--OSS%201.132-007ACC)
![MCP](https://img.shields.io/badge/MCP-Streamable%20HTTP-purple)

</div>

---

## 💡 它解决什么问题？

ChatGPT、Claude、Gemini、Arena、Manus、Devin 这些网页端 AI 很聪明，但**碰不到你电脑上的代码**。
ShunCode 在本地编辑器里启动一个 **MCP Bridge**，通过 Cloudflare Tunnel 生成一个公网 MCP 地址 ——
把地址丢给任意支持 MCP 的网页 AI，它就能像本地 Agent 一样：

> 浏览目录 → 语义搜索代码 → 读文件 → 打补丁 → 看诊断 → 跑构建和测试 → 汇报进度

你**不用在本地配置 API Key**，用你已有的网页 AI 会员/免费额度就能干活；所有操作在编辑器里实时可见。

## ✨ 功能

### 🌉 远程 MCP Bridge
- **Streamable HTTP MCP 端点**，兼容主流 MCP 客户端与网页 AI
- **三种隧道**：Cloudflare Quick Tunnel（零配置，已内置 cloudflared）/ Cloudflare Named Tunnel（固定域名）/ ngrok
- **15 个 IDE 工具**：`list_directory` `find_files` `search_files` `read_files` `read_image` `apply_patch` `lsp` `get_diagnostics` `run_command` `get_command_output` `send_command_input` `cancel_command` `set_todos` `update_plan` `report_progress` 等
- **真实 PTY 终端**（ConPTY + 内置 Git Bash），支持后台命令、交互输入、安全取消
- **LSP 语义导航**：定义、引用、实现、符号、悬停类型
- **自适应并发**：默认 16 路并行，健康时自动扩到 64
- **任务卡片**：远程 Agent 的 todo / 进度实时显示在编辑器里
- **Agent Skills**：`.shuncode/skills` 与 `.shuncode/mcp-tools` 自定义工具自动暴露给远程 Agent
- 一键轮换端点、健康检查、工具调用日志、快捷打开常用网页 AI

### 🤖 原生 Chat / Agent
- **Ask / Plan / Code** 三种模式
- 支持 **OpenAI Chat Completions / OpenAI Responses / Anthropic Messages** 协议，自动拉取 `/models`
- 默认适配 DeepSeek，支持思考强度设置；也可用 Codex 账号登录
- **多模型分支 + 合并**：同一问题让多个模型并行回答，合并模型对比共识与分歧、必要时只读核验文件后给出最终方案
- Agent 检查点、全实例共享聊天记录、一键新开独立实例

## 🚀 快速开始

1. 到 [Releases](https://github.com/HP-Patience/open_shuncode/releases/latest) 下载 `ShunCode-oss-*-win-x64.zip` 并解压
2. 双击 `shuncode_start.bat`（或 `ShunCode.exe`）
3. 打开 Bridge 设置页，点击 **启动 Bridge**
4. 点击 **复制提示词**，粘贴给任意支持 MCP 的网页 AI，例如：

   ```text
   https://xxxx.trycloudflare.com/mcp/<token>
   快速连接这个 MCP，明确使用规则，熟悉可用工具，做好处理接下来一系列工作的准备。
   ```

5. 想用内置 Chat：命令面板运行 `ShunCode: Configure Model` 和 `ShunCode: Set API Key`

> **推荐的仓库打开方式（可选）**：克隆仓库后可直接运行根目录的 `shuncode_start.bat`，它会启动 ShunCode 并打开当前仓库，使用发行包自带扩展；脚本优先查找 PATH 中的 `shuncode`，也可设置 `SHUNCODE_EXE` 指向发行包内的 `ShunCode.exe`。也可以直接启动发行包内的 `ShunCode.exe`（或发行包自带的 `shuncode_start.bat`），再通过“文件 → 打开文件夹”打开本仓库；以上方式均不需要 `--extensionDevelopmentPath`。

> 若已安装兼容的 ShunCode，也可在克隆后的仓库根目录用 PowerShell 执行 `shuncode --new-window --user-data-dir "$env:LOCALAPPDATA\ShunCode-OpenSource-Dev" --extensionDevelopmentPath "$PWD\extension" "$PWD"`，以独立配置的扩展开发模式加载本仓库的预打包扩展（需将 `shuncode` 加入 PATH，或改用安装目录下 `bin\shuncode.cmd` 的完整路径）。

## 🧩 首次使用（必看）

第一次运行时 Windows 和编辑器会各弹一次提示，按下面操作即可：

1. **Windows SmartScreen 拦截**：弹出“Windows 已保护你的电脑”时，点击 **更多信息 → 仍要运行**。
   这是因为 ShunCode 暂未购买代码签名证书，并非病毒；你也可以在 [Releases](https://github.com/HP-Patience/open_shuncode/releases/latest) 核对文件后再运行。
2. **信任文件夹**：用 ShunCode 打开项目文件夹时，会询问“是否信任此文件夹中的文件的作者?”，请点击 **是，我信任此作者**（英文界面为 *Yes, I trust the authors*）。
   如果选了“否”，编辑器会进入**受限模式**，ShunCode 的 Chat 与 Bridge 都会被禁用；之后可点击左下角/标题栏的“受限模式”，或在命令面板运行 `Workspaces: Manage Workspace Trust` 改为信任。

> Bridge 所需的 `cloudflared` 已随程序内置（`resources/app/extensions/shuncode/runtime/bin/cloudflared.exe`），**无需另外安装**。

## ⚙️ 常用设置

| 设置项 | 说明 | 默认 |
|---|---|---|
| `shuncode.bridge.tunnelProvider` | 隧道类型：`cloudflare` / `cloudflare-named` / `ngrok` | `cloudflare` |
| `shuncode.bridge.workspaceScope` | 远程 Agent 作用范围：`workspace`（仅项目）/ `device`（整台电脑） | `device` |
| `shuncode.bridge.persistentMode` | 随 ShunCode 启动自动开启 Bridge | `false` |
| `shuncode.bridge.toolConcurrency` | 初始工具并发数（1–64） | `16` |
| `shuncode.bridge.skillsEnabled` | 从 `.shuncode/skills` 加载自定义工具 | `true` |
| `shuncode.multiModel.enabled` | 多模型分支与合并 | `true` |
| `shuncode.multiModel.maxBranches` | 每轮最多分支数（2–6） | `3` |

## 🔒 安全须知

Bridge 能**编辑文件和执行终端命令**。MCP 地址（含随机 token）等同于你电脑的操作权限：

- 不要把地址公开或发到群里；怀疑泄露时使用 **Rotate Bridge Endpoint** 立即换新地址
- 只处理项目时，建议把 `shuncode.bridge.workspaceScope` 设为 `workspace`
- 不用时停止 Bridge

## 📁 仓库结构

```text
extension/
├── src/                 # ShunCode 扩展 TypeScript 源码（Bridge、IDE 工具、模型接入、Chat…）
├── dist/extension.js    # 扩展实际运行的打包产物
├── runtime/             # Agent Host 与 MCP Server 运行时（打包产物）
├── agents/              # Ask / Plan / Code 模式提示词
├── media/               # 图标与 Workspace Hub 页面
└── package.json         # 扩展清单（命令、设置项、模型提供方）
docs/
└── OPEN_SOURCE_CHANGES.md   # 开源版相对商业版的全部改动
```

完整可运行程序（Electron + Code-OSS 工作台 + 内置 Git / ripgrep / cloudflared，约 1.1 GB）通过 **Releases** 分发。

## 🧭 路线图 / 已知限制

- [ ] 补齐扩展依赖的共享模块（`../../../src/*`）与 `runtime/*.js` 源码，实现从源码完整构建
- [ ] 开源工作台 UI 定制部分的源码
- [ ] macOS / Linux 构建
- [ ] 英文界面与文档完善

目前 `src/` 暂不能独立编译；修改运行逻辑请以 `dist/extension.js` 为准，`src/` 同步作为可读参考。欢迎 Issue 和 PR！

## 🤝 参与贡献

- 🐛 Bug / 建议：[Issues](https://github.com/HP-Patience/open_shuncode/issues)
- 🔧 PR：请描述改动动机，并同时更新 `src/` 与 `dist/extension.js` 中对应逻辑
- ⭐ 如果 ShunCode 对你有帮助，点个 Star 就是最大的支持

## 📄 许可证

- ShunCode 自有代码：[MIT](LICENSE)
- Code-OSS / VS Code：MIT（Microsoft），见发布包 `resources/app/LICENSE.txt` 与 `ThirdPartyNotices.txt`
- 内置 [Git for Windows](https://gitforwindows.org/)：GPLv2（源码见其官方仓库）；[cloudflared](https://github.com/cloudflare/cloudflared)：Apache-2.0（官方签名版本，许可证见 `runtime/bin/cloudflared-LICENSE.txt`）；PSReadLine：BSD-2-Clause；ripgrep：MIT / Unlicense

ShunCode 与 Microsoft、OpenAI、Anthropic、Cloudflare 等公司无隶属关系，相关名称归其各自所有者。

---

## English

**ShunCode (open-source edition)** is a Code-OSS based AI coding editor for Windows. Its **MCP Bridge** exposes your local workspace as a Streamable HTTP MCP endpoint through a Cloudflare Tunnel (or ngrok), so any web AI agent — ChatGPT, Claude, Gemini, Arena, Manus, Devin… — can browse, search, read, patch, diagnose, build and test your local project, with live task/progress cards in the editor.

It also ships a native Ask / Plan / Code agent that works with OpenAI-compatible, OpenAI Responses and Anthropic Messages APIs, plus multi-model branching & merge.

This edition removes all account, license, activation and payment code — everything is free and works offline from any licensing server. Download the ready-to-run build from [Releases](https://github.com/HP-Patience/open_shuncode/releases/latest), run `shuncode_start.bat`, start the Bridge and paste the MCP URL into your AI. `cloudflared` is bundled — no separate install needed.

**First run:** if Windows SmartScreen appears, click **More info → Run anyway** (the app is not code-signed yet). When opening a folder, choose **Yes, I trust the authors** — in Restricted Mode the ShunCode Chat and Bridge are disabled.

⚠️ The MCP URL grants file-edit and shell access to your machine — keep it private.
