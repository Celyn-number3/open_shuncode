#!/usr/bin/env node
'use strict';
// Triage the REA reconstruction-obligation ledger.
// This tool does NOT close obligations. It groups the static candidates by
// family, names the regression that exercises the same behaviour class, and
// records why the remainder is not pursued individually.
//
// Usage: node tools/triage-obligations.cjs [ledger.json]

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LEDGER =
	process.argv[2] ||
	path.join(ROOT, 'artifacts/source-build/validation/rea-continuation-20261014/reconstruction-obligations-canonical.json');
const MD_OUT = path.join(ROOT, 'docs/mcp-obligation-triage.md');
const CSV_OUT = path.join(ROOT, 'docs/reconstruction-obligations-triage.csv');
const JSON_OUT = path.join(ROOT, 'docs/reconstruction-obligations-triage.json');

// Family-level triage table. `tests` are exact test names from test/*.test.cjs
// and test/*.test.js; the script fails if a referenced name no longer exists.
const FAMILIES = {
	'task-lifecycle': {
		bucket: 'family-level-regression',
		owner: 'extension / agent-host task lifecycle',
		tests: [
			'task lifecycle revisions and owner isolation',
			'permanent sessions survive arbitrary idle age but retain bounded capacity',
			'semaphore queues, releases once, and aborts waiters'
		],
		rationale: 'Lifecycle revisions, owner isolation and cancellation are exercised by named regressions; individual awaited-expression claims are not enumerated.'
	},
	'promise-ownership': {
		bucket: 'family-level-regression',
		owner: 'shared async ownership',
		tests: ['semaphore queues, releases once, and aborts waiters', 'task lifecycle revisions and owner isolation'],
		rationale: 'Promise settlement and cancellation ownership are covered at behaviour level by the queue and lifecycle regressions.'
	},
	'parser-boundary': {
		bucket: 'family-level-regression',
		owner: 'tool input validation',
		tests: ['file aliases and structured tool validation are reconstructed', 'actual source router rejects ambiguous identity-header arrays before dispatch'],
		rationale: 'String/Number/JSON coercion boundaries are covered by structured tool validation and the strict extension typecheck; not every coercion site has a dedicated case.'
	},
	event: {
		bucket: 'family-level-regression',
		owner: 'agent-host event plumbing',
		tests: ['Agent runtime handles closed input in an isolated subprocess', 'revocation aborts active custom-tool signals, not just managed terminals'],
		rationale: 'Stream close and abort propagation are covered; individual emitter claims are not enumerated.'
	},
	timer: {
		bucket: 'static-only',
		owner: 'unassigned',
		tests: [],
		rationale: 'setTimeout/setInterval sites have no owner binding and no dedicated regression; they are static candidates, not verified behaviour.'
	},
	endpoint: {
		bucket: 'family-level-regression',
		owner: 'mcp-server / bridge transport',
		tests: ['real HTTP MCP handshake, permission denial, local grant and DELETE teardown', 'MCP runtime exports are usable, not only syntactically valid'],
		rationale: 'The MCP transport endpoints are exercised over real HTTP; vendor identity and usage endpoints are split out below.'
	},
	configuration: {
		bucket: 'static-only',
		owner: 'unassigned',
		tests: [],
		rationale: 'Build-time constants and environment switches; licence-related values are split into the vendor bucket.'
	},
	'package-lifecycle': {
		bucket: 'family-level-regression',
		owner: 'release packaging',
		tests: ['packager excludes personal files, verifies CRC and refuses archive overwrite'],
		rationale: 'Package assembly and overwrite refusal are covered by the packaging regression.'
	}
};

// Titles that need a vendor or identity service and are therefore outside the
// local acceptance scope. Matching is explicit and reviewed, not inferred.
const VENDOR_TITLE = /^(?:\/v1\/(?:auth|usage)\/|SHUNCODE_BRIDGE_LICENSE_|model\.baseUrl$|content-encoding$|proxy|socks$|http$)/i;

