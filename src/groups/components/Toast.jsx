import React, { useEffect } from "react";

export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(onDone, 3200);
    return () => clearTimeout(id);
  }, [toast, onDone]);
  if (!toast) return null;
  return (
    <div className={`mg-toast${toast.type === "error" ? " mg-toast--error" : ""}`} role="status">
      {toast.message}
    </div>
  );
}
