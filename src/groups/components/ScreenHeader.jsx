import React from "react";
import { BackIcon } from "../../lib/icons.jsx";

export default function ScreenHeader({ title, subtitle, onBack, action }) {
  return (
    <div className="mg-head">
      {onBack && (
        <button type="button" className="mg-icon-btn mg-head__back" onClick={onBack} aria-label="Back">
          <BackIcon width={18} height={18} />
        </button>
      )}
      <div className="mg-head__main">
        <h2 className="mg-head__title">{title}</h2>
        {subtitle && <p className="mg-head__sub">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
