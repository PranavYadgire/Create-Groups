import React from "react";

const base = (p) => ({
  width: p.width ?? 16,
  height: p.height ?? 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: p.strokeWidth ?? 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: p.className,
  "aria-hidden": true,
});

export const AtIcon = (p) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
);
export const CloseIcon = (p) => (<svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>);
export const PlusIcon = (p) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const BackIcon = (p) => (<svg {...base(p)}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>);
export const ChevronRightIcon = (p) => (<svg {...base(p)}><path d="m9 18 6-6-6-6" /></svg>);
export const SearchIcon = (p) => (<svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
export const CheckIcon = (p) => (<svg {...base({ strokeWidth: 3, ...p })}><path d="M20 6 9 17l-5-5" /></svg>);
export const MoreIcon = (p) => (
  <svg {...base(p)} fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>
);
export const EditIcon = (p) => (<svg {...base(p)}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>);
export const CopyIcon = (p) => (<svg {...base(p)}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>);
export const TrashIcon = (p) => (<svg {...base(p)}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" /></svg>);
export const UserPlusIcon = (p) => (<svg {...base(p)}><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6" /></svg>);
export const EyeIcon = (p) => (<svg {...base(p)}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>);
export const UsersIcon = (p) => (
  <svg {...base(p)}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8" /></svg>
);
export const BellIcon = (p) => (<svg {...base(p)}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>);
export const SpinnerIcon = ({ width = 16, height = 16, className = "" }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={`mg-spin ${className}`} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
