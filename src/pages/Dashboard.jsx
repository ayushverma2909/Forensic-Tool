import React from "react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import Pipeline from "../components/forensics/Pipeline";
import { devices } from "../data/devices";
import { recoverySummary } from "../data/recoveredFiles";
import { FolderLock, HardDrive, FileSearch2, ShieldOff, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#3FBBD6", "#4C8EDA", "#3ECF8E", "#E5A542", "#5C6A78"];

export default function Dashboard() {
  const { caseData, navigate, scan, sanitization } = useApp();
  const primaryDevice = devices[0];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-ink">Forensic Dashboard</h1>
        <p className="mt-1 text-sm text-ink-dim">
          {caseData ? `Case ${caseData.id} — ${caseData.caseName || "Untitled case"}` : "No active case. Initialize a case to begin."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={FolderLock} label="Case Status" value={caseData ? "Active" : "Not Started"} tone="cyan" />
        <StatCard icon={HardDrive} label="Evidence Devices" value="3" />
        <StatCard icon={FileSearch2} label="Recoverable Files" value="247" tone="success" />
        <StatCard icon={ShieldOff} label="Sanitization Status" value={sanitization.status === "IDLE" ? "Not Started" : sanitization.status} tone={sanitization.status === "VERIFIED" ? "success" : "default"} />
        <StatCard icon={Activity} label="Recovery Progress" value={scan.status === "COMPLETED" ? "Complete" : "Ready"} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-border bg-base-panel p-5">
          <h2 className="text-sm font-semibold text-ink">Evidence Overview</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            {[
              ["Device", primaryDevice.model],
              ["Capacity", primaryDevice.capacity],
              ["Filesystem", primaryDevice.filesystem],
              ["Partition Table", primaryDevice.partitionTable],
              ["Health", primaryDevice.health],
              ["Connection", primaryDevice.connection],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint">{k}</div>
                <div className="mt-1 text-ink">{v}</div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("system-detection")} className="mt-5 text-xs font-medium text-forensic-cyan hover:underline">
            View full device details →
          </button>
        </div>

        <div className="rounded-lg border border-border bg-base-panel p-5">
          <h2 className="text-sm font-semibold text-ink">Recovery Summary</h2>
          <div className="mt-2 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={recoverySummary} dataKey="value" nameKey="name" innerRadius={40} outerRadius={62} paddingAngle={2}>
                  {recoverySummary.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#171C23", border: "1px solid #232B34", borderRadius: 6, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 grid grid-cols-2 gap-1.5 text-[11px]">
            {recoverySummary.map((r, i) => (
              <div key={r.name} className="flex items-center gap-1.5 text-ink-dim">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {r.name} <span className="ml-auto font-mono text-ink">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Investigation Pipeline</h2>
        <Pipeline steps={["Device", "Acquire", "Hash", "Analyze", "Recover", "Validate", "Report"]} activeIndex={caseData ? 0 : -1} />
      </div>
    </div>
  );
}
