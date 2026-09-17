import React from "react";

const styles = {
  IDLE: "bg-base-raised text-ink-dim border-border-light",
  RUNNING: "bg-forensic-blue/10 text-forensic-blue border-forensic-blue/30",
  COMPLETED: "bg-success/10 text-success border-success/30",
  VERIFIED: "bg-success/10 text-success border-success/30",
  SUCCESS: "bg-success/10 text-success border-success/30",
  FAILED: "bg-crit/10 text-crit border-crit/30",
  ERROR: "bg-crit/10 text-crit border-crit/30",
  WARNING: "bg-warn/10 text-warn border-warn/30",
  PASS: "bg-success/10 text-success border-success/30",
  PARTIAL: "bg-warn/10 text-warn border-warn/30",
  INFO: "bg-forensic-cyan/10 text-forensic-cyan border-forensic-cyan/30",
  Recoverable: "bg-success/10 text-success border-success/30",
  Partial: "bg-warn/10 text-warn border-warn/30",
  Failed: "bg-crit/10 text-crit border-crit/30",
  "Not Started": "bg-base-raised text-ink-dim border-border-light",
  Active: "bg-forensic-blue/10 text-forensic-blue border-forensic-blue/30",
  Ready: "bg-base-raised text-ink-dim border-border-light",
  Available: "bg-success/10 text-success border-success/30",
  Healthy: "bg-success/10 text-success border-success/30",
};

export default function StatusBadge({ status, className = "" }) {
  const style = styles[status] || "bg-base-raised text-ink-dim border-border-light";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium tracking-wide font-mono ${style} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status === "RUNNING" ? "animate-pulse-dot" : ""} bg-current`} />
      {status}
    </span>
  );
}
