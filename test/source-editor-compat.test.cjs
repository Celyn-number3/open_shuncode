'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const editor = path.join(root, 'editor');
const dir = path.join(root, 'artifacts', 'source-build', 'tests');
fs.mkdirSync(dir, { recursive: true });
const fixture = path.join(dir, 'editor-compat.cjs');
esbuild.buildSync({
 absWorkingDir: editor,
 stdin: {
  contents: [
   "export * from './src/vs/workbench/contrib/chat/browser/voiceClient/voiceGlow.js';",
   "export * from './src/vs/sessions/common/sessionCommands.js';",
  ].join('\n'),
  resolveDir: editor,
  sourcefile: 'source-editor-compat-test-entry.mjs',
 },
 bundle: true,
 platform: 'node',
 format: 'cjs',
 target: 'node22',
 outfile: fixture,
 logLevel: 'error',
});
const api = require(fixture);

test('editor compatibility retains shipped legacy glow behavior', () => {
 assert.equal(api.isGlowingVoiceState('idle'), false);
 assert.equal(api.isGlowingVoiceState('speaking'), true);
 assert.equal(api.readVoiceGlowIntensity(null, { value: undefined }), 0.3);
 assert.equal(api.computeVoiceGlowStyle('speaking', 0, false).borderColor, 'rgba(163,113,247,0.3)');
 assert.equal(api.computeVoiceGlowStyle('listening', 0, false).borderColor, 'rgba(88,166,255,0.3)');
});

test('retained upstream voice exports execute real theme and rim implementations', () => {
 const colors = api.resolveVoiceGlowColors({ getColor: () => undefined });
 assert.deepEqual(colors.listening.rgba, api.DEFAULT_VOICE_GLOW_COLORS.listening.rgba);
 assert.deepEqual(colors.speaking.rgba, api.DEFAULT_VOICE_GLOW_COLORS.speaking.rgba);
 assert.equal(api.voiceGlowStateColor('speaking', colors), colors.speaking);
 const rim = api.resolveVoiceRimAccent(colors.listening, 'cool', 'dark');
 assert.equal(rim.lightness, 56);
 assert.ok(rim.saturation >= 70 && rim.saturation <= 96);
 assert.ok(rim.hue >= 0 && rim.hue < 360);
 assert.equal(api.computeVoiceMicGlowBoxShadow('listening', 0, colors), '0 0 3px rgba(88,166,255,0.2)');
});

test('session command compatibility retains upstream rename and recovered archive IDs', () => {
 assert.equal(api.RENAME_SESSION_COMMAND_ID, 'sessionsViewPane.renameSession');
 assert.equal(api.ARCHIVE_SESSION_COMMAND_ID, 'sessionsViewPane.archiveSession');
 assert.equal(api.UNARCHIVE_SESSION_COMMAND_ID, 'sessionsViewPane.unarchiveSession');
});
