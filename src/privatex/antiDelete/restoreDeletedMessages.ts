import { getGlobal } from '../../global';

import type { ApiMessage } from '../../api/types';
import type { GlobalState } from '../../global/types';
import type { ThreadId } from '../../types';
import { MAIN_THREAD_ID } from '../../api/types';

import { selectChatLastMessageId, selectIsChatWithSelf, selectSettingsKeys } from '../../global/selectors';
import { selectThreadIdFromMessage } from '../../global/selectors/threads';
import { getDeletedMessagesInRange } from './deletedMessagesVault';

/**
 * Returns kept deleted messages that belong between the loaded history messages, so they survive reloads
 */
export async function fetchRestorableDeletedMessages<T extends GlobalState>(
  global: T, chatId: string, threadId: ThreadId, loadedMessages: ApiMessage[],
) {
  const { currentUserId } = global;
  if (!currentUserId || !loadedMessages.length || !selectSettingsKeys(global).isAntiDeleteEnabled
    || selectIsChatWithSelf(global, chatId)) {
    return [];
  }

  const ids = loadedMessages.map(({ id }) => id);
  const minId = Math.min(...ids);
  const maxId = Math.max(...ids);
  const lastMessageId = selectChatLastMessageId(global, chatId);
  const isNewestSlice = !lastMessageId || maxId >= lastMessageId;

  const messages = await getDeletedMessagesInRange(currentUserId, chatId, minId, isNewestSlice ? undefined : maxId);
  if (threadId === MAIN_THREAD_ID || !messages.length) return messages;

  const currentGlobal = getGlobal();
  return messages.filter((message) => selectThreadIdFromMessage(currentGlobal, message) === threadId);
}
