import React from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard, FolderPlus, Cpu, HardDrive, ScanSearch, FileSearch, Files,
  ShieldOff, ShieldCheck, FileText, ListOrdered, Settings, BookOpenCheck, Radar,
} from "lucide-react";

const sections = [
  {
    label: "Case",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "case-init", label: "Case Initialization", icon: FolderPlus },
    ],
  },
  {
    label: "Forensics",
    items: [
      { id: "system-detection", label: "System Detection", icon: Cpu },
      { id: "evidence-acquisition", label: "Evidence Acquisition", icon: HardDrive },
      { id: "storage-analysis", label: "Storage Analysis", icon: ScanSearch },
      { id: "file-recovery", label: "File Recovery", icon: FileSearch },
      { id: "recovered-files", label: "Recovered Files", icon: Files },
    ],
  },
  {
    label: "Sanitization",
    items: [
      { id: "sanitization", label: "Secure Erasure", icon: ShieldOff },
      { id: "verification", label: "Verification", icon: ShieldCheck },
    ],
  },
  {
    label: "Reporting",
    items: [
      { id: "report", label: "Forensic Report", icon: FileText },
      { id: "audit-log", label: "Audit Logs", icon: ListOrdered },
    ],
  },
  {
    label: "System",
    items: [
      { id: "settings", label: "Settings", icon: Settings },
      { id: "methodology", label: "Methodology", icon: BookOpenCheck },
    ],
  },
];

export default function Sidebar() {
  const { page, navigate, demoMode } = useApp();

  return (
    <aside className="flex h-full w-[248px] shrink-0 flex-col border-r border-border bg-base-panel">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-forensic-cyan/10 text-forensic-cyan">
          <Radar size={17} strokeWidth={1.75} />
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold tracking-tight text-ink">CipherTrace</div>
          <div className="text-[10px] uppercase tracking-wider text-ink-faint">Forensic Platform</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        {sections.map((section) => (
          <div key={section.label} className="mb-5">
            <div className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
              {section.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = page === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors ${
                      active
                        ? "bg-forensic-cyan/10 text-forensic-cyan"
                        : "text-ink-dim hover:bg-base-raised hover:text-ink"
                    }`}
                  >
                    <Icon size={15} strokeWidth={1.75} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-forensic-cyan" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center justify-between text-[10px] text-ink-faint">
          <span>CIPHER SHADOWS</span>
          {demoMode && <span className="rounded border border-warn/30 bg-warn/10 px-1.5 py-0.5 font-mono text-warn">DEMO</span>}
        </div>
      </div>
    </aside>
  );
}
