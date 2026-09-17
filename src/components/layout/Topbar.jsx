import React from "react";
import { useApp } from "../../context/AppContext";
import { Wifi, User, Layers } from "lucide-react";

const crumbs = {
  dashboard: "Dashboard",
  "case-init": "Case Initialization",
  "system-detection": "System & Storage Detection",
  "evidence-acquisition": "Evidence Acquisition",
  "storage-analysis": "Storage & Filesystem Analysis",
  "file-recovery": "Advanced Forensic Scan",
  "recovered-files": "Recoverable Evidence",
  sanitization: "Secure Data Sanitization",
  verification: "Post-Sanitization Verification",
  report: "Forensic Investigation Report",
  "audit-log": "Evidence Audit Log",
  settings: "Settings & Architecture",
  methodology: "Forensic Methodology",
};

export default function Topbar() {
  const { page, caseData, demoMode } = useApp();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-base-panel px-5">
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-semibold text-ink">CIPHERTRACE FORENSIC</span>
        <span className="text-border-light">/</span>
        <span className="text-[13px] text-ink-dim">{crumbs[page] || "—"}</span>
      </div>

      <div className="flex items-center gap-5 text-xs text-ink-dim">
        <div className="flex items-center gap-1.5">
          <Layers size={13} className="text-ink-faint" />
          <span>Case: <span className="font-mono text-ink">{caseData?.id || "—"}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi size={13} className="text-success" />
          <span>System: <span className="text-success">ONLINE</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Mode:</span>
          <span className={`font-mono ${demoMode ? "text-warn" : "text-ink-dim"}`}>{demoMode ? "DEMO" : "STANDARD"}</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-border pl-5">
          <User size={13} className="text-ink-faint" />
          <span className="text-ink">{caseData?.investigator || "Demo Investigator"}</span>
        </div>
      </div>
    </header>
  );
}
