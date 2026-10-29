// Server echoes of deletions made by this client must not be treated as deletions by other people
const OWN_DELETION_TTL_MS = 5 * 60 * 1000;
const COMMON_BOX_KEY = 'common';

const ownDeletionExpiries = new Map<string, number>();

export function registerOwnDeletions(channelId: string | undefined, ids: number[]) {
  pruneOwnDeletions();

  const expiresAt = Date.now() + OWN_DELETION_TTL_MS;
  ids.forEach((id) => {
    ownDeletionExpiries.set(buildKey(channelId, id), expiresAt);
  });
}

export function unregisterOwnDeletions(channelId: string | undefined, ids: number[]) {
  ids.forEach((id) => {
    ownDeletionExpiries.delete(buildKey(channelId, id));
  });
}

export function filterRemoteDeletionIds(channelId: string | undefined, ids: number[]) {
  pruneOwnDeletions();

  return ids.filter((id) => !ownDeletionExpiries.has(buildKey(channelId, id)));
}

function pruneOwnDeletions() {
  const now = Date.now();
  ownDeletionExpiries.forEach((expiresAt, key) => {
    if (expiresAt < now) ownDeletionExpiries.delete(key);
  });
}

function buildKey(channelId: string | undefined, id: number) {
  return `${channelId || COMMON_BOX_KEY}_${id}`;
}
