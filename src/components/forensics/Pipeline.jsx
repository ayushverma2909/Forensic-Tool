import React from "react";
import { ArrowRight } from "lucide-react";

export default function Pipeline({ steps, activeIndex = -1 }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <React.Fragment key={s}>
            <div
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "border-forensic-cyan/50 bg-forensic-cyan/10 text-forensic-cyan"
                  : done
                  ? "border-success/30 bg-success/5 text-success"
                  : "border-border-light bg-base-raised text-ink-dim"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full bg-current ${active ? "animate-pulse-dot" : ""}`} />
              {s}
            </div>
            {i < steps.length - 1 && <ArrowRight size={13} className="text-ink-faint shrink-0" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
