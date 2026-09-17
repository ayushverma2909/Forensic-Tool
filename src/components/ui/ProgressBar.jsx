import React from "react";

export default function ProgressBar({ value, tone = "cyan", label, className = "" }) {
  const toneMap = {
    cyan: "bg-forensic-cyan",
    blue: "bg-forensic-blue",
    success: "bg-success",
    warn: "bg-warn",
    crit: "bg-crit",
  };
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-ink-dim">{label}</span>
          <span className="font-mono tabular text-ink">{Math.round(value)}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-raised">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${toneMap[tone]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
