import React from "react";
import { CheckIcon, UsersIcon } from "../../lib/icons.jsx";
import { resolveMembers } from "../../lib/members.js";
import { AvatarStack } from "../components/Avatar.jsx";
import { groupColor, plural } from "../components/groupTheme.js";

const CONFETTI = [
  { l: "18%", t: "26%", c: "#4bce97", r: -30 }, { l: "26%", t: "58%", c: "#f5cd47", r: 20 },
  { l: "14%", t: "46%", c: "#ca3521", r: 55 }, { l: "74%", t: "22%", c: "#579dff", r: 35 },
  { l: "82%", t: "52%", c: "#e56910", r: -20 }, { l: "70%", t: "66%", c: "#4bce97", r: 70 },
];

export default function CreatedSuccess({ group, membersById, onGoToList, onCreateAnother }) {
  const members = resolveMembers(group, membersById);
  return (
    <div className="mg-screen mg-screen--center">
      <div className="mg-success">
        {CONFETTI.map((c, i) => (
          <span key={i} className="mg-confetti" style={{ left: c.l, top: c.t, background: c.c, transform: `rotate(${c.r}deg)` }} />
        ))}
        <div className="mg-success__circle"><CheckIcon width={36} height={36} /></div>
      </div>
      <h2 className="mg-head__title">Group created!</h2>
      <p className="mg-head__sub" style={{ marginTop: -6 }}>
        “{group.name}” group has been created with {plural(members.length, "member")}.
      </p>
      <div className="mg-summary">
        <span className={`mg-tile mg-tile--${groupColor(group.id)}`}><UsersIcon width={18} height={18} /></span>
        <div>
          <div className="mg-gcard__name">{group.name}</div>
          <div className="mg-gcard__count" style={{ marginBottom: 6 }}>{plural(members.length, "member")}</div>
          <AvatarStack members={members} max={4} />
        </div>
      </div>
      <div className="mg-stack">
        <button type="button" className="mg-btn mg-btn--primary mg-btn--block" onClick={onGoToList}>Go to My Groups</button>
        <button type="button" className="mg-btn mg-btn--secondary mg-btn--block" onClick={onCreateAnother}>Create Another</button>
      </div>
    </div>
  );
}