function loadTests() {
	const names = new Set();
	for (const file of fs.readdirSync(path.join(ROOT, 'test'))) {
		if (!/\.test\.(?:c?js|mjs)$/.test(file)) continue;
		const text = fs.readFileSync(path.join(ROOT, 'test', file), 'utf8');
		for (const match of text.matchAll(/^\s*(?:test|it)\(\s*(['"])(.+?)\1/gm)) names.add(match[2]);
	}
	return names;
}

function csvCell(value) {
	const text = String(value ?? '');
	return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function main() {
	if (!fs.existsSync(LEDGER)) throw new Error('Ledger not found: ' + LEDGER);
	const ledger = JSON.parse(fs.readFileSync(LEDGER, 'utf8'));
	const normalized = ledger.value?.normalized_result ?? ledger.normalized_result;
	if (!normalized?.obligations) throw new Error('Ledger has no normalized_result.obligations');
	const obligations = normalized.obligations;

	const knownTests = loadTests();
	for (const [family, entry] of Object.entries(FAMILIES)) {
		for (const name of entry.tests) {
			if (!knownTests.has(name)) throw new Error(`Triage table references a missing test in ${family}: ${name}`);
		}
	}

	const rows = [];
	for (const item of obligations) {
		const family = item.family;
		const entry = FAMILIES[family] ?? { bucket: 'unclassified', owner: 'unassigned', tests: [], rationale: 'Family not present in the triage table.' };
		const vendor = VENDOR_TITLE.test(item.title ?? '');
		const bucket = vendor ? 'vendor-service' : entry.bucket;
		rows.push({
			obligation_id: item.obligation_id,
			family,
			application_layer: item.application_layer,
			title: item.title ?? '',
			triage_bucket: bucket,
			owner: vendor ? 'vendor identity / usage service' : entry.owner,
			evidence_regression: vendor ? 'none (requires vendor service)' : entry.tests.join(' | ') || 'none',
			required_case_kinds: (item.required_case_kinds ?? []).join('+'),
			next_evidence: (item.required_next_evidence ?? [])[0] ?? '',
			individual_verification: 'not-claimed'
		});
	}

	const byBucket = {};
	const byFamily = {};
	for (const row of rows) {
		byBucket[row.triage_bucket] = (byBucket[row.triage_bucket] || 0) + 1;
		const key = row.family;
		byFamily[key] ??= { family: key, layer: row.application_layer, total: 0, buckets: {}, tests: new Set(), owners: new Set(), rationale: '' };
		byFamily[key].total += 1;
		byFamily[key].buckets[row.triage_bucket] = (byFamily[key].buckets[row.triage_bucket] || 0) + 1;
		byFamily[key].owners.add(row.owner);
		if (!row.evidence_regression.startsWith('none')) for (const name of row.evidence_regression.split(' | ')) byFamily[key].tests.add(name);
	}
	for (const [family, entry] of Object.entries(FAMILIES)) if (byFamily[family]) byFamily[family].rationale = entry.rationale;

	fs.writeFileSync(
		CSV_OUT,
		['obligation_id,family,application_layer,title,triage_bucket,owner,evidence_regression,required_case_kinds,next_evidence,individual_verification']
			.concat(
				rows.map(row =>
					[
						row.obligation_id,
						row.family,
						row.application_layer,
						row.title,
						row.triage_bucket,
						row.owner,
						row.evidence_regression,
						row.required_case_kinds,
						row.next_evidence,
						row.individual_verification
					]
						.map(csvCell)
						.join(',')
				)
			)
			.join('\n') + '\n'
	);

	const summary = {
		schema: 1,
		generated_at: new Date().toISOString(),
		ledger_id: normalized.ledger_id,
		ledger_status: normalized.status,
		ledger_verified: normalized.summary?.verified ?? 0,
		total: rows.length,
		by_bucket: byBucket,
		by_family: Object.values(byFamily).map(f => ({
			family: f.family,
			layer: f.layer,
			total: f.total,
			buckets: f.buckets,
			owners: [...f.owners],
			evidence_regressions: [...f.tests],
			rationale: f.rationale
		})),
		closing_requirement: 'An obligation is closed only when it gains an owner binding, an original-behaviour case and a verifier with the authority recorded in the ledger. Family-level regressions do not close individual claims.'
	};
	fs.writeFileSync(JSON_OUT, JSON.stringify(summary, null, 2) + '\n');

	const lines = [];
	lines.push('# 954 条 REA 静态候选义务的归类结果');
	lines.push('');
	lines.push('> 本文件由 `node tools/triage-obligations.cjs` 生成，请勿手工编辑。逐条明细见同目录的 `reconstruction-obligations-triage.csv`，机读汇总见 `reconstruction-obligations-triage.json`。');
	lines.push('');
	lines.push('## 结论先行');
	lines.push('');
	lines.push(`账本 \`${normalized.ledger_id}\` 的状态仍是 \`${normalized.status}\`：**954 条候选义务，0 条逐条验证**。本归类不改变这个数字，只把它拆成可判断的族。`);
	lines.push('');
	lines.push('这 954 条不是 954 个缺失功能。它们的标题绝大多数是 `awaited expression`、`Promise.all`、`JSON.parse`、`String` 这类语义图节点，诊断码全部是 `static-only`，且 954 条的 `binding` 都是 `null`、状态都是 `unowned`。也就是说：**没有一条被绑定到具体实现所有者和原始行为样本**。');
	lines.push('');
	lines.push('| 归类 | 条数 | 含义 |');
	lines.push('| --- | --- | --- |');
	const bucketText = {
		'family-level-regression': '同族行为有命名回归覆盖；单条声明未验证',
		'static-only': '无所有者、无专属用例的静态候选，不逐条追',
		'vendor-service': '依赖 Gitee/GitHub/计费/许可服务，不在本地验收范围',
		unclassified: '未归类'
	};
	for (const [bucket, count] of Object.entries(byBucket).sort((a, b) => b[1] - a[1])) {
		lines.push(`| \`${bucket}\` | ${count} | ${bucketText[bucket] ?? '未定义'} |`);
	}
	lines.push('');
	lines.push('## 按族归类');
	lines.push('');
	lines.push('| 族 | 层 | 条数 | 归类 | 所有者 | 覆盖它的回归 | 判断依据 |');
	lines.push('| --- | --- | --- | --- | --- | --- | --- |');
	for (const family of summary.by_family.sort((a, b) => b.total - a.total)) {
		const buckets = Object.entries(family.buckets).map(([k, v]) => `${k} ×${v}`).join('<br>');
		const tests = family.evidence_regressions.length ? family.evidence_regressions.map(t => `\`${t}\``).join('<br>') : '—';
		lines.push(`| \`${family.family}\` | ${family.layer} | ${family.total} | ${buckets} | ${family.owners.join('<br>')} | ${tests} | ${family.rationale} |`);
	}
	lines.push('');
	lines.push('## 为什么 715 条 `awaited expression` 不逐条追');
	lines.push('');
	lines.push('这些条目来自语义图对每个 await 表达式的静态标注，要求「正向、取消、清理」三类运行时证据。逐条关闭意味着为每个 await 站点构造原始行为样本，成本远超收益，而且原始行为样本本身就不存在于产物中。当前的处理是：');
	lines.push('');
	lines.push('1. 重建模块保留原始字节范围（`provenance.json` 的 `source_ranges`），语句本身没有被改写；');
	lines.push('2. 生命周期、取消与清理按**族**由命名回归覆盖（见上表），不按条计数；');
	lines.push('3. 账本状态保持 `unknown`，不把族级覆盖折算成 954 条已验证。');
	lines.push('');
	lines.push('## 关闭一条义务需要什么');
	lines.push('');
	lines.push('按账本自身的字段，一条义务从 `unowned` 走到 `verified` 至少需要：');
	lines.push('');
	lines.push('- `binding`：唯一实现所有者，指向当前仓库中的模块与符号；');
	lines.push('- `observed_cases`：`required_case_kinds` 要求的原始行为样本（如 `positive`、`cancellation`、`teardown`）；');
	lines.push('- verifier 证据：`required_verifier_authority` 要求的权威级别，而不是单元测试自证；');
	lines.push('- 关闭后更新 `closure_digest`，并保留原账本作为对照。');
	lines.push('');
	lines.push('这四项当前一条都没有。因此本文件的作用是**缩小范围**，不是宣告完成。');
	lines.push('');
	lines.push('## 复现');
	lines.push('');
	lines.push('```bash');
	lines.push('node tools/triage-obligations.cjs');
	lines.push('```');
	lines.push('');
	lines.push('脚本会校验表中引用的每个测试名仍然存在；测试被改名或删除时直接失败，避免文档与回归脱节。');
	lines.push('');
	lines.push('## 限制');
	lines.push('');
	lines.push('- 归类是人工审阅的族级判断，不是逐条证据；`individual_verification` 一律为 `not-claimed`。');
	lines.push('- 厂商服务相关的条目只是**排除在本地验收之外**，不代表它们的行为正确。');
	lines.push('- 账本、语义图和原始证据位于忽略的 `artifacts/` 目录，未随仓库分发；分享前需审阅其中的源码与字符串。');
	lines.push('');
	fs.writeFileSync(MD_OUT, lines.join('\n'));

	console.log(
		'TRIAGE_OK ' +
			JSON.stringify({
				total: rows.length,
				by_bucket: byBucket,
				families: summary.by_family.length,
				markdown: path.relative(ROOT, MD_OUT).replaceAll('\\', '/'),
				csv: path.relative(ROOT, CSV_OUT).replaceAll('\\', '/')
			})
	);
}

main();
