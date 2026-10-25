#!/usr/bin/env node
'use strict';
// Verify that every module recorded in editor/SHUNCODE_RECONSTRUCTION.json still
// has the hash that was recorded when it was ported.
//
// Drift is not automatically corruption: a documented follow-up patch changes the
// file after the port step. This tool separates "known, documented change" from
// "unexplained drift" and refreshes the record only when the change is known.
//
// Usage:
//   node tools/source-recovery/check-provenance-hashes.cjs           # check only
//   node tools/source-recovery/check-provenance-hashes.cjs --apply   # refresh known drift

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '../..');
const MANIFEST = path.join(ROOT, 'editor/SHUNCODE_RECONSTRUCTION.json');
const APPLY = process.argv.includes('--apply');

// Documented post-port changes. Each entry must point at the record that
// explains it; an unexplained mismatch is reported and never rewritten.
const KNOWN_CHANGES = {
	'src/vs/workbench/contrib/chat/browser/voiceClient/voiceGlow.ts':
		'Retained upstream glow exports are re-exported through voiceGlowTheme.ts so the shipped legacy glow behaviour keeps executing (docs/mcp-source-recovery-resume.md).',
	'src/vs/sessions/common/sessionCommands.ts':
		'Restored upstream RENAME_SESSION_COMMAND_ID alongside the recovered archive/unarchive command ids (docs/mcp-source-recovery-resume.md).',
	'src/vs/workbench/workbench.desktop.main.ts':
		'Entry point prepends imports for reconstructed contribution modules during the port step (reconstructed-contribution-wiring).',
	'src/vs/sessions/sessions.desktop.main.ts':
		'Entry point prepends imports for reconstructed contribution modules during the port step (reconstructed-contribution-wiring).',
	'src/vs/workbench/contrib/chat/browser/widget/chatWidget.ts':
		'ChatPetWidget is constructed with input-content, focus and content-change observables so the pet reflects input state; the pre-change copy is kept as chatWidget-before-pet-api.ts.',
	'src/vs/workbench/contrib/chat/browser/chat.shared.contribution.ts':
		'Re-added the pinned upstream AI customization workspace service, harness service, management contribution and items model registrations, resolving UNKNOWN service and command-not-found during GUI acceptance (docs/mcp-next-stage-completed.md).'
};

const sha256 = buffer => crypto.createHash('sha256').update(buffer).digest('hex');

function main() {
	const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
	const drift = [];
	const missing = [];

	for (const module of manifest.modules) {
		if (!module.output_sha256) continue;
		const file = path.join(ROOT, 'editor', module.module);
		if (!fs.existsSync(file)) {
			missing.push(module.module);
			continue;
		}
		const current = sha256(fs.readFileSync(file));
		if (current !== module.output_sha256) drift.push({ module, current });
	}

	const known = drift.filter(entry => KNOWN_CHANGES[entry.module.module]);
	const unexplained = drift.filter(entry => !KNOWN_CHANGES[entry.module.module]);

	for (const entry of known) console.log(`KNOWN_DRIFT ${entry.module.module}`);
	for (const entry of unexplained) console.log(`UNEXPLAINED_DRIFT ${entry.module.module}`);
	for (const module of missing) console.log(`MISSING_FILE ${module}`);

	if (APPLY) {
		if (unexplained.length) {
			console.error('Refusing to apply: unexplained drift must be reviewed first.');
			process.exitCode = 2;
			return;
		}
		for (const entry of known) {
			entry.module.output_sha256 = entry.current;
			const note = KNOWN_CHANGES[entry.module.module];
			entry.module.reconstruction_deltas = [...new Set([...(entry.module.reconstruction_deltas ?? []), note])];
		}
		fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
		console.log(`APPLIED ${known.length} hash refresh(es)`);
	}

	const result = { modules: manifest.modules.length, drift: drift.length, known: known.length, unexplained: unexplained.length, missing: missing.length, applied: APPLY && !unexplained.length };
	console.log('PROVENANCE ' + JSON.stringify(result));
	if (missing.length) process.exitCode = 1;
	if (!APPLY && drift.length) process.exitCode = 1;
}

main();
