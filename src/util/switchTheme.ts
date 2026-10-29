import type { PrivateXThemeKey, ThemeKey } from '../types';

import { buildColor, type Color, mixColors, serializeColor } from '../lib/color';
import { requestMutation } from '../lib/fasterdom/fasterdom';
import { PRIVATEX_PALETTES, type ThemeVariable } from '../privatex/themes/palettes';
import { PRIVATEX_THEME_KEYS, PRIVATEX_THEMES } from '../privatex/themes/themes';
import themeColors from '../styles/themes.json';
import { animate } from './animation';
import { convertSrgbChannel } from './colors.ts';

type ResolvedColors = Map<ThemeVariable, Color>;

let isInitialized = false;
let appliedThemeKey: PrivateXThemeKey | undefined;
let appliedColors: ResolvedColors | undefined;
let animationId = 0;

const DURATION_MS = 200;
const ENABLE_ANIMATION_DELAY_MS = 500;
const SCHEME_CLASS_NAMES = ['theme-light', 'theme-dark'];
const VARIANT_CLASS_NAMES = PRIVATEX_THEME_KEYS.map((key) => PRIVATEX_THEMES[key].className);
const RGB_VARIABLES = new Set<string>([
  '--color-text',
  '--color-primary-shade',
  '--color-text-secondary',
  '--color-accent-own',
]);

const DISABLE_ANIMATION_CSS = `
.no-animations #root *,
.no-animations #root *::before,
.no-animations #root *::after {
  transition: none !important;
}`;

const variables = Object.keys(themeColors) as ThemeVariable[];
const resolvedCache = new Map<PrivateXThemeKey, ResolvedColors>();

const injectCss = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  return () => {
    document.head.removeChild(style);
  };
};

const switchTheme = (themeKey: PrivateXThemeKey, withAnimation: boolean) => {
  if (themeKey === appliedThemeKey) {
    return;
  }

  const theme = PRIVATEX_THEMES[themeKey];
  const shouldAnimate = isInitialized && withAnimation;
  const endColors = resolveColors(themeKey);
  const startAt = Date.now();
  const themeColorTag = document.querySelector('meta[name="theme-color"]');
  const currentAnimationId = ++animationId;

  appliedThemeKey = themeKey;

  requestMutation(() => {
    // Read here so an interrupted animation continues from its last rendered frame
    const startColors = appliedColors;
    const { classList } = document.documentElement;
    classList.remove(...SCHEME_CLASS_NAMES, ...VARIANT_CLASS_NAMES);

    let uninjectCss: (() => void) | undefined;
    if (isInitialized) {
      uninjectCss = injectCss(DISABLE_ANIMATION_CSS);
      classList.add('no-animations');
    }
    classList.add(`theme-${theme.scheme}`, theme.className);
    themeColorTag?.setAttribute('content', theme.metaColor);

    setTimeout(() => {
      requestMutation(() => {
        uninjectCss?.();
        document.documentElement.classList.remove('no-animations');
      });
    }, ENABLE_ANIMATION_DELAY_MS);

    isInitialized = true;

    if (shouldAnimate && startColors) {
      animate(() => {
        if (currentAnimationId !== animationId) return false;

        const t = Math.min((Date.now() - startAt) / DURATION_MS, 1);

        applyColorAnimationStep(startColors, endColors, transition(t));

        return t < 1;
      }, requestMutation);
    } else {
      applyColorAnimationStep(endColors, endColors);
    }
  });
};

function resolveColors(themeKey: PrivateXThemeKey): ResolvedColors {
  const cached = resolvedCache.get(themeKey);
  if (cached) return cached;

  const schemeIndex = getSchemeIndex(PRIVATEX_THEMES[themeKey].scheme);
  const palette = PRIVATEX_PALETTES[themeKey];
  const colors: ResolvedColors = new Map(variables.map((property) => [
    property,
    buildColor(palette[property] ?? themeColors[property][schemeIndex]),
  ]));

  resolvedCache.set(themeKey, colors);
  return colors;
}

// `themes.json` stores `[light, dark]` pairs
function getSchemeIndex(scheme: ThemeKey) {
  return scheme === 'dark' ? 1 : 0;
}

function transition(t: number) {
  return 1 - ((1 - t) ** 3.5);
}

function applyColorAnimationStep(startColors: ResolvedColors, endColors: ResolvedColors, interpolationRatio = 1) {
  const nextColors: ResolvedColors = new Map();

  variables.forEach((property) => {
    const color = mixColors(startColors.get(property)!, endColors.get(property)!, interpolationRatio, {
      space: 'srgb',
    });
    const [r, g, b] = color.coords.map(convertSrgbChannel);

    nextColors.set(property, color);
    document.documentElement.style.setProperty(property, serializeColor(color, { format: 'rgb' }));

    if (RGB_VARIABLES.has(property)) {
      document.documentElement.style.setProperty(`${property}-rgb`, `${r},${g},${b}`);
    }
  });

  appliedColors = nextColors;
}

export default switchTheme;
