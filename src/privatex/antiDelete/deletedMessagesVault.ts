import type { UseStore } from 'idb-keyval';
import {
  createStore, delMany, entries, set,
} from 'idb-keyval';

import type { ApiMessage } from '../../api/types';

import { DEBUG } from '../../config';
import { getServerTime } from '../../util/serverTime';

type VaultEntry = {
  userId: string;
  message: ApiMessage;
};

type VaultIndex = Map<string, Map<number, ApiMessage>>;

const DB_NAME = 'tt-privatex';
const STORE_NAME = 'deleted-messages';
export const DELETED_MESSAGES_RETENTION_DAYS = 30;
const RETENTION_SECONDS = DELETED_MESSAGES_RETENTION_DAYS * 24 * 60 * 60;
const MAX_MESSAGES_PER_ACCOUNT = 5000;

let store: UseStore | undefined;
let loadedUserId: string | undefined;
let indexPromise: Promise<VaultIndex> | undefined;

export async function saveDeletedMessage(userId: string, message: ApiMessage) {
  const index = await loadIndex(userId);
  addToIndex(index, message);

  try {
    await set(buildKey(userId, message.chatId, message.id), { userId, message } satisfies VaultEntry, getStore());
  } catch (err) {
    logError(err);
  }
}

export async function removeDeletedMessages(userId: string, chatId: string, ids: number[]) {
  const index = await loadIndex(userId);
  const chatMessages = index.get(chatId);
  ids.forEach((id) => chatMessages?.delete(id));

  try {
    await delMany(ids.map((id) => buildKey(userId, chatId, id)), getStore());
  } catch (err) {
    logError(err);
  }
}

export async function clearDeletedMessages(userId: string) {
  const index = await loadIndex(userId);
  index.clear();

  try {
    const keys = (await entries<string, VaultEntry>(getStore()))
      .filter(([, entry]) => entry.userId === userId)
      .map(([key]) => key);
    await delMany(keys, getStore());
  } catch (err) {
    logError(err);
  }
}

/**
 * Returns kept messages with `minId <= id <= maxId`; an omitted `maxId` leaves the range open towards newer messages
 */
export async function getDeletedMessagesInRange(userId: string, chatId: string, minId: number, maxId?: number) {
  const index = await loadIndex(userId);
  const chatMessages = index.get(chatId);
  if (!chatMessages) return [];

  return Array.from(chatMessages.values())
    .filter(({ id }) => id >= minId && (maxId === undefined || id <= maxId));
}

function loadIndex(userId: string) {
  if (!indexPromise || loadedUserId !== userId) {
    loadedUserId = userId;
    indexPromise = readIndex(userId);
  }

  return indexPromise;
}

async function readIndex(userId: string) {
  const index: VaultIndex = new Map();

  try {
    const userEntries = (await entries<string, VaultEntry>(getStore()))
      .filter(([, entry]) => entry.userId === userId)
      .sort(([, a], [, b]) => (b.message.remoteDeletedAt || 0) - (a.message.remoteDeletedAt || 0));

    const minDeletedAt = getServerTime() - RETENTION_SECONDS;
    const expiredKeys: string[] = [];
    userEntries.forEach(([key, { message }], i) => {
      if (i >= MAX_MESSAGES_PER_ACCOUNT || (message.remoteDeletedAt || 0) < minDeletedAt) {
        expiredKeys.push(key);
        return;
      }

      addToIndex(index, message);
    });

    if (expiredKeys.length) {
      await delMany(expiredKeys, getStore());
    }
  } catch (err) {
    logError(err);
  }

  return index;
}

function addToIndex(index: VaultIndex, message: ApiMessage) {
  let chatMessages = index.get(message.chatId);
  if (!chatMessages) {
    chatMessages = new Map();
    index.set(message.chatId, chatMessages);
  }

  chatMessages.set(message.id, message);
}

function getStore() {
  // Created lazily so that importing the module does not open the database
  store ||= createStore(DB_NAME, STORE_NAME);
  return store;
}

function buildKey(userId: string, chatId: string, messageId: number) {
  return `${userId}_${chatId}_${messageId}`;
}

function logError(err: unknown) {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.error('[PrivateX] Deleted messages vault failed', err);
  }
}
