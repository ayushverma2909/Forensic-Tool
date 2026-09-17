import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/ui/StatusBadge";
import { Lock, ListX } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";

const levels = ["ALL", "INFO", "WARNING", "SUCCESS", "ERROR"];

const seedLog = [
  { id: -5, time: "14:02:11", user: "Demo Investigator", action: "Case Created", target: "CF-2026-001", result: "SUCCESS", level: "SUCCESS", hash: "—" },
  { id: -4, time: "14:04:32", user: "Demo Investigator", action: "Device Detected", target: "/dev/sda", result: "SUCCESS", level: "SUCCESS", hash: "—" },
  { id: -3, time: "14:07:18", user: "Demo Investigator", action: "Evidence Acquired", target: "disk01.E01", result: "SUCCESS", level: "SUCCESS", hash: "b3e78a12…22a" },
  { id: -2, time: "14:15:47", user: "Demo Investigator", action: "Forensic Scan", target: "/dev/sda", result: "COMPLETED", level: "SUCCESS", hash: "—" },
  { id: -1, time: "14:23:31", user: "Demo Investigator", action: "Recovery", target: "17 files", result: "SUCCESS", level: "SUCCESS", hash: "—" },
];

export default function AuditLogs() {
  const { auditLog } = useApp();
  const [level, setLevel] = useState("ALL");
  const combined = [...auditLog, ...seedLog];
  const visible = level === "ALL" ? combined : combined.filter((l) => l.level === level);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink">Evidence Audit Log</h1>
          <p className="mt-1 text-sm text-ink-dim">Immutable record of all operations performed within this case.</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-border-light px-2.5 py-1.5 text-[11px] text-ink-faint">
          <Lock size={12} /> Append-only
        </div>
      </div>

      <div className="flex gap-2">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${level === l ? "border-forensic-cyan/50 bg-forensic-cyan/10 text-forensic-cyan" : "border-border-light text-ink-dim hover:bg-base-raised"}`}
          >
            {l}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={ListX} title="No entries at this level" message="Try selecting a different severity filter." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-base-panel">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-ink-faint">
                <th className="px-4 py-2.5 font-medium">Timestamp</th>
                <th className="px-4 py-2.5 font-medium">User</th>
                <th className="px-4 py-2.5 font-medium">Action</th>
                <th className="px-4 py-2.5 font-medium">Target</th>
                <th className="px-4 py-2.5 font-medium">Result</th>
                <th className="px-4 py-2.5 font-medium">Hash</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id} className="border-b border-border font-mono last:border-0 hover:bg-base-raised">
                  <td className="px-4 py-2.5 text-ink-dim">{l.time}</td>
                  <td className="px-4 py-2.5 text-ink-dim">{l.user}</td>
                  <td className="px-4 py-2.5 text-ink">{l.action}</td>
                  <td className="px-4 py-2.5 text-ink-dim">{l.target}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={l.result} /></td>
                  <td className="px-4 py-2.5 text-ink-faint">{l.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
