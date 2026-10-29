import type { PrivateXThemeKey, ThemeKey } from '../../types';
import type { RegularLangKey } from '../../types/language';

export type PrivateXThemePreview = {
  background: string;
  incoming: string;
  outgoing: string;
  accent: string;
};

export type PrivateXTheme = {
  key: PrivateXThemeKey;
  scheme: ThemeKey;
  className: string;
  nameKey: RegularLangKey;
  // Used for `<meta name="theme-color">`
  metaColor: string;
  preview: PrivateXThemePreview;
};

export const DEFAULT_PRIVATEX_THEME: PrivateXThemeKey = 'privatexDark';

export const PRIVATEX_THEMES: Record<PrivateXThemeKey, PrivateXTheme> = {
  privatexDark: {
    key: 'privatexDark',
    scheme: 'dark',
    className: 'theme-privatex-dark',
    nameKey: 'ThemePrivateXDark',
    metaColor: '#0B0C0E',
    preview: {
      background: '#0B0C0E', incoming: '#1A1C21', outgoing: '#2A2D35', accent: '#F2F3F5',
    },
  },
  privatexLight: {
    key: 'privatexLight',
    scheme: 'light',
    className: 'theme-privatex-light',
    nameKey: 'ThemePrivateXLight',
    metaColor: '#FFFFFF',
    preview: {
      background: '#F7F7F8', incoming: '#FFFFFF', outgoing: '#111317', accent: '#111317',
    },
  },
  halloween: {
    key: 'halloween',
    scheme: 'dark',
    className: 'theme-halloween',
    nameKey: 'ThemeHalloween',
    metaColor: '#0E0A14',
    preview: {
      background: '#0E0A14', incoming: '#1D1727', outgoing: '#3B1A5E', accent: '#FF7A1A',
    },
  },
  winter: {
    key: 'winter',
    scheme: 'dark',
    className: 'theme-winter',
    nameKey: 'ThemeWinter',
    metaColor: '#08121F',
    preview: {
      background: '#08121F', incoming: '#12233A', outgoing: '#1F4FA8', accent: '#7DD3FC',
    },
  },
  rainbow: {
    key: 'rainbow',
    scheme: 'dark',
    className: 'theme-rainbow',
    nameKey: 'ThemeRainbow',
    metaColor: '#0B0B0F',
    preview: {
      background: '#0B0B0F', incoming: '#1A1A21', outgoing: '#7B3FE4', accent: '#D6246E',
    },
  },
  red: {
    key: 'red',
    scheme: 'dark',
    className: 'theme-red',
    nameKey: 'ThemeRed',
    metaColor: '#0A0607',
    preview: {
      background: '#0A0607', incoming: '#1B1214', outgoing: '#BE123C', accent: '#E11D48',
    },
  },
};

export const PRIVATEX_THEME_KEYS = Object.keys(PRIVATEX_THEMES) as PrivateXThemeKey[];

export function getPrivateXThemeScheme(key: PrivateXThemeKey): ThemeKey {
  return PRIVATEX_THEMES[key].scheme;
}

// Maps the system color scheme (`shouldUseSystemTheme`) to the matching base PrivateX theme
export function getPrivateXThemeForScheme(scheme: ThemeKey): PrivateXThemeKey {
  return scheme === 'dark' ? 'privatexDark' : 'privatexLight';
}
