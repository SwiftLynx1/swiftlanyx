import type { ApiGhostModeSettings, ApiMessage } from '../../api/types';
import type { AccountSettings } from '../../types';

import { isMessageLocal } from './messages';

export function getGhostModeApiSettings(settings: AccountSettings): ApiGhostModeSettings {
  if (!settings.isGhostModeEnabled) return {};

  return {
    shouldHideReadReceipts: settings.shouldGhostHideReadReceipts,
    shouldHideStoryViews: settings.shouldGhostHideStoryViews,
    shouldHideMediaPlayback: settings.shouldGhostHideMediaPlayback,
    shouldHideOnline: settings.shouldGhostHideOnline,
    shouldHideTyping: settings.shouldGhostHideTyping,
  };
}

export function canPreserveDeletedMessage(message: ApiMessage) {
  return !message.content.action && !message.isDeleting && !isMessageLocal(message);
}
