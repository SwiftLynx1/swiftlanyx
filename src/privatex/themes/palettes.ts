import type themeColors from '../../styles/themes.json';
import type { PrivateXThemeKey } from '../../types';

export type ThemeVariable = keyof typeof themeColors;
export type ThemePalette = Partial<Record<ThemeVariable, string>>;

type PaletteSeed = {
  isDark: boolean;
  surface: string;
  page: string;
  sidebar: string;
  raised: string;
  pressed: string;
  border: string;
  borderInput: string;
  divider: string;
  text: string;
  textSecondary: string;
  gray: string;
  primary: string;
  primaryShade: string;
  links: string;
  chatActive: string;
  chatActiveGreyed: string;
  own: string;
  ownSelected: string;
  ownHover: string;
  ownActive: string;
  ownAccent: string;
  ownMeta: string;
  ownLinks: string;
  code: string;
  codeOwn: string;
  codeBg: string;
  codeOwnBg: string;
  username: string;
  shadow: string;
  shadowLight: string;
  overrides?: ThemePalette;
};

const PRIMARY_OPACITY_ALPHA = '1E';
const PRIMARY_OPACITY_HOVER_ALPHA = '40';
const PRIMARY_TINT_ALPHA = '1A';
const MENU_ALPHA_DARK = 'DD';
const MENU_ALPHA_LIGHT = 'BB';

// Missing variables fall back to the color scheme's base value from `themes.json`
function buildPalette(seed: PaletteSeed): ThemePalette {
  const menuAlpha = seed.isDark ? MENU_ALPHA_DARK : MENU_ALPHA_LIGHT;

  return {
    '--color-primary': seed.primary,
    '--color-primary-opacity': `${seed.primary}${PRIMARY_OPACITY_ALPHA}`,
    '--color-primary-opacity-hover': `${seed.primary}${PRIMARY_OPACITY_HOVER_ALPHA}`,
    '--color-primary-tint': `${seed.primary}${PRIMARY_TINT_ALPHA}`,
    '--color-primary-shade': seed.primaryShade,
    '--color-background': seed.surface,
    '--color-background-compact-menu': `${seed.surface}${menuAlpha}`,
    '--color-background-compact-menu-reactions': `${seed.surface}${menuAlpha}`,
    '--color-background-secondary': seed.page,
    '--color-background-secondary-accent': seed.pressed,
    '--color-background-sidebar': seed.sidebar,
    '--color-background-own': seed.own,
    '--color-background-own-apple': seed.own,
    '--color-background-selected': seed.raised,
    '--color-background-own-selected': seed.ownSelected,
    '--color-chat-hover': seed.raised,
    '--color-chat-active': seed.chatActive,
    '--color-chat-active-greyed': seed.chatActiveGreyed,
    '--color-item-hover': seed.raised,
    '--color-item-active': seed.pressed,
    '--color-text': seed.text,
    '--color-text-secondary': seed.textSecondary,
    '--color-icon-secondary': seed.textSecondary,
    '--color-text-secondary-apple': seed.textSecondary,
    '--color-borders': seed.border,
    '--color-borders-input': seed.borderInput,
    '--color-dividers': seed.divider,
    '--color-dividers-android': seed.page,
    '--color-links': seed.links,
    '--color-gray': seed.gray,
    '--color-list-icon': seed.textSecondary,
    '--color-default-shadow': seed.shadow,
    '--color-light-shadow': seed.shadowLight,
    '--color-active': seed.primary,
    '--color-active-darker': seed.primaryShade,
    '--color-text-meta-colored': seed.textSecondary,
    '--color-reply-hover': seed.raised,
    '--color-reply-active': seed.pressed,
    '--color-reply-own-hover': seed.ownHover,
    '--color-reply-own-hover-apple': seed.ownHover,
    '--color-reply-own-active': seed.ownActive,
    '--color-reply-own-active-apple': seed.ownActive,
    '--color-accent-own': seed.ownAccent,
    '--color-message-meta-own': seed.ownMeta,
    '--color-own-links': seed.ownLinks,
    '--color-code': seed.code,
    '--color-code-own': seed.codeOwn,
    '--color-code-bg': seed.codeBg,
    '--color-code-own-bg': seed.codeOwnBg,
    '--color-composer-button': seed.text,
    '--color-message-reaction': seed.raised,
    '--color-message-reaction-hover': seed.pressed,
    '--color-message-reaction-own': seed.ownHover,
    '--color-message-reaction-hover-own': seed.ownActive,
    '--color-message-reaction-chosen-hover': seed.primaryShade,
    '--color-message-reaction-chosen-hover-own': seed.ownAccent,
    '--color-voice-transcribe-button': seed.raised,
    '--color-voice-transcribe-button-own': seed.ownHover,
    '--color-forum-unread-topic-hover': seed.raised,
    '--color-forum-hover-unread-topic-hover': seed.pressed,
    '--color-chat-username': seed.username,
    ...seed.overrides,
  };
}

