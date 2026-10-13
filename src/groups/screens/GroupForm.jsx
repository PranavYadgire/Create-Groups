import React, { useState } from "react";
import { MAX_NAME_LENGTH, validateGroup } from "../../lib/storage.js";
import { SpinnerIcon } from "../../lib/icons.jsx";
import MemberPicker from "../components/MemberPicker.jsx";
import ScreenHeader from "../components/ScreenHeader.jsx";

/** Shared by "Create Group" and "Edit Group". */
export default function GroupForm({ mode, initial, members, groups, onSubmit, onCancel, onBack, autoFocusSearch }) {
  const isEdit = mode === "edit";
  const [name, setName] = useState(initial?.name ?? "");
  const [memberIds, setMemberIds] = useState(initial?.memberIds ?? []);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const problem = validateGroup({ name, memberIds }, groups, initial?.id);
    if (problem) return setError(problem);
    setError("");
    setSaving(true);
    try {
      await onSubmit({ name, memberIds });
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
      setSaving(false);
    }
  }

  return (
    <form className="mg-screen" onSubmit={submit} noValidate>
      <ScreenHeader
        title={isEdit ? "Edit Group" : "Create Group"}
        subtitle={isEdit ? "Update the group name or manage members." : "Add a group name and select members from this board."}
        onBack={isEdit ? onBack : undefined}
      />

      <div className="mg-field">
        <label className="mg-label" htmlFor="mg-name">Group name</label>
        <input
          id="mg-name"
          className="mg-input"
          value={name}
          maxLength={MAX_NAME_LENGTH}
          placeholder="e.g. Developers"
          onChange={(e) => { setName(e.target.value); setError(""); }}
          autoFocus={!autoFocusSearch}
        />
        <div className="mg-counter">{name.length}/{MAX_NAME_LENGTH}</div>
      </div>

      <div className="mg-field">
        <span className="mg-label">Select members ({memberIds.length})</span>
        <MemberPicker members={members} selectedIds={memberIds} onChange={(ids) => { setMemberIds(ids); setError(""); }} autoFocusSearch={autoFocusSearch} />
      </div>

      {error && <div className="mg-error" role="alert">{error}</div>}

      <div className="mg-form__actions">
        <button type="submit" className="mg-btn mg-btn--primary" disabled={saving}>
          {saving ? <SpinnerIcon /> : null}{isEdit ? "Save Changes" : "Create Group"}
        </button>
        <button type="button" className="mg-btn mg-btn--secondary" onClick={onCancel} disabled={saving}>Cancel</button>
      </div>
    </form>
  );
}
