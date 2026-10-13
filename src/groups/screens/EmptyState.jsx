import React from "react";
import { PlusIcon } from "../../lib/icons.jsx";

function Art() {
  return (
    <svg className="mg-empty__art" viewBox="0 0 120 84" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="60" cy="30" r="11" fill="currentColor" fillOpacity=".15" />
      <path d="M38 66c1-12 10-18 22-18s21 6 22 18" fill="currentColor" fillOpacity=".15" />
      <circle cx="30" cy="42" r="8" opacity=".55" />
      <path d="M14 68c.6-9 7-14 16-14" opacity=".55" />
      <circle cx="90" cy="42" r="8" opacity=".55" />
      <path d="M106 68c-.6-9-7-14-16-14" opacity=".55" />
      <path d="M22 18l-5-5M98 18l5-5M60 8V2" opacity=".5" />
    </svg>
  );
}

export default function EmptyState({ onCreate }) {
  return (
    <div className="mg-screen mg-screen--center mg-empty">
      <Art />
      <h2>Create your first mention group</h2>
      <p>Group members together so you can notify them with one mention on a card.</p>
      <button type="button" className="mg-btn mg-btn--primary mg-btn--block" onClick={onCreate}>
        <PlusIcon /> Create Group
      </button>
      <div className="mg-example">
        <span>Example</span>
        <div className="mg-example__row">
          <span className="mg-chip">@Developers</span> → Rahul, Priya, Amit
        </div>
      </div>
    </div>
  );
}