const PRIVATEX_DARK = buildPalette({
  isDark: true,
  surface: '#121317',
  page: '#0B0C0E',
  sidebar: '#111216',
  raised: '#1B1D23',
  pressed: '#22252C',
  border: '#23262D',
  borderInput: '#3A3E47',
  divider: '#2A2D35',
  text: '#F2F3F5',
  textSecondary: '#8B8F98',
  gray: '#5A5F69',
  primary: '#F2F3F5',
  primaryShade: '#D9DBE0',
  links: '#8AB4FF',
  chatActive: '#F2F3F5',
  chatActiveGreyed: '#C9CCD3',
  own: '#2A2D35',
  ownSelected: '#363A44',
  ownHover: '#323640',
  ownActive: '#3C414C',
  ownAccent: '#FFFFFF',
  ownMeta: '#B5B9C2',
  ownLinks: '#8AB4FF',
  code: '#8AB4FF',
  codeOwn: '#F2F3F5',
  codeBg: '#00000080',
  codeOwnBg: '#00000050',
  username: '#C9CCD3',
  shadow: '#00000099',
  shadowLight: '#00000040',
  overrides: {
    '--color-borders-read-story': '#4A4E57',
    '--color-message-reaction-chosen-hover': '#D9DBE0',
  },
});

const PRIVATEX_LIGHT = buildPalette({
  isDark: false,
  surface: '#FFFFFF',
  page: '#F7F7F8',
  sidebar: '#F7F7F8',
  raised: '#F3F4F6',
  pressed: '#E9EBEE',
  border: '#E5E7EB',
  borderInput: '#D1D5DB',
  divider: '#E5E7EB',
  text: '#0B0C0E',
  textSecondary: '#6B7280',
  gray: '#9CA3AF',
  primary: '#111317',
  primaryShade: '#2B2F36',
  links: '#2563EB',
  chatActive: '#111317',
  chatActiveGreyed: '#4B5563',
  own: '#111317',
  ownSelected: '#272B32',
  ownHover: '#1E2228',
  ownActive: '#2B3038',
  ownAccent: '#FFFFFF',
  ownMeta: '#FFFFFF99',
  ownLinks: '#93C5FD',
  code: '#1D4ED8',
  codeOwn: '#E5E7EB',
  codeBg: '#0B0C0E0D',
  codeOwnBg: '#FFFFFF1F',
  username: '#374151',
  shadow: '#0B0C0E1A',
  shadowLight: '#0B0C0E0D',
  overrides: {
    '--color-list-icon': '#9CA3AF',
    '--color-text-meta-colored': '#6B7280',
    '--color-message-reaction-chosen-hover': '#2B2F36',
  },
});

const HALLOWEEN = buildPalette({
  isDark: true,
  surface: '#17111F',
  page: '#0E0A14',
  sidebar: '#130E1B',
  raised: '#221A2E',
  pressed: '#2A2038',
  border: '#2A2038',
  borderInput: '#4A3A63',
  divider: '#2F2440',
  text: '#F3ECFA',
  textSecondary: '#9D8FB0',
  gray: '#5E5073',
  primary: '#F26B0C',
  primaryShade: '#D95E08',
  links: '#FF9D4D',
  chatActive: '#8E3AD9',
  chatActiveGreyed: '#A862E6',
  own: '#3B1A5E',
  ownSelected: '#4A2275',
  ownHover: '#47216F',
  ownActive: '#552A82',
  ownAccent: '#FFB36B',
  ownMeta: '#D9C2F0',
  ownLinks: '#FFC48A',
  code: '#FF9D4D',
  codeOwn: '#FFD9B0',
  codeBg: '#00000080',
  codeOwnBg: '#00000050',
  username: '#E3CBFA',
  shadow: '#000000A0',
  shadowLight: '#00000050',
  overrides: {
    '--color-message-reaction-chosen-hover': '#D95E08',
  },
});

