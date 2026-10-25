// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
// src/vs/workbench/contrib/chat/browser/voiceClient/voiceGlow.ts
function isGlowingVoiceState(voiceState) {
  return voiceState === "listening" || voiceState === "speaking";
}
function readVoiceGlowIntensity(analyser, dataArray) {
  if (!analyser) {
    return 0.3;
  }
  if (!dataArray.value || dataArray.value.length !== analyser.frequencyBinCount) {
    dataArray.value = new Uint8Array(analyser.frequencyBinCount);
  }
  analyser.getByteFrequencyData(dataArray.value);
  let sum2 = 0;
  for (let i2 = 0; i2 < dataArray.value.length; i2++) {
    sum2 += dataArray.value[i2];
  }
  return Math.min(1, sum2 / dataArray.value.length / 80);
}
function computeVoiceGlowStyle(voiceState, intensity, transcriptHidden) {
  const rgb = voiceState === "speaking" ? "163,113,247" : "88,166,255";
  const flashy = voiceState === "listening" && transcriptHidden;
  let borderAlpha;
  let shadowSpread;
  let shadowAlpha;
  if (flashy) {
    borderAlpha = 0.4 + intensity * 0.3;
    shadowSpread = 4 + intensity * 10;
    shadowAlpha = 0.15 + intensity * 0.3;
  } else {
    borderAlpha = 0.3 + intensity * 0.3;
    shadowSpread = 3 + intensity * 6;
    shadowAlpha = 0.1 + intensity * 0.2;
  }
  const borderColor = `rgba(${rgb},${borderAlpha})`;
  const boxShadow = `0 0 ${shadowSpread}px rgba(${rgb},${shadowAlpha}), inset 0 0 ${shadowSpread * 0.4}px rgba(${rgb},${shadowAlpha * 0.3})`;
  return {
    borderColor,
    boxShadow
  };
}

// src/vs/workbench/contrib/chat/browser/speechToText/dictationMicGlow.ts
export { isGlowingVoiceState, readVoiceGlowIntensity, computeVoiceGlowStyle };

// Preserve the recovered legacy glow while retaining APIs required by the pinned
// upstream callers. Implementations and types are maintained in a separate module.
export {
	DEFAULT_VOICE_GLOW_COLORS,
	VOICE_GLOW_SPEAKING_HUE_SHIFT,
	resolveVoiceGlowColors,
	voiceGlowStateColor,
	resolveVoiceRimAccent,
	computeVoiceMicGlowBoxShadow,
} from './voiceGlowTheme.js';
export type { VoiceGlowState, IVoiceGlowColors, VoiceRimMood, GlowThemeKind, IVoiceRimAccent } from './voiceGlowTheme.js';
