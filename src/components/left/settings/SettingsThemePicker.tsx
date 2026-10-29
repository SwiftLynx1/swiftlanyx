import { memo } from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import type { SharedSettings } from '../../../global/types';
import type { PrivateXThemeKey } from '../../../types';

import { selectSharedSettings } from '../../../global/selectors/sharedState';
import buildClassName from '../../../util/buildClassName';
import buildStyle from '../../../util/buildStyle';
import { PRIVATEX_THEME_KEYS, PRIVATEX_THEMES } from '../../../privatex/themes/themes';

import useLang from '../../../hooks/useLang';
import useLastCallback from '../../../hooks/useLastCallback';

import Icon from '../../common/icons/Icon';
import Checkbox from '../../ui/Checkbox';

import styles from './SettingsThemePicker.module.scss';

type StateProps = Pick<SharedSettings, 'privatexTheme' | 'shouldUseSystemTheme'>;

const SettingsThemePicker = ({
  privatexTheme,
  shouldUseSystemTheme,
}: StateProps) => {
  const { setPrivateXTheme, setShouldUseSystemTheme } = getActions();

  const lang = useLang();

  const handleThemeClick = useLastCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const themeKey = e.currentTarget.dataset.themeKey as PrivateXThemeKey;
    if (themeKey === privatexTheme && !shouldUseSystemTheme) return;

    setPrivateXTheme({ themeKey });
  });

  const handleSystemThemeCheck = useLastCallback((shouldUse: boolean) => {
    setShouldUseSystemTheme({ shouldUse });
  });

  return (
    <div className={styles.root}>
      <div className={styles.grid} role="radiogroup" aria-label={lang('Theme')}>
        {PRIVATEX_THEME_KEYS.map((themeKey) => {
          const { preview, nameKey } = PRIVATEX_THEMES[themeKey];
          const isSelected = themeKey === privatexTheme;

          return (
            <button
              key={themeKey}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={buildClassName(styles.tile, isSelected && styles.selected)}
              data-theme-key={themeKey}
              onClick={handleThemeClick}
            >
              <span
                className={styles.preview}
                style={buildStyle(
                  `--preview-background: ${preview.background}`,
                  `--preview-incoming: ${preview.incoming}`,
                  `--preview-outgoing: ${preview.outgoing}`,
                  `--preview-accent: ${preview.accent}`,
                )}
              >
                <span className={styles.incoming} />
                <span className={styles.outgoing} />
                <span className={styles.accent} />
                {isSelected && <Icon name="check" className={styles.check} />}
              </span>
              <span className={styles.name}>{lang(nameKey)}</span>
            </button>
          );
        })}
      </div>
      <Checkbox
        label={lang('ThemeFollowSystem')}
        subLabel={lang('ThemeFollowSystemDesc')}
        checked={shouldUseSystemTheme}
        onCheck={handleSystemThemeCheck}
      />
    </div>
  );
};

export default memo(withGlobal(
  (global): Complete<StateProps> => {
    const { privatexTheme, shouldUseSystemTheme } = selectSharedSettings(global);

    return {
      privatexTheme,
      shouldUseSystemTheme,
    };
  },
)(SettingsThemePicker));
