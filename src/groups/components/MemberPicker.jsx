import React, { useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon } from "../../lib/icons.jsx";
import { Avatar } from "./Avatar.jsx";

export default function MemberPicker({ members, selectedIds, onChange, autoFocusSearch = false }) {
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    if (autoFocusSearch && searchRef.current) searchRef.current.focus();
  }, [autoFocusSearch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.fullName.toLowerCase().includes(q) || (m.username || "").toLowerCase().includes(q));
  }, [members, query]);

  const selected = new Set(selectedIds);
  function toggle(id) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange([...next]);
  }

  return (
    <div className="mg-picker">
      <div className="mg-input-wrap">
        <span className="mg-input-icon"><SearchIcon width={15} height={15} /></span>
        <input
          ref={searchRef}
          className="mg-input mg-input--search"
          placeholder="Search board members…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search board members"
        />
      </div>
      <div className="mg-picker__list" role="group" aria-label="Board members">
        {filtered.map((m) => (
          <label key={m.id} className="mg-pick">
            <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggle(m.id)} />
            <Avatar member={m} size="lg" />
            <span className="mg-pick__name">{m.fullName}</span>
          </label>
        ))}
        {filtered.length === 0 && <p className="mg-picker__empty">No members match “{query}”.</p>}
      </div>
    </div>
  );
}
