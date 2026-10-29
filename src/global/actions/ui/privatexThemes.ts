import type { ActionReturnType } from '../../types';

import { getSystemTheme } from '../../../util/systemTheme';
import { getPrivateXThemeForScheme, getPrivateXThemeScheme } from '../../../privatex/themes/themes';
import { addActionHandler } from '../../index';
import { updateSharedSettings } from '../../reducers';

addActionHandler('setPrivateXTheme', (global, actions, payload): ActionReturnType => {
  const { themeKey } = payload;

  return updateSharedSettings(global, {
    privatexTheme: themeKey,
    theme: getPrivateXThemeScheme(themeKey),
    shouldUseSystemTheme: false,
  });
});

addActionHandler('setShouldUseSystemTheme', (global, actions, payload): ActionReturnType => {
  const { shouldUse } = payload;

  if (!shouldUse) {
    return updateSharedSettings(global, { shouldUseSystemTheme: false });
  }

  const scheme = getSystemTheme();

  return updateSharedSettings(global, {
    shouldUseSystemTheme: true,
    theme: scheme,
    privatexTheme: getPrivateXThemeForScheme(scheme),
  });
});
