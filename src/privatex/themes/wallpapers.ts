import type { PrivateXThemeKey } from '../../types';

import { buildColorFromHex, getPatternColor } from '../../util/colors';

export type PrivateXWallpaper = {
  colors: string[];
  patternColor: string;
  // Negative intensity: the built-in doodles reveal the gradient over `baseColor`
  intensity: number;
  baseColor?: string;
  actionMessageBg: string;
};

const MASKED_INTENSITY = -40;
const SUBTLE_MASKED_INTENSITY = -30;

function buildWallpaper(
  colors: string[],
  intensity: number,
  actionMessageBg: string,
  baseColor?: string,
): PrivateXWallpaper {
  return {
    colors,
    intensity,
    baseColor,
    actionMessageBg,
    patternColor: getPatternColor(buildColorFromHex(colors[0])),
  };
}

// Dark themes keep a near-black base and let the doodles tint it; PrivateX Light is a flat solid color
export const PRIVATEX_WALLPAPERS: Record<PrivateXThemeKey, PrivateXWallpaper> = {
  privatexDark: {
    ...buildWallpaper(['#262932', '#181A20'], SUBTLE_MASKED_INTENSITY, '#4B505B80', '#0B0C0E'),
    patternColor: '#8B8F9866',
  },
  privatexLight: {
    ...buildWallpaper(['#F4F5F7'], 0, '#2B2F36B3'),
    patternColor: '#6B728066',
  },
  halloween: buildWallpaper(['#6B2FA0', '#B8530F', '#3B1A5E', '#8A3FD0'], MASKED_INTENSITY, '#6B2FA080', '#0E0A14'),
  winter: buildWallpaper(['#2F78C8', '#7DD3FC', '#1F4FA8', '#5AA9E6'], MASKED_INTENSITY, '#2F78C880', '#08121F'),
  rainbow: buildWallpaper(['#D6246E', '#7B3FE4', '#2563EB', '#10B981'], MASKED_INTENSITY, '#5B3FB080', '#0B0B0F'),
  red: buildWallpaper(['#9F1239', '#E11D48', '#5A0A20', '#BE123C'], MASKED_INTENSITY, '#9F123980', '#0A0607'),
};
