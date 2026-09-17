import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import ProgressBar from "../components/ui/ProgressBar";
import TechnicalDetails from "../components/ui/TechnicalDetails";
import { signatureCounts } from "../data/recoveredFiles";
import { CheckCircle2 } from "lucide-react";

const modes = ["Quick Scan", "Full Scan", "Deep Signature Scan", "Metadata Analysis", "Custom Scan"];
const modules = [
  "Filesystem metadata", "Deleted file records", "Unallocated space", "File signatures",
  "File headers", "File footers", "Metadata", "Fragment analysis", "Recovery validation",
];
const stages = [
  "Initializing filesystem parser", "Reading metadata", "Enumerating file records",
  "Identifying deleted entries", "Scanning unallocated sectors", "Matching file signatures",
  "Reconstructing fragments", "Validating recovered files", "Generating recovery index",
];

export default function FileRecovery() {
  const { scan, setScan, acquisition, navigate, logAudit, pushToast } = useApp();
  const [mode, setMode] = useState(modes[1]);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    if (acquisition.status !== "COMPLETED") {
      pushToast("No forensic image available. Complete evidence acquisition before scanning.", "error");
      return;
    }
    setScan({ status: "RUNNING", progress: 0, stage: 0 });
    logAudit("Forensic Scan Started", "/dev/sda", "RUNNING", "INFO");
    let progress = 0;
    timer.current = setInterval(() => {
      progress += 2.5;
      const stage = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
      if (progress >= 100) {
        clearInterval(timer.current);
        setScan({ status: "COMPLETED", progress: 100, stage: stages.length - 1 });
        logAudit("Forensic Scan", "/dev/sda", "COMPLETED", "SUCCESS");
        pushToast("Forensic scan complete — 1,624 files recoverable.", "success");
      } else {
        setScan({ status: "RUNNING", progress, stage });
      }
    }, 140);
  };

  const liveScanned = scan.status === "RUNNING" ? (scan.progress / 100) * 67.3 : scan.status === "COMPLETED" ? 67.3 : 0;
  const liveSector = Math.floor((scan.progress || 0) / 100 * 132491832);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-ink">Advanced Forensic Scan</h1>
        <p className="mt-1 text-sm text-ink-dim">Configure and run a signature-aware forensic scan of the acquired image.</p>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              disabled={scan.status === "RUNNING"}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                mode === m ? "border-forensic-cyan/50 bg-forensic-cyan/10 text-forensic-cyan" : "border-border-light text-ink-dim hover:bg-base-raised"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-ink-dim sm:grid-cols-3">
          {modules.map((m) => (
            <div key={m} className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-success" /> {m}
            </div>
          ))}
        </div>

        {scan.status !== "RUNNING" && scan.status !== "COMPLETED" && (
          <>
            {acquisition.status !== "COMPLETED" && (
              <p className="mt-4 text-xs text-warn">Complete Evidence Acquisition first to enable scanning of the forensic image.</p>
            )}
            <button onClick={start} className="mt-3 rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90 disabled:opacity-50" disabled={acquisition.status !== "COMPLETED"}>
              Start Forensic Scan
            </button>
          </>
        )}

        {scan.status === "RUNNING" && (
          <div className="mt-5">
            <ProgressBar value={scan.progress} tone="cyan" label={stages[scan.stage]} />
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <Stat label="Scanned" value={`${liveScanned.toFixed(1)} GB`} />
              <Stat label="Current Sector" value={liveSector.toLocaleString()} />
              <Stat label="Files Analyzed" value={Math.floor((scan.progress / 100) * 238491).toLocaleString()} />
              <Stat label="Signatures Matched" value={Math.floor((scan.progress / 100) * 1927).toLocaleString()} />
            </div>
          </div>
        )}

        {scan.status === "COMPLETED" && (
          <div className="mt-5 rounded-md border border-success/30 bg-success/5 p-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 size={16} />
              <span className="text-sm font-semibold tracking-wide">SCAN COMPLETE</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs sm:grid-cols-5">
              <Stat label="Scanned" value="67.3 GB" />
              <Stat label="Files Analyzed" value="238,491" />
              <Stat label="Deleted Records" value="4,281" />
              <Stat label="Signatures Matched" value="1,927" />
              <Stat label="Recoverable" value="1,624" tone="text-success" />
            </div>
            <button onClick={() => navigate("recovered-files")} className="mt-4 text-xs font-medium text-forensic-cyan hover:underline">
              View recoverable evidence →
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <h2 className="text-sm font-semibold text-ink">File Signature Detection</h2>
        <p className="mt-1 text-xs text-ink-dim">Recovery does not rely on filenames alone — known binary headers identify file types.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {signatureCounts.map((s) => (
            <div key={s.type} className="rounded-md border border-border-light bg-base-raised px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink">{s.type}</span>
                <span className="font-mono text-xs text-forensic-cyan">{s.count}</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-ink-faint">{s.header}</div>
            </div>
          ))}
        </div>
      </div>

      <TechnicalDetails title="How forensic scanning works">
        <ol className="list-decimal space-y-1 pl-4">
          <li>Parse filesystem metadata to enumerate active and deleted directory records.</li>
          <li>Scan unallocated sectors for known file signatures (header/footer carving).</li>
          <li>Reconstruct fragmented files using cluster-chain heuristics.</li>
          <li>Score each candidate on signature validity, metadata consistency, and fragment continuity.</li>
        </ol>
      </TechnicalDetails>
    </div>
  );
}

function Stat({ label, value, tone = "text-ink" }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-ink-faint">{label}</div>
      <div className={`mt-1 font-mono tabular ${tone}`}>{value}</div>
    </div>
  );
}
