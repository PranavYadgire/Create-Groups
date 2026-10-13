import React, { useEffect, useRef, useState } from "react";
import { PlusIcon, MoreIcon, UsersIcon, EditIcon, CopyIcon, UserPlusIcon, EyeIcon, TrashIcon } from "../../lib/icons.jsx";
import { resolveMembers } from "../../lib/members.js";
import { AvatarStack } from "../components/Avatar.jsx";
import { groupColor, plural } from "../components/groupTheme.js";

export default function GroupList({ groups, membersById, onCreate, onOpen, onEdit, onAddMembers, onDuplicate, onDelete }) {
  const [menuFor, setMenuFor] = useState(null);
  const listRef = useRef(null);

  // Close the kebab menu on outside click / Escape.
  useEffect(() => {
    if (!menuFor) return undefined;
    const onDown = (e) => { if (!e.target.closest("[data-menu]")) setMenuFor(null); };
    const onKey = (e) => { if (e.key === "Escape") setMenuFor(null); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [menuFor]);

  const run = (fn, g) => () => { setMenuFor(null); fn(g); };

  return (
    <div className="mg-screen">
      <div className="mg-listhead">
        <div className="mg-listhead__copy">
          <h2 className="mg-head__title">My Groups</h2>
          <p className="mg-head__sub">Manage groups of board members you can mention in comments.</p>
        </div>
        <button type="button" className="mg-btn mg-btn--primary mg-btn--sm mg-listhead__create" onClick={onCreate}>
          <PlusIcon width={14} height={14} /> Create Group
        </button>
      </div>

      <div className="mg-list" ref={listRef}>
        {groups.map((g, i) => {
          const members = resolveMembers(g, membersById);
          const openUp = groups.length > 3 && i >= groups.length - 2;
          return (
            <div
              key={g.id}
              className="mg-gcard"
              role="button"
              tabIndex={0}
              aria-label={`Open ${g.name} group details`}
              onClick={() => onOpen(g)}
              onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onOpen(g);
                }
              }}
            >
              <div className="mg-gcard__top">
                <span className={`mg-tile mg-tile--${groupColor(g.id)}`}><UsersIcon width={18} height={18} /></span>
                <div className="mg-gcard__info">
                  <div className="mg-gcard__name">{g.name}</div>
                  <div className="mg-gcard__count">{plural(members.length, "member")}</div>
                </div>
                <span data-menu onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="mg-icon-btn" aria-label={`Actions for ${g.name}`} aria-haspopup="menu" aria-expanded={menuFor === g.id}
                    onClick={() => setMenuFor(menuFor === g.id ? null : g.id)}>
                    <MoreIcon width={18} height={18} />
                  </button>
                  {menuFor === g.id && (
                    <div className={`mg-menu${openUp ? " mg-menu--up" : ""}`} role="menu">
                      <button className="mg-menu__item" role="menuitem" onClick={run(onEdit, g)}><EditIcon /> Edit Group</button>
                      <button className="mg-menu__item" role="menuitem" onClick={run(onDuplicate, g)}><CopyIcon /> Duplicate Group</button>
                      <button className="mg-menu__item" role="menuitem" onClick={run(onAddMembers, g)}><UserPlusIcon /> Add Members</button>
                      <button className="mg-menu__item" role="menuitem" onClick={run(onOpen, g)}><EyeIcon /> View Details</button>
                      <div className="mg-menu__sep" />
                      <button className="mg-menu__item mg-menu__item--danger" role="menuitem" onClick={run(onDelete, g)}><TrashIcon /> Delete Group</button>
                    </div>
                  )}
                </span>
              </div>
              <AvatarStack members={members} max={4} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
