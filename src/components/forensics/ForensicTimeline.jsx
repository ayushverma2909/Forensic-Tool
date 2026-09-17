import React from "react";
import { Check, Circle } from "lucide-react";

export default function ForensicTimeline({ events }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border-light" />
      <div className="flex flex-col gap-6">
        {events.map((e, i) => (
          <div key={i} className="relative">
            <div
              className={`absolute -left-6 flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
                e.done ? "border-success bg-success/15 text-success" : "border-border-light bg-base-panel text-ink-faint"
              }`}
            >
              {e.done ? <Check size={11} /> : <Circle size={7} className="fill-current" />}
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-sm font-medium text-ink">{e.action}</span>
              <span className="font-mono text-[11px] text-ink-faint">{e.timestamp}</span>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px] text-ink-dim sm:grid-cols-4">
              <span>Operator: <span className="text-ink-dim">{e.operator}</span></span>
              <span>Status: <span className={e.done ? "text-success" : "text-ink-dim"}>{e.status}</span></span>
              <span className="col-span-2 truncate font-mono">Hash: {e.hash}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
