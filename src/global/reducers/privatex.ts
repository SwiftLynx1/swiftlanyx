import type { GlobalState } from '../types';

import { deleteChatMessages } from './messages';

export function removeRemotelyDeletedMessages<T extends GlobalState>(global: T): T {
  Object.entries(global.messages.byChatId).forEach(([chatId, { byId }]) => {
    const ids = Object.values(byId)
      .filter((message) => message.remoteDeletedAt)
      .map(({ id }) => id);

    if (ids.length) {
      global = deleteChatMessages(global, chatId, ids);
    }
  });

  return global;
}
