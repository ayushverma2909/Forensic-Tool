import React from "react";

export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-light bg-base-panel/50 py-14 text-center">
      {Icon && <Icon size={26} className="mb-3 text-ink-faint" strokeWidth={1.5} />}
      <div className="text-sm font-medium text-ink">{title}</div>
      {message && <div className="mt-1 max-w-sm text-xs text-ink-dim">{message}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
