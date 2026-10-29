import { Api as GramJs } from '../../../lib/gramjs';

import type { ApiGhostModeSettings } from '../../types';

import { getGhostModeSettings, updateGhostModeSettings } from '../privatex/ghostMode';
import { invokeRequest } from './client';

export function setGhostModeSettings(settings: ApiGhostModeSettings) {
  const wasOnlineHidden = Boolean(getGhostModeSettings().shouldHideOnline);
  updateGhostModeSettings(settings);

  if (settings.shouldHideOnline && !wasOnlineHidden) {
    void invokeRequest(new GramJs.account.UpdateStatus({ offline: true }), { shouldIgnoreErrors: true });
  }
}
