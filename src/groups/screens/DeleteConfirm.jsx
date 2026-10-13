import React, { useState } from "react";
import { SpinnerIcon } from "../../lib/icons.jsx";

export default function DeleteConfirm({ group, onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="mg-screen mg-confirm">
      <h2>Delete “{group.name}”?</h2>
      <p>This removes the group for everyone on this board. The members stay on the board and nothing already posted is changed.</p>
      <div className="mg-form__actions">
        <button type="button" className="mg-btn mg-btn--danger" disabled={busy} onClick={async () => { setBusy(true); await onConfirm(); }}>
          {busy ? <SpinnerIcon /> : null}Delete Group
        </button>
        <button type="button" className="mg-btn mg-btn--secondary" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </div>
  );
}
