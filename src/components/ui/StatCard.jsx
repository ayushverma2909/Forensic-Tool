import React from "react";

export default function StatCard({ icon: Icon, label, value, tone = "default", sub }) {
  const toneMap = {
    default: "text-ink",
    cyan: "text-forensic-cyan",
    success: "text-success",
    warn: "text-warn",
    crit: "text-crit",
  };
  return (
    <div className="rounded-lg border border-border bg-base-panel p-4 shadow-panel">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-ink-faint">{label}</span>
        {Icon && <Icon size={15} className="text-ink-faint" strokeWidth={1.75} />}
      </div>
      <div className={`mt-2 text-2xl font-semibold tabular ${toneMap[tone]}`}>{value}</div>
      {sub && <div className="mt-1 text-xs text-ink-dim">{sub}</div>}
    </div>
  );
}
