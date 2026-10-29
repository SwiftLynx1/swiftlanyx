import { TELEGRAM_API_HASH, TELEGRAM_API_ID } from '../config';

export type ApiCredentials = {
  apiId: number;
  apiHash: string;
};

const STORAGE_KEY = 'tt-privatex-api-credentials';

/**
 * Build-time credentials win; otherwise the user enters their own key from my.telegram.org on the first launch
 */
export function getApiCredentials(): ApiCredentials | undefined {
  if (TELEGRAM_API_ID && TELEGRAM_API_HASH) {
    return { apiId: TELEGRAM_API_ID, apiHash: TELEGRAM_API_HASH };
  }

  return getStoredApiCredentials();
}

export function hasStoredApiCredentials() {
  return Boolean(getStoredApiCredentials());
}

export function saveApiCredentials(credentials: ApiCredentials) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export function clearApiCredentials() {
  localStorage.removeItem(STORAGE_KEY);
}

function getStoredApiCredentials(): ApiCredentials | undefined {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return undefined;

    const { apiId, apiHash } = JSON.parse(value) as Partial<ApiCredentials>;
    return typeof apiId === 'number' && typeof apiHash === 'string' ? { apiId, apiHash } : undefined;
  } catch {
    return undefined;
  }
}
