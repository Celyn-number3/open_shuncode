# 开源版改动说明

本开源版基于 ShunCode 0.7.6 发布版制作。以下路径均相对于 Release 压缩包解压后的根目录；仓库中的 `extension/` 对应 `resources/app/extensions/shuncode/`。

## 移除：账号 / 许可证 / 激活码 / 支付

扩展 `resources/app/extensions/shuncode`：

- 删除 `src/bridge-license-service.ts`、`src/bridge-license-config.ts`、`src/bridge-license-claims.js`、`src/bridge-license-claims.d.ts`、`src/bridge-payment-network.mts`
  （含授权服务器地址、签名公钥、Gitee OAuth client id、GitHub/Gitee 登录、许可证续期、用量上报、支付下单与轮询）。
- `src/bridge-access-controller.ts` 重写为本地“始终可用”的访问控制器，不做任何网络请求；保留 `shuncode.bridge.access.getStatus` 以兼容设置页。
- `src/extension.ts`：移除许可证服务、开发模式绕过开关（`SHUNCODE_BRIDGE_LICENSE_SMOKE_BYPASS`）以及
  `shuncode.bridge.license.*`（signIn / signInWithGitee / refresh / refreshSession / signOut / redeem）和
  `shuncode.bridge.payment.*`（getPlans / createOrder / getOrder）命令；Bridge 启动不再需要授权。
- `src/extension-host-proxy.mts`：移除仅用于支付下单的 `fetchPaymentOrderOnce`。
- `package.json`：移除上述命令的贡献点与激活事件；`tsconfig.json` 移除已删除文件。
- `dist/extension.js`（实际运行的打包产物）：做了与上面等价的修改，并通过 `node --check` 语法校验。

工作台 `resources/app/out/vs/workbench/workbench.desktop.main.js`：

- 隐藏 Bridge 设置页中的“账号与访问”卡片（登录、许可证、购买、激活码）。
- 启动 Bridge、开启“随 ShunCode 启动”不再检查许可证。
- 同步更新 `resources/app/product.json` 中该文件的校验和，避免“安装已损坏”提示。
  （卡片相关的界面代码仍在编译产物中，但不会显示也不会被调用。）

## 其他

- `shuncode_start.bat`：去掉授权绕过环境变量和指向原安装目录的绝对路径，改为相对路径启动。
- 删除原安装程序遗留的 `unins000.exe` / `unins000.dat`（避免误运行卸载掉原安装）。
- 新增 `README.md`、`LICENSE`、本文件。
- `product.json` 的问题反馈地址改为本仓库 Issues；扩展 `package.json` 增加 `license` / `repository` / `bugs` / `homepage`。

## 验证

- 两个修改过的 JS 产物均通过 `node --check`。
- 以独立用户目录启动开源版：ShunCode 扩展正常激活（Chat 参与者、模型提供方、Bridge、IDE 工具均已注册），无许可证相关报错。
- 未实际启动公网隧道做端到端测试，建议发布前手动点一次“启动 Bridge”确认。
