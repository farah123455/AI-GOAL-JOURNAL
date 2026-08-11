import { auth } from '../firebase';

/**
 * Helper to construct authorization headers with the current user's Firebase ID Token.
 * Note: Full backend Firebase token verification and endpoint protection are planned
 * for future integration (Aditya / Farah).
 */
export async function getAuthHeaders() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return {};
  }
  const token = await currentUser.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Placeholder client for future backend API requests.
 */
export async function fetchWithAuth(url, options = {}) {
  const authHeaders = await getAuthHeaders();
  const headers = {
    ...options.headers,
    ...authHeaders,
  };
  return fetch(url, { ...options, headers });
}
