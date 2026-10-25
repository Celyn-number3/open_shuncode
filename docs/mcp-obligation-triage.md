# 954 条 REA 静态候选义务的归类结果

> 本文件由 `node tools/triage-obligations.cjs` 生成，请勿手工编辑。逐条明细见同目录的 `reconstruction-obligations-triage.csv`，机读汇总见 `reconstruction-obligations-triage.json`。

## 结论先行

账本 `rol_6fb0d4f840ebc77fa321776f4eedeb94223020eb5a96df8dae434d6877083597` 的状态仍是 `unknown`：**954 条候选义务，0 条逐条验证**。本归类不改变这个数字，只把它拆成可判断的族。

这 954 条不是 954 个缺失功能。它们的标题绝大多数是 `awaited expression`、`Promise.all`、`JSON.parse`、`String` 这类语义图节点，诊断码全部是 `static-only`，且 954 条的 `binding` 都是 `null`、状态都是 `unowned`。也就是说：**没有一条被绑定到具体实现所有者和原始行为样本**。

| 归类 | 条数 | 含义 |
| --- | --- | --- |
| `family-level-regression` | 918 | 同族行为有命名回归覆盖；单条声明未验证 |
| `vendor-service` | 22 | 依赖 Gitee/GitHub/计费/许可服务，不在本地验收范围 |
| `static-only` | 14 | 无所有者、无专属用例的静态候选，不逐条追 |

## 按族归类

| 族 | 层 | 条数 | 归类 | 所有者 | 覆盖它的回归 | 判断依据 |
| --- | --- | --- | --- | --- | --- | --- |
| `task-lifecycle` | runtime | 715 | family-level-regression ×715 | extension / agent-host task lifecycle | `task lifecycle revisions and owner isolation`<br>`permanent sessions survive arbitrary idle age but retain bounded capacity`<br>`semaphore queues, releases once, and aborts waiters` | Lifecycle revisions, owner isolation and cancellation are exercised by named regressions; individual awaited-expression claims are not enumerated. |
| `promise-ownership` | runtime | 88 | family-level-regression ×88 | shared async ownership | `semaphore queues, releases once, and aborts waiters`<br>`task lifecycle revisions and owner isolation` | Promise settlement and cancellation ownership are covered at behaviour level by the queue and lifecycle regressions. |
| `parser-boundary` | application | 67 | family-level-regression ×67 | tool input validation | `file aliases and structured tool validation are reconstructed`<br>`actual source router rejects ambiguous identity-header arrays before dispatch` | String/Number/JSON coercion boundaries are covered by structured tool validation and the strict extension typecheck; not every coercion site has a dedicated case. |
| `endpoint` | protocol | 44 | family-level-regression ×28<br>vendor-service ×16 | mcp-server / bridge transport<br>vendor identity / usage service | `real HTTP MCP handshake, permission denial, local grant and DELETE teardown`<br>`MCP runtime exports are usable, not only syntactically valid` | The MCP transport endpoints are exercised over real HTTP; vendor identity and usage endpoints are split out below. |
| `event` | runtime | 19 | family-level-regression ×19 | agent-host event plumbing | `Agent runtime handles closed input in an isolated subprocess`<br>`revocation aborts active custom-tool signals, not just managed terminals` | Stream close and abort propagation are covered; individual emitter claims are not enumerated. |
| `timer` | runtime | 12 | static-only ×12 | unassigned | — | setTimeout/setInterval sites have no owner binding and no dedicated regression; they are static candidates, not verified behaviour. |
| `configuration` | cli | 8 | vendor-service ×6<br>static-only ×2 | vendor identity / usage service<br>unassigned | — | Build-time constants and environment switches; licence-related values are split into the vendor bucket. |
| `package-lifecycle` | packaging | 1 | family-level-regression ×1 | release packaging | `packager excludes personal files, verifies CRC and refuses archive overwrite` | Package assembly and overwrite refusal are covered by the packaging regression. |

## 为什么 715 条 `awaited expression` 不逐条追

这些条目来自语义图对每个 await 表达式的静态标注，要求「正向、取消、清理」三类运行时证据。逐条关闭意味着为每个 await 站点构造原始行为样本，成本远超收益，而且原始行为样本本身就不存在于产物中。当前的处理是：

1. 重建模块保留原始字节范围（`provenance.json` 的 `source_ranges`），语句本身没有被改写；
2. 生命周期、取消与清理按**族**由命名回归覆盖（见上表），不按条计数；
3. 账本状态保持 `unknown`，不把族级覆盖折算成 954 条已验证。

## 关闭一条义务需要什么

按账本自身的字段，一条义务从 `unowned` 走到 `verified` 至少需要：

- `binding`：唯一实现所有者，指向当前仓库中的模块与符号；
- `observed_cases`：`required_case_kinds` 要求的原始行为样本（如 `positive`、`cancellation`、`teardown`）；
- verifier 证据：`required_verifier_authority` 要求的权威级别，而不是单元测试自证；
- 关闭后更新 `closure_digest`，并保留原账本作为对照。

这四项当前一条都没有。因此本文件的作用是**缩小范围**，不是宣告完成。

## 复现

```bash
node tools/triage-obligations.cjs
```

脚本会校验表中引用的每个测试名仍然存在；测试被改名或删除时直接失败，避免文档与回归脱节。

## 限制

- 归类是人工审阅的族级判断，不是逐条证据；`individual_verification` 一律为 `not-claimed`。
- 厂商服务相关的条目只是**排除在本地验收之外**，不代表它们的行为正确。
- 账本、语义图和原始证据位于忽略的 `artifacts/` 目录，未随仓库分发；分享前需审阅其中的源码与字符串。
