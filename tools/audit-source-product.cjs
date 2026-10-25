#!/usr/bin/env node
'use strict';
// Independently re-verify an assembled source product against its own receipt,
// then fold in the GUI acceptance result. The receipt is written by the build;
// this tool does not trust it and recomputes every hash.
//
// Usage:
//   node tools/audit-source-product.cjs --product <dir> [--gui <gui-integration.json>]

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const argOf = name => {
	const i = process.argv.indexOf(name);
	return i >= 0 ? process.argv[i + 1] : undefined;
};

const productArg = argOf('--product');
if (!productArg) {
	console.error('Usage: node tools/audit-source-product.cjs --product <dir> [--gui <gui-integration.json>]');
	process.exit(2);
}
const product = path.resolve(productArg);
const receiptPath = path.join(product, 'SOURCE_BUILD_RECEIPT.json');
if (!fs.existsSync(receiptPath)) throw new Error('Missing receipt: ' + receiptPath);
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));

const sha256File = file =>
	new Promise((resolve, reject) => {
		const hash = crypto.createHash('sha256');
		fs.createReadStream(file)
			.on('data', chunk => hash.update(chunk))
			.on('error', reject)
			.on('end', () => resolve(hash.digest('hex')));
	});

(async () => {
	let verified = 0;
	const missing = [];
	const mismatched = [];
	for (const entry of receipt.files ?? []) {
		const file = path.join(product, entry.path);
		if (!fs.existsSync(file)) {
			missing.push(entry.path);
			continue;
		}
		const actual = await sha256File(file);
		if (actual === entry.sha256) verified += 1;
		else mismatched.push({ path: entry.path, expected: entry.sha256, actual });
	}

	const appRoot = path.join(product, 'resources/app');
	const productJson = JSON.parse(fs.readFileSync(path.join(appRoot, 'product.json'), 'utf8'));
	const integrity = [];
	for (const [relative, expected] of Object.entries(productJson.checksums ?? {})) {
		const file = path.join(appRoot, 'out', relative);
		if (!fs.existsSync(file)) {
			integrity.push({ path: relative, ok: false, reason: 'missing' });
			continue;
		}
		const digest = await sha256File(file);
		const encoded = Buffer.from(digest, 'hex').toString('base64').replace(/=+$/, '');
		integrity.push({ path: relative, ok: encoded === expected });
	}

	const guiPath = argOf('--gui');
	let gui = null;
	if (guiPath && fs.existsSync(guiPath)) {
		const report = JSON.parse(fs.readFileSync(guiPath, 'utf8'));
		const steps = report.steps ?? [];
		gui = {
			report: path.relative(product, path.resolve(guiPath)).replaceAll('\\', '/'),
			status: report.status,
			steps: steps.length,
			passed: steps.filter(s => s.pass).length,
			failed: steps.filter(s => !s.pass).map(s => s.name),
			page_errors: (report.pageErrors ?? []).length,
			model_service: report.modelService,
			product: report.product
		};
	}

	const audit = {
		schema: 1,
		audited_at: new Date().toISOString(),
		product,
		receipt_created_at: receipt.created_at,
		receipt_self_verified: missing.length === 0 && mismatched.length === 0,
		files_listed: (receipt.files ?? []).length,
		files_verified: verified,
		files_missing: missing,
		files_mismatched: mismatched,
		integrity_entries: integrity.length,
		integrity_passed: integrity.filter(x => x.ok).length,
		integrity_failed: integrity.filter(x => !x.ok),
		source_build_executed: receipt.source_build_executed,
		old_first_party_bundle_inputs: receipt.old_first_party_bundle_inputs,
		gui
	};
	const out = path.join(product, 'SOURCE_PRODUCT_AUDIT.json');
	fs.writeFileSync(out, JSON.stringify(audit, null, 2) + '\n');

	console.log(
		'PRODUCT_AUDIT ' +
			JSON.stringify({
				files: audit.files_listed,
				verified: audit.files_verified,
				missing: missing.length,
				mismatched: mismatched.length,
				integrity: audit.integrity_passed + '/' + audit.integrity_entries,
				gui: gui ? gui.passed + '/' + gui.steps : 'not-provided',
				output: path.basename(out)
			})
	);
	if (missing.length || mismatched.length || audit.integrity_failed.length) process.exitCode = 1;
	if (gui && (gui.status !== 'complete' || gui.failed.length)) process.exitCode = 1;
})().catch(error => {
	console.error(error.stack || error.message);
	process.exitCode = 1;
});
