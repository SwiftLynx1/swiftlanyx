import type { ActionReturnType } from '../../types';

import { areDeepEqual } from '../../../util/areDeepEqual';
import { callApi } from '../../../api/gramjs';
import { clearDeletedMessages } from '../../../privatex/antiDelete/deletedMessagesVault';
import { getGhostModeApiSettings } from '../../helpers/privatex';
import { addActionHandler } from '../../index';
import { removeRemotelyDeletedMessages, replaceSettings } from '../../reducers';

addActionHandler('setPrivateXSettings', (global, actions, payload): ActionReturnType => {
  const prevGhostMode = getGhostModeApiSettings(global.settings.byKey);
  global = replaceSettings(global, payload);
  const ghostMode = getGhostModeApiSettings(global.settings.byKey);

  if (!areDeepEqual(prevGhostMode, ghostMode)) {
    void callApi('setGhostModeSettings', ghostMode);

    if (prevGhostMode.shouldHideOnline && !ghostMode.shouldHideOnline) {
      actions.updateIsOnline({ isOnline: document.hasFocus() });
    }
  }

  return global;
});

addActionHandler('clearDeletedMessagesArchive', (global): ActionReturnType => {
  if (!global.currentUserId) return undefined;

  void clearDeletedMessages(global.currentUserId);

  return removeRemotelyDeletedMessages(global);
});
