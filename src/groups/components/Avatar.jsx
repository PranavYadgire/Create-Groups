import React, { useState } from "react";

export function Avatar({ member, size }) {
  const [broken, setBroken] = useState(false);
  const cls = `mg-avatar${size ? ` mg-avatar--${size}` : ""}`;
  return (
    <span className={cls} style={{ background: member.color }} title={member.fullName}>
      {member.avatarUrl && !broken ? (
        <img src={member.avatarUrl} alt="" onError={() => setBroken(true)} />
      ) : (
        member.initials
      )}
    </span>
  );
}

/** Overlapping avatars, showing at most `max` and a "+N" bubble. */
export function AvatarStack({ members, max = 4 }) {
  const shown = members.slice(0, max);
  const extra = members.length - shown.length;
  return (
    <div className="mg-avatar-stack">
      {shown.map((m) => <Avatar key={m.id} member={m} size="sm" />)}
      {extra > 0 && <span className="mg-avatar mg-avatar--sm mg-avatar--more">+{extra}</span>}
    </div>
  );
}
