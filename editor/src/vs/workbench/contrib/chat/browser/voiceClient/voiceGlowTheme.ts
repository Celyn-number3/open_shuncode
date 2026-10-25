/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Theme APIs retained from the pinned VS Code 1.132.0 source, alongside the
 * shipped-bundle-derived legacy glow. This is upstream source integration,
 * not a claim that missing original ShunCode TypeScript was recovered.
 */
import { Color, HSLA } from '../../../../../base/common/color.js';
import type { IColorTheme } from '../../../../../platform/theme/common/themeService.js';
import { chatVoiceGlowBaseColor, chatVoiceListeningGlow, chatVoiceSpeakingGlow } from '../../common/widget/chatColors.js';

export type VoiceGlowState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
export type VoiceRimMood = 'cool' | 'warm';
export type GlowThemeKind = 'light' | 'dark';

export interface IVoiceGlowColors {
	readonly listening: Color;
	readonly speaking: Color;
}

export interface IVoiceRimAccent {
	readonly hue: number;
	readonly saturation: number;
	readonly lightness: number;
}

export const VOICE_GLOW_SPEAKING_HUE_SHIFT = 80;
const VOICE_GLOW_FALLBACK = Color.fromHex('#58A6FF');

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, value));
}

function shiftHue(base: Color, degrees: number, saturationMul: number = 1, lightnessAdd: number = 0): Color {
	const hsla = base.hsla;
	return new Color(new HSLA((hsla.h + degrees + 360) % 360, clamp01(hsla.s * saturationMul), clamp01(hsla.l + lightnessAdd), 1));
}

export const DEFAULT_VOICE_GLOW_COLORS: IVoiceGlowColors = {
	listening: VOICE_GLOW_FALLBACK,
	speaking: shiftHue(VOICE_GLOW_FALLBACK, VOICE_GLOW_SPEAKING_HUE_SHIFT),
};

export function resolveVoiceGlowColors(theme: Pick<IColorTheme, 'getColor'>): IVoiceGlowColors {
	const base = theme.getColor(chatVoiceGlowBaseColor) ?? VOICE_GLOW_FALLBACK;
	return {
		listening: theme.getColor(chatVoiceListeningGlow) ?? base,
		speaking: theme.getColor(chatVoiceSpeakingGlow) ?? shiftHue(base, VOICE_GLOW_SPEAKING_HUE_SHIFT),
	};
}

export function voiceGlowStateColor(voiceState: VoiceGlowState, colors: IVoiceGlowColors): Color {
	return voiceState === 'speaking' ? colors.speaking : colors.listening;
}

const RIM_SAT_MIN = 70;
const RIM_SAT_MAX = 96;
const RIM_LIGHTNESS = {
	dark: { cool: 56, warm: 72 },
	light: { cool: 72, warm: 72 },
} as const;
const RIM_HUE_SHIFT = { cool: -10, warm: 7 } as const;

export function resolveVoiceRimAccent(accent: Color, mood: VoiceRimMood, theme: GlowThemeKind): IVoiceRimAccent {
	const { h, s } = accent.hsla;
	return {
		hue: (h + RIM_HUE_SHIFT[mood] + 360) % 360,
		saturation: Math.round(Math.min(RIM_SAT_MAX, Math.max(RIM_SAT_MIN, s * 100))),
		lightness: RIM_LIGHTNESS[theme][mood],
	};
}

export function computeVoiceMicGlowBoxShadow(voiceState: VoiceGlowState, intensity: number, colors: IVoiceGlowColors = DEFAULT_VOICE_GLOW_COLORS): string {
	const { r, g, b } = voiceGlowStateColor(voiceState, colors).rgba;
	const shadowSpread = 3 + intensity * 8;
	const shadowAlpha = 0.2 + intensity * 0.45;
	return `0 0 ${shadowSpread}px rgba(${r},${g},${b},${shadowAlpha})`;
}
