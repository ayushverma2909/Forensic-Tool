import React from "react";
import { useApp } from "../context/AppContext";
import { devices, systemInfo } from "../data/devices";
import StatusBadge from "../components/ui/StatusBadge";
import ForensicTimeline from "../components/forensics/ForensicTimeline";
import { FileDown, Printer, FileJson } from "lucide-react";

function Section({ title, children }) {
  return (
    <div className="rounded-lg border border-border bg-base-panel p-5">
      <h2 className="mb-3 text-sm font-semibold text-ink">{title}</h2>
      {children}
    </div>
  );
}
function Grid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
      {items.map(([k, v]) => (
        <div key={k}>
          <div className="text-[10px] uppercase tracking-wider text-ink-faint">{k}</div>
          <div className="mt-1 text-ink">{v}</div>
        </div>
      ))}
    </div>
  );
}

export default function Report() {
  const { caseData, certificate, pushToast } = useApp();

  const timeline = [
    { action: "Evidence Received", timestamp: "13:58:02", operator: "Demo Investigator", status: "Complete", hash: "—", done: true },
    { action: "Device Identified", timestamp: "14:02:40", operator: "Demo Investigator", status: "Complete", hash: "—", done: true },
    { action: "Evidence Hash Generated", timestamp: "14:05:11", operator: "Demo Investigator", status: "Complete", hash: "a9c4…91f", done: true },
    { action: "Forensic Image Created", timestamp: "14:07:18", operator: "Demo Investigator", status: "Complete", hash: "b3e7…22a", done: true },
    { action: "Image Verified", timestamp: "14:12:44", operator: "Demo Investigator", status: "Complete", hash: "b3e7…22a", done: true },
    { action: "Analysis Performed", timestamp: "14:15:47", operator: "Demo Investigator", status: "Complete", hash: "—", done: true },
    { action: "Artifacts Recovered", timestamp: "14:23:31", operator: "Demo Investigator", status: "17 recovered", hash: "—", done: true },
    { action: "Report Generated", timestamp: "—", operator: "Demo Investigator", status: "Pending", hash: "—", done: false },
  ];

  const exportJson = () => {
    const data = { case: caseData, systemInfo, certificate, generatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${caseData?.id || "CF-2026-001"}_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink">Forensic Investigation Report</h1>
          <p className="mt-1 text-sm text-ink-dim">Consolidated summary for case {caseData?.id || "CF-2026-001"}.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => pushToast("PDF export simulated for prototype.", "info")} className="flex items-center gap-1.5 rounded-md border border-border-light px-3 py-1.5 text-xs font-medium text-ink hover:bg-base-raised">
            <FileDown size={13} /> Export PDF
          </button>
          <button onClick={exportJson} className="flex items-center gap-1.5 rounded-md border border-border-light px-3 py-1.5 text-xs font-medium text-ink hover:bg-base-raised">
            <FileJson size={13} /> Export JSON
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-md bg-forensic-cyan px-3 py-1.5 text-xs font-semibold text-base hover:bg-forensic-cyan/90">
            <Printer size={13} /> Print
          </button>
        </div>
      </div>

      <Section title="Case Information">
        <Grid items={[
          ["Case ID", caseData?.id || "CF-2026-001"],
          ["Investigator", caseData?.investigator || "Demo Investigator"],
          ["Organization", caseData?.organization || "—"],
          ["Date", new Date().toLocaleDateString()],
          ["Evidence Description", caseData?.description || "Digital media examined for deleted evidence and secure sanitization."],
        ]} />
      </Section>

      <Section title="Evidence Summary">
        <Grid items={[["Devices Examined", devices.length], ["Images Created", "1 (disk01.E01)"], ["Hashes Generated", "4"]]} />
      </Section>

      <Section title="System Information">
        <Grid items={[
          ["OS", systemInfo.os], ["Kernel", systemInfo.kernel], ["Architecture", systemInfo.architecture],
          ["Hostname", systemInfo.hostname], ["Storage Devices", devices.length],
        ]} />
      </Section>

      <Section title="Recovery Summary">
        <Grid items={[
          ["Files Analyzed", "238,491"], ["Deleted Files", "4,281"], ["Recoverable Files", "1,624"],
          ["Successfully Recovered", "17"], ["Partially Recovered", "3"], ["Failed Validation", "2"],
        ]} />
      </Section>

      <Section title="Sanitization Summary">
        <Grid items={[
          ["Target Device", certificate?.device || "/dev/sdb"],
          ["Method", certificate?.method || "—"],
          ["Verification Status", certificate ? <StatusBadge status={certificate.verification} /> : <StatusBadge status="Not Started" />],
          ["Certificate ID", certificate?.id || "—"],
        ]} />
      </Section>

      <Section title="Integrity">
        <Grid items={[
          ["Evidence Hash", "a9c4f1e6…91f"], ["Image Hash", "b3e78a12…22a"], ["Recovered File Hashes", "22 hashes generated"],
        ]} />
      </Section>

      <Section title="Evidence Chain of Custody">
        <ForensicTimeline events={timeline} />
      </Section>
    </div>
  );
}