const WINTER = buildPalette({
  isDark: true,
  surface: '#0E1B2E',
  page: '#08121F',
  sidebar: '#0C1828',
  raised: '#16283F',
  pressed: '#1B3250',
  border: '#1B2F4A',
  borderInput: '#38557A',
  divider: '#223A5A',
  text: '#EAF4FF',
  textSecondary: '#8FA8C4',
  gray: '#546C8A',
  primary: '#2F8FD8',
  primaryShade: '#2680C4',
  links: '#7DD3FC',
  chatActive: '#2F78C8',
  chatActiveGreyed: '#5A96D8',
  own: '#1F4FA8',
  ownSelected: '#2A5FBF',
  ownHover: '#2858B3',
  ownActive: '#3166C6',
  ownAccent: '#BFE6FF',
  ownMeta: '#CFE4FA',
  ownLinks: '#BFE6FF',
  code: '#7DD3FC',
  codeOwn: '#E4F4FF',
  codeBg: '#00000066',
  codeOwnBg: '#00000040',
  username: '#BFE0FF',
  shadow: '#00000099',
  shadowLight: '#00000040',
  overrides: {
    '--color-message-reaction-chosen-hover': '#2680C4',
  },
});

const RAINBOW = buildPalette({
  isDark: true,
  surface: '#13131A',
  page: '#0B0B0F',
  sidebar: '#101015',
  raised: '#1D1D26',
  pressed: '#242430',
  border: '#25252F',
  borderInput: '#44445A',
  divider: '#2C2C38',
  text: '#F5F5F7',
  textSecondary: '#9A9AA8',
  gray: '#5C5C6B',
  primary: '#7B3FE4',
  primaryShade: '#6A33CC',
  links: '#8FB0FF',
  chatActive: '#7B3FE4',
  chatActiveGreyed: '#9466EA',
  own: '#7B3FE4',
  ownSelected: '#6A33CC',
  ownHover: '#8650E8',
  ownActive: '#9366EC',
  ownAccent: '#FFFFFF',
  ownMeta: '#FFFFFFB3',
  ownLinks: '#FFFFFF',
  code: '#C4A8FF',
  codeOwn: '#FFFFFF',
  codeBg: '#00000080',
  codeOwnBg: '#00000050',
  username: '#E0D4FA',
  shadow: '#00000099',
  shadowLight: '#00000040',
  overrides: {
    '--color-message-reaction-chosen-hover': '#6A33CC',
  },
});

const RED = buildPalette({
  isDark: true,
  surface: '#140C0F',
  page: '#0A0607',
  sidebar: '#100A0C',
  raised: '#1F1216',
  pressed: '#27161B',
  border: '#2A171D',
  borderInput: '#503039',
  divider: '#33191F',
  text: '#F7EDEF',
  textSecondary: '#A3939A',
  gray: '#6B5A60',
  primary: '#E11D48',
  primaryShade: '#BE123C',
  links: '#FF6B8A',
  chatActive: '#2B1017',
  chatActiveGreyed: '#3A1822',
  own: '#9F1239',
  ownSelected: '#B3173F',
  ownHover: '#AD1743',
  ownActive: '#C01E4D',
  ownAccent: '#FFD1DB',
  ownMeta: '#F3B6C3',
  ownLinks: '#FFD1DB',
  code: '#FF8FA6',
  codeOwn: '#FFE4EA',
  codeBg: '#00000080',
  codeOwnBg: '#00000050',
  username: '#F5C8D1',
  shadow: '#000000A0',
  shadowLight: '#00000050',
  overrides: {
    '--color-message-reaction-chosen-hover': '#BE123C',
  },
});

export const PRIVATEX_PALETTES: Record<PrivateXThemeKey, ThemePalette> = {
  privatexDark: PRIVATEX_DARK,
  privatexLight: PRIVATEX_LIGHT,
  halloween: HALLOWEEN,
  winter: WINTER,
  rainbow: RAINBOW,
  red: RED,
};
