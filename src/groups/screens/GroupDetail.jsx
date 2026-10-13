import React from "react";
import { PlusIcon, CloseIcon, EditIcon, CopyIcon, TrashIcon, ChevronRightIcon, UsersIcon } from "../../lib/icons.jsx";
import { resolveMembers } from "../../lib/members.js";
import { Avatar } from "../components/Avatar.jsx";
import ScreenHeader from "../components/ScreenHeader.jsx";
import { plural } from "../components/groupTheme.js";

export default function GroupDetail({ group, membersById, onBack, onEdit, onAddMembers, onRemoveMember, onDuplicate, onDelete }) {
  const members = resolveMembers(group, membersById);
  const hidden = group.memberIds.length - members.length;

  return (
    <div className="mg-screen">
      <ScreenHeader
        title={group.name}
        subtitle={plural(members.length, "member")}
        onBack={onBack}
        action={<button type="button" className="mg-btn mg-btn--secondary mg-btn--sm" onClick={onEdit}><EditIcon width={14} height={14} /> Edit</button>}
      />

      <div className="mg-banner">
        <UsersIcon width={18} height={18} />
        <span>On any card, choose <b>Mention Group</b> → <b>{group.name}</b> to notify all {members.length} {members.length === 1 ? "member" : "members"}.</span>
      </div>

      <div className="mg-section-head">
        <h3>Members ({members.length})</h3>
        <button type="button" className="mg-btn mg-btn--secondary mg-btn--sm" onClick={onAddMembers}><PlusIcon width={14} height={14} /> Add Members</button>
      </div>
      <div className="mg-members">
        {members.map((m) => (
          <div key={m.id} className="mg-member">
            <Avatar member={m} size="lg" />
            <span className="mg-member__name">{m.fullName}</span>
            <button type="button" className="mg-icon-btn" aria-label={`Remove ${m.fullName}`} onClick={() => onRemoveMember(m.id)}>
              <CloseIcon width={15} height={15} />
            </button>
          </div>
        ))}
      </div>
      {hidden > 0 && <p className="mg-note">{plural(hidden, "former member")} no longer on this board {hidden === 1 ? "is" : "are"} hidden.</p>}

      <h3 style={{ fontSize: 14, fontWeight: 700 }}>Group Actions</h3>
      <div className="mg-actions">
        <button type="button" className="mg-action" onClick={onEdit}><EditIcon /><span>Edit Group</span><ChevronRightIcon /></button>
        <button type="button" className="mg-action" onClick={onDuplicate}><CopyIcon /><span>Duplicate Group</span><ChevronRightIcon /></button>
        <button type="button" className="mg-action mg-action--danger" onClick={onDelete}><TrashIcon /><span>Delete Group</span><ChevronRightIcon /></button>
      </div>
    </div>
  );
}
