// Helpers for Trello board members.

const AVATAR_COLORS = ["#8270db", "#579dff", "#7f8f9f", "#4bce97", "#e56910", "#ca3521", "#c25100", "#6e5dc6"];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function avatarColor(id) {
  return AVATAR_COLORS[hash(String(id)) % AVATAR_COLORS.length];
}

export function initialsOf(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avatarUrlOf(avatar) {
  if (!avatar) return null;
  // Trello gives a base URL; append a size unless it already points at an image.
  return /\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(avatar) ? avatar : `${avatar}/50.png`;
}

/** Normalised list of members on the current board. */
export async function getBoardMembers(t) {
  const { members = [] } = (await t.board("members")) || {};
  return members
    .map((m) => ({
      id: m.id,
      fullName: m.fullName || m.username || "Unknown",
      username: m.username,
      initials: initialsOf(m.fullName || m.username),
      avatarUrl: avatarUrlOf(m.avatar),
      color: avatarColor(m.id),
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export function memberMap(members) {
  return new Map(members.map((m) => [m.id, m]));
}

/** Resolves a group's stored member ids to current board members (drops people who left the board). */
export function resolveMembers(group, map) {
  return group.memberIds.map((id) => map.get(id)).filter(Boolean);
}
