import React, { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

export default function TechnicalDetails({ title = "How it works", children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-base-panel">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-medium text-forensic-cyan">
          <Info size={14} />
          {title}
        </span>
        <ChevronDown size={15} className={`text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-border px-4 py-3 text-sm text-ink-dim">{children}</div>}
    </div>
  );
}

export function Tooltip({ text, children }) {
  return (
    <span className="group relative inline-flex items-center border-b border-dotted border-ink-faint cursor-help">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-md border border-border-light bg-base-raised px-2.5 py-2 text-[11px] leading-snug text-ink-dim opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}
