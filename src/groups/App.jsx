import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createGroup, deleteGroup, duplicateGroup, loadGroups, updateGroup } from "../lib/storage.js";
import { getBoardMembers, memberMap, resolveMembers } from "../lib/members.js";
import { SpinnerIcon } from "../lib/icons.jsx";
import EmptyState from "./screens/EmptyState.jsx";
import GroupList from "./screens/GroupList.jsx";
import GroupForm from "./screens/GroupForm.jsx";
import CreatedSuccess from "./screens/CreatedSuccess.jsx";
import GroupDetail from "./screens/GroupDetail.jsx";
import DeleteConfirm from "./screens/DeleteConfirm.jsx";
import Toast from "./components/Toast.jsx";

const HOME = { name: "home" };

export default function App({ t }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [stack, setStack] = useState([HOME]); // simple navigation history
  const [toast, setToast] = useState(null);

  const view = stack[stack.length - 1];
  const membersById = useMemo(() => memberMap(members), [members]);
  const currentGroup = view.id ? groups.find((g) => g.id === view.id) : null;

  const push = (v) => setStack((s) => [...s, v]);
  const pop = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const goHome = () => setStack([HOME]);
  const replace = (v) => setStack((s) => [...s.slice(0, -1), v]);
  const showToast = (message, type = "info") => setToast({ message, type });
  const clearToast = useCallback(() => setToast(null), []);

  // Initial load: groups + board members.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [g, m] = await Promise.all([loadGroups(t), getBoardMembers(t)]);
        if (!cancelled) { setGroups(g); setMembers(m); }
      } catch (e) {
        if (!cancelled) setLoadError(e.message || "Couldn't load groups.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [t]);

  // If the group being viewed disappears (e.g. deleted by a teammate), go back home.
  useEffect(() => {
    if (!loading && view.id && !currentGroup && view.name !== "created") goHome();
  }, [loading, view, currentGroup]);

  // Keep the Trello popup height snug to the content.
  useEffect(() => {
    const id = requestAnimationFrame(() => t.sizeTo && t.sizeTo("#root").catch(() => {}));
    return () => cancelAnimationFrame(id);
  }, [t, stack, groups, loading, toast]);

  async function refresh() {
    setGroups(await loadGroups(t));
  }

  async function guard(fn) {
    try {
      await fn();
    } catch (e) {
      showToast(e.message || "Something went wrong. Try again.", "error");
    }
  }

  // ---------- actions ----------
  async function handleCreate(data) {
    const group = await createGroup(t, data); // throws -> shown inside the form
    await refresh();
    replace({ name: "created", id: group.id });
  }

  async function handleEdit(id, data) {
    await updateGroup(t, id, data); // throws -> shown inside the form
    await refresh();
    showToast("Changes saved");
    pop();
  }

  const handleRemoveMember = (group, memberId) =>
    guard(async () => {
      const remaining = resolveMembers(group, membersById).filter((m) => m.id !== memberId);
      if (remaining.length === 0) throw new Error("A group needs at least one member. Delete the group instead.");
      await updateGroup(t, group.id, { name: group.name, memberIds: remaining.map((m) => m.id) });
      await refresh();
    });

  const handleDuplicate = (group) =>
    guard(async () => {
      const copy = await duplicateGroup(t, group.id);
      await refresh();
      goHome();
      showToast(`Created “${copy.name}”`);
    });

  const handleDelete = (group) =>
    guard(async () => {
      await deleteGroup(t, group.id);
      await refresh();
      goHome();
      showToast(`Deleted “${group.name}”`);
    });

  // ---------- render ----------
  let body;
  if (loading) {
    body = <div className="mg-loading"><SpinnerIcon width={24} height={24} /></div>;
  } else if (loadError) {
    body = <div className="mg-screen"><div className="mg-error">{loadError}</div></div>;
  } else if (view.name === "create") {
    body = (
      <GroupForm
        key="create" mode="create" members={members} groups={groups}
        onSubmit={handleCreate} onCancel={pop}
      />
    );
  } else if (view.name === "created" && currentGroup) {
    body = <CreatedSuccess group={currentGroup} membersById={membersById} onGoToList={goHome} onCreateAnother={() => replace({ name: "create" })} />;
  } else if (view.name === "edit" && currentGroup) {
    body = (
      <GroupForm
        key={`edit-${currentGroup.id}-${view.focusSearch ? "s" : "n"}`} mode="edit" members={members} groups={groups}
        initial={{ id: currentGroup.id, name: currentGroup.name, memberIds: resolveMembers(currentGroup, membersById).map((m) => m.id) }}
        autoFocusSearch={view.focusSearch}
        onSubmit={(data) => handleEdit(currentGroup.id, data)} onCancel={pop} onBack={pop}
      />
    );
  } else if (view.name === "detail" && currentGroup) {
    body = (
      <GroupDetail
        group={currentGroup} membersById={membersById} onBack={pop}
        onEdit={() => push({ name: "edit", id: currentGroup.id })}
        onAddMembers={() => push({ name: "edit", id: currentGroup.id, focusSearch: true })}
        onRemoveMember={(mid) => handleRemoveMember(currentGroup, mid)}
        onDuplicate={() => handleDuplicate(currentGroup)}
        onDelete={() => push({ name: "delete", id: currentGroup.id })}
      />
    );
  } else if (view.name === "delete" && currentGroup) {
    body = <DeleteConfirm group={currentGroup} onCancel={pop} onConfirm={() => handleDelete(currentGroup)} />;
  } else if (groups.length === 0) {
    body = <EmptyState onCreate={() => push({ name: "create" })} />;
  } else {
    body = (
      <GroupList
        groups={groups} membersById={membersById}
        onCreate={() => push({ name: "create" })}
        onOpen={(g) => push({ name: "detail", id: g.id })}
        onEdit={(g) => push({ name: "edit", id: g.id })}
        onAddMembers={(g) => push({ name: "edit", id: g.id, focusSearch: true })}
        onDuplicate={handleDuplicate}
        onDelete={(g) => push({ name: "delete", id: g.id })}
      />
    );
  }

  return (<>{body}<Toast toast={toast} onDone={clearToast} /></>);
}
