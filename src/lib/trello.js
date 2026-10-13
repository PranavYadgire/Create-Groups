/* global TrelloPowerUp */
// Bootstraps the Trello Power-Up iframe client `t`.
// When the page is opened outside Trello (e.g. `npm run dev`), a mock client
// backed by localStorage + sample board members is returned so the UI can be
// developed and demoed without Trello.

const MOCK_MEMBERS = [
  ["m1", "Surbhi Kumari", "surbhikumari"],
  ["m2", "Rahul Trivedi", "rahultrivedi"],
  ["m3", "Amit Gupta", "amitgupta"],
  ["m4", "Priya Chauhan", "priyachauhan"],
  ["m5", "Neha Sharma", "nehasharma"],
  ["m6", "Deepak Khanna", "deepakkhanna"],
  ["m7", "Pooja Tiwari", "poojatiwari"],
  ["m8", "Arjun Rao", "arjunrao"],
].map(([id, fullName, username]) => ({ id, fullName, username, avatar: null }));

function createMockT() {
  const key = (s, v, k) => `mg_mock_${s}_${v}_${k}`;
  return {
    isMock: true,
    get: (s, v, k) => {
      const raw = localStorage.getItem(key(s, v, k));
      return Promise.resolve(raw ? JSON.parse(raw) : undefined);
    },
    set: (s, v, k, val) => {
      localStorage.setItem(key(s, v, k), JSON.stringify(val));
      return Promise.resolve();
    },
    remove: (s, v, k) => {
      localStorage.removeItem(key(s, v, k));
      return Promise.resolve();
    },
    board: () => Promise.resolve({ members: MOCK_MEMBERS }),
    member: () => Promise.resolve({ id: "m1", fullName: "Surbhi Kumari", username: "surbhikumari" }),
    getContext: () => ({ card: "mock-card", board: "mock-board", theme: undefined }),
    sizeTo: () => Promise.resolve(),
    closePopup: () => console.log("[mock] t.closePopup()"),
  };
}

export function getT() {
  // The Trello CDN script can load even when this page is opened directly in a
  // normal browser tab. In that case iframe() returns a client whose requests
  // wait forever for a Trello parent frame, leaving the UI on its spinner.
  // Only use the real client when embedded inside Trello; direct local/Vercel
  // previews use the mock client and sample members instead.
  const embeddedInParent = window.parent !== window;
  try {
    if (
      embeddedInParent &&
      typeof TrelloPowerUp !== "undefined" &&
      typeof TrelloPowerUp.iframe === "function"
    ) {
      const t = TrelloPowerUp.iframe();
      if (t) return t;
    }
  } catch (e) {
    console.warn("TrelloPowerUp.iframe() not available, using mock client:", e);
  }
  return createMockT();
}

/** Applies Trello's light/dark theme (falls back to the OS setting). */
export function applyTheme(t) {
  let theme;
  try {
    theme = t.getContext && t.getContext().theme;
  } catch (e) {
    /* ignore */
  }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", theme);
}
