// Builds the comment that mentions a whole group.
//
// Trello only sends notifications for real "@username" mentions of board
// members. A group is not a Trello user, so we expand the group into the
// usernames of its members. The group's name is shown in plain bold text
// (without "@") so it can never accidentally mention an unrelated user.
// To change how the comment looks, edit buildCommentText() only.

export function buildCommentText({ group, members, message, selfId }) {
  const notified = members.filter((m) => m.id !== selfId && m.username);
  const mentions = notified.map((m) => `@${m.username}`).join(" ");
  const parts = [`👥 **${group.name}** ${mentions}`.trim()];
  if (message && message.trim()) parts.push(message.trim());
  return { text: parts.join("\n\n"), notified };
}
