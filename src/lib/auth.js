// Single source of truth for the member's Trello authentication token.
//
// The token lives in Trello's member-scoped private plugin storage
// (t.set('member', 'private', 'token', token)). Only that member can read it;
// it is never put in localStorage or sent to any server other than api.trello.com.
//
// Why does Mention Groups need a token at all? Managing groups only uses
// Power-Up storage, but *posting a comment that mentions a group* is a Trello
// REST call made on behalf of the member (so the comment shows their name).

export const APP_KEY = import.meta.env.VITE_TRELLO_APP_KEY;
export const APP_NAME = "Mention Groups";

// Shared message tag validated by public/authorized.js and AuthPopup.jsx
export const AUTH_MESSAGE_SOURCE = "mention-groups-auth";

const TOKEN_KEY = "token";

export function getToken(t) {
  if (!t || typeof t.get !== "function") return Promise.resolve(null);
  return t.get("member", "private", TOKEN_KEY);
}

export function saveToken(t, token) {
  if (!t || typeof t.set !== "function") return Promise.resolve();
  return t.set("member", "private", TOKEN_KEY, token);
}

export function clearToken(t) {
  if (!t || typeof t.remove !== "function") return Promise.resolve();
  return t.remove("member", "private", TOKEN_KEY);
}

export async function isAuthorized(t) {
  return Boolean(await getToken(t));
}

/**
 * Builds the Trello OAuth authorization URL.
 * @param {string} returnUrl full URL of authorized.html on this origin
 */
export function buildAuthorizeUrl(returnUrl) {
  if (!APP_KEY || APP_KEY === "your_trello_app_key_here") {
    console.warn(
      "[Mention Groups] VITE_TRELLO_APP_KEY is not set in .env. Authorization will fail until a valid key is added."
    );
  }
  const params = new URLSearchParams({
    expiration: "never",
    name: APP_NAME,
    scope: "read,write",
    response_type: "token",
    key: APP_KEY || "",
    return_url: returnUrl,
  });
  return `https://trello.com/1/authorize?${params.toString()}`;
}
