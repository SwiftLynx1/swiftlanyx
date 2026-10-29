import { memo } from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import type { PrivateXSettings } from '../../../types';
import type { RegularLangKey } from '../../../types/language';

import { selectSettingsKeys } from '../../../global/selectors';
import { DELETED_MESSAGES_RETENTION_DAYS } from '../../../privatex/antiDelete/deletedMessagesVault';

import useFlag from '../../../hooks/useFlag';
import useHistoryBack from '../../../hooks/useHistoryBack';
import useLang from '../../../hooks/useLang';
import useLastCallback from '../../../hooks/useLastCallback';

import Island, { IslandDescription, IslandTitle } from '../../gili/layout/Island';
import Checkbox from '../../ui/Checkbox';
import ConfirmDialog from '../../ui/ConfirmDialog';
import ListItem from '../../ui/ListItem';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

type StateProps = PrivateXSettings;

type GhostModeOptionKey = Exclude<keyof PrivateXSettings, 'isGhostModeEnabled' | 'isAntiDeleteEnabled'>;

const GHOST_MODE_OPTIONS: { key: GhostModeOptionKey; labelKey: RegularLangKey }[] = [
  { key: 'shouldGhostHideReadReceipts', labelKey: 'PrivateXGhostReadReceipts' },
  { key: 'shouldGhostHideStoryViews', labelKey: 'PrivateXGhostStoryViews' },
  { key: 'shouldGhostHideMediaPlayback', labelKey: 'PrivateXGhostMediaPlayback' },
  { key: 'shouldGhostHideOnline', labelKey: 'PrivateXGhostOnline' },
  { key: 'shouldGhostHideTyping', labelKey: 'PrivateXGhostTyping' },
];

const SettingsPrivateX = ({
  isActive,
  onReset,
  ...settings
}: OwnProps & StateProps) => {
  const { setPrivateXSettings, clearDeletedMessagesArchive } = getActions();

  const lang = useLang();

  const [isClearDialogOpen, openClearDialog, closeClearDialog] = useFlag();

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const handleClearArchive = useLastCallback(() => {
    closeClearDialog();
    clearDeletedMessagesArchive();
  });

  const { isGhostModeEnabled, isAntiDeleteEnabled } = settings;
  const dir = lang.isRtl ? 'rtl' : undefined;

  return (
    <div className="settings-content custom-scroll">
      <IslandTitle dir={dir}>{lang('PrivateXGhostMode')}</IslandTitle>
      <Island>
        <Checkbox
          label={lang('PrivateXGhostModeEnable')}
          subLabel={lang('PrivateXGhostModeDesc')}
          checked={isGhostModeEnabled}
          onCheck={(isChecked) => setPrivateXSettings({ isGhostModeEnabled: isChecked })}
        />
        {GHOST_MODE_OPTIONS.map(({ key, labelKey }) => (
          <Checkbox
            key={key}
            label={lang(labelKey)}
            checked={settings[key]}
            disabled={!isGhostModeEnabled}
            onCheck={(isChecked) => setPrivateXSettings({ [key]: isChecked })}
          />
        ))}
      </Island>
      <IslandDescription dir={dir}>{lang('PrivateXGhostModeNote')}</IslandDescription>

      <IslandTitle dir={dir}>{lang('PrivateXAntiDelete')}</IslandTitle>
      <Island>
        <Checkbox
          label={lang('PrivateXAntiDeleteEnable')}
          subLabel={lang('PrivateXAntiDeleteDesc')}
          checked={isAntiDeleteEnabled}
          onCheck={(isChecked) => setPrivateXSettings({ isAntiDeleteEnabled: isChecked })}
        />
        <ListItem
          className="destructive"
          icon="delete"
          narrow
          onClick={openClearDialog}
        >
          {lang('PrivateXAntiDeleteClear')}
        </ListItem>
      </Island>
      <IslandDescription dir={dir}>
        {lang('PrivateXAntiDeleteStorage', {
          days: DELETED_MESSAGES_RETENTION_DAYS,
        }, { pluralValue: DELETED_MESSAGES_RETENTION_DAYS })}
      </IslandDescription>

      <ConfirmDialog
        isOpen={isClearDialogOpen}
        title={lang('PrivateXAntiDeleteClear')}
        text={lang('PrivateXAntiDeleteClearConfirm')}
        confirmLabel={lang('Delete')}
        confirmIsDestructive
        confirmHandler={handleClearArchive}
        onClose={closeClearDialog}
      />
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global): Complete<StateProps> => {
    const {
      isGhostModeEnabled,
      shouldGhostHideReadReceipts,
      shouldGhostHideStoryViews,
      shouldGhostHideMediaPlayback,
      shouldGhostHideOnline,
      shouldGhostHideTyping,
      isAntiDeleteEnabled,
    } = selectSettingsKeys(global);

    return {
      isGhostModeEnabled,
      shouldGhostHideReadReceipts,
      shouldGhostHideStoryViews,
      shouldGhostHideMediaPlayback,
      shouldGhostHideOnline,
      shouldGhostHideTyping,
      isAntiDeleteEnabled,
    };
  },
)(SettingsPrivateX));
