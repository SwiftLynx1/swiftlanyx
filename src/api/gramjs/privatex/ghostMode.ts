import { Api as GramJs } from '../../../lib/gramjs';

import type { ApiGhostModeSettings } from '../../types';

let ghostModeSettings: ApiGhostModeSettings = {};

export function getGhostModeSettings() {
  return ghostModeSettings;
}

export function updateGhostModeSettings(settings: ApiGhostModeSettings = {}) {
  ghostModeSettings = settings;
}

/**
 * Returns `false` when the request would reveal activity that Ghost Mode hides.
 * Requests that only need a weaker form (online status, channel views) are adjusted in place.
 */
export function applyGhostMode(request: GramJs.AnyRequest) {
  const {
    shouldHideReadReceipts, shouldHideStoryViews, shouldHideMediaPlayback, shouldHideOnline, shouldHideTyping,
  } = ghostModeSettings;

  if (shouldHideReadReceipts && (
    request instanceof GramJs.messages.ReadHistory
    || request instanceof GramJs.channels.ReadHistory
    || request instanceof GramJs.messages.ReadDiscussion
    || request instanceof GramJs.messages.ReadSavedHistory
  )) {
    return false;
  }

  if (shouldHideReadReceipts && request instanceof GramJs.messages.GetMessagesViews) {
    request.increment = false;
    return true;
  }

  if (shouldHideStoryViews && (
    request instanceof GramJs.stories.ReadStories
    || request instanceof GramJs.stories.IncrementStoryViews
  )) {
    return false;
  }

  if (shouldHideMediaPlayback && (
    request instanceof GramJs.messages.ReadMessageContents
    || request instanceof GramJs.channels.ReadMessageContents
  )) {
    return false;
  }

  if (request instanceof GramJs.messages.SetTyping) {
    if (shouldHideTyping) return false;
    // Watching an emoji interaction notifies the sender as well
    if (shouldHideReadReceipts && request.action instanceof GramJs.SendMessageEmojiInteractionSeen) return false;
  }

  if (shouldHideOnline && request instanceof GramJs.account.UpdateStatus) {
    request.offline = true;
  }

  return true;
}
