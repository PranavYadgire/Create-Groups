// Lightweight client for the Trello REST API (https://api.trello.com/1),
// authenticated with the member's private token stored by the Power-Up.

import { APP_KEY, getToken, clearToken } from "./auth.js";

export const NOT_AUTHORIZED = "NOT_AUTHORIZED";

export async function apiFetch(t, path, { method = "GET", params = {} } = {}) {
  const token = await getToken(t);
  if (!token) throw new Error(NOT_AUTHORIZED);

  const url = new URL(`https://api.trello.com/1${path}`);
  url.searchParams.set("key", APP_KEY);
  url.searchParams.set("token", token);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), { method });

  if (res.status === 401) {
    // Token revoked/invalid: clear it so the UI asks the member to reconnect.
    await clearToken(t);
    throw new Error(NOT_AUTHORIZED);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Trello API error ${res.status}: ${text || res.statusText}`);
  }
  return res.status === 204 ? null : res.json();
}

/** Posts a comment on a card as the authorized member. */
export function postCardComment(t, cardId, text) {
  return apiFetch(t, `/cards/${cardId}/actions/comments`, {
    method: "POST",
    params: { text },
  });
}

export function disconnectMember(t) {
  return clearToken(t);
}
