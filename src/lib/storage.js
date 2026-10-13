// Persistence for mention groups.
//
// Groups are stored in Trello's *board-shared* Power-Up storage so every board
// member sees the same groups: t.set('board', 'shared', 'groups', data).
//
// IMPORTANT: Trello limits each scope/visibility to 4096 characters in total.
// To fit as many groups as possible we store a compact array and keep only
// member IDs (names/avatars are looked up live from the board).
//   stored: { v: 1, g: [[id, name, [memberId, ...], createdAt], ...] }
// That is roughly 140 member slots across all groups on a board.

const KEY = "groups";
const MAX_CHARS = 4000; // headroom under Trello's 4096 limit

export const MAX_NAME_LENGTH = 50;

export class StorageLimitError extends Error {
  constructor() {
    super("Trello's Power-Up storage is full for this board. Delete a group or remove some members and try again.");
    this.name = "StorageLimitError";
  }
}

const newId = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);

function decode(raw) {
  if (!raw || !Array.isArray(raw.g)) return [];
  return raw.g.map(([id, name, memberIds, createdAt]) => ({ id, name, memberIds: memberIds || [], createdAt }));
}

function encode(groups) {
  return { v: 1, g: groups.map((g) => [g.id, g.name, g.memberIds, g.createdAt]) };
}

export async function loadGroups(t) {
  return decode(await t.get("board", "shared", KEY));
}

async function persist(t, groups) {
  const data = encode(groups);
  if (JSON.stringify(data).length > MAX_CHARS) throw new StorageLimitError();
  await t.set("board", "shared", KEY, data);
  return groups;
}

/** Returns an error string or null. */
export function validateGroup({ name, memberIds }, groups, excludeId = null) {
  const trimmed = (name || "").trim();
  if (!trimmed) return "Enter a group name.";
  if (trimmed.length > MAX_NAME_LENGTH) return `Group name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  const clash = groups.some((g) => g.id !== excludeId && g.name.toLowerCase() === trimmed.toLowerCase());
  if (clash) return "A group with this name already exists.";
  if (!memberIds || memberIds.length === 0) return "Select at least one member.";
  return null;
}

// Always re-read before writing so two people editing at once don't overwrite each other's changes.

export async function createGroup(t, { name, memberIds }) {
  const groups = await loadGroups(t);
  const err = validateGroup({ name, memberIds }, groups);
  if (err) throw new Error(err);
  const group = { id: newId(), name: name.trim(), memberIds: [...new Set(memberIds)], createdAt: Date.now() };
  await persist(t, [...groups, group]);
  return group;
}

export async function updateGroup(t, id, { name, memberIds }) {
  const groups = await loadGroups(t);
  const err = validateGroup({ name, memberIds }, groups, id);
  if (err) throw new Error(err);
  const next = groups.map((g) => (g.id === id ? { ...g, name: name.trim(), memberIds: [...new Set(memberIds)] } : g));
  await persist(t, next);
  return next.find((g) => g.id === id);
}

export async function deleteGroup(t, id) {
  const groups = await loadGroups(t);
  await persist(t, groups.filter((g) => g.id !== id));
}

export async function duplicateGroup(t, id) {
  const groups = await loadGroups(t);
  const src = groups.find((g) => g.id === id);
  if (!src) throw new Error("Group not found.");
  let name = `${src.name} (Copy)`.slice(0, MAX_NAME_LENGTH);
  let n = 2;
  while (groups.some((g) => g.name.toLowerCase() === name.toLowerCase())) {
    const suffix = ` (Copy ${n++})`;
    name = `${src.name.slice(0, MAX_NAME_LENGTH - suffix.length)}${suffix}`;
  }
  const copy = { id: newId(), name, memberIds: [...src.memberIds], createdAt: Date.now() };
  await persist(t, [...groups, copy]);
  return copy;
}
