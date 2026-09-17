import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { devices, mockHash } from "../data/devices";
import ProgressBar from "../components/ui/ProgressBar";
import StatusBadge from "../components/ui/StatusBadge";
import HashDisplay from "../components/ui/HashDisplay";
import { CheckCircle2 } from "lucide-react";

const stages = [
  "Initializing acquisition",
  "Reading device metadata",
  "Creating forensic image",
  "Calculating SHA-256",
  "Verifying image",
  "Finalizing evidence",
];

export default function EvidenceAcquisition() {
  const { caseData, acquisition, setAcquisition, logAudit, pushToast } = useApp();
  const [deviceId, setDeviceId] = useState(devices[0].id);
  const device = devices.find((d) => d.id === deviceId);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const start = () => {
    if (!device) {
      pushToast("No device selected.", "error");
      return;
    }
    if (!caseData) {
      pushToast("No active case. Initialize a case before starting acquisition.", "error");
      return;
    }
    setAcquisition({ status: "RUNNING", progress: 0, stage: 0 });
    logAudit("Evidence Acquisition Started", device.path, "RUNNING", "INFO");
    let progress = 0;
    timer.current = setInterval(() => {
      progress += 4;
      const stage = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
      if (progress >= 100) {
        clearInterval(timer.current);
        const hash = mockHash(device.id + "img");
        setAcquisition({ status: "COMPLETED", progress: 100, stage: stages.length - 1, hash, image: "disk01.E01", size: "476.8 GB" });
        logAudit("Evidence Acquired", "disk01.E01", "SUCCESS", "SUCCESS", hash.slice(0, 16) + "…");
        pushToast("Forensic image acquisition complete.", "success");
      } else {
        setAcquisition({ status: "RUNNING", progress, stage });
      }
    }, 180);
  };

  const cancel = () => {
    clearInterval(timer.current);
    setAcquisition({ status: "IDLE" });
    logAudit("Evidence Acquisition Cancelled", device?.path || "—", "CANCELLED", "WARNING");
    pushToast("Acquisition cancelled.", "warn");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-lg font-semibold text-ink">Evidence Acquisition</h1>
      <p className="mt-1 text-sm text-ink-dim">Create a forensic image of the selected device with hash verification.</p>
      {!caseData && (
        <p className="mt-2 text-xs text-warn">No active case — acquisition metadata will not be linked to a case record.</p>
      )}

      <div className="mt-5 rounded-lg border border-border bg-base-panel p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-dim">Selected Device</span>
            <select
              className="w-full rounded-md border border-border-light bg-base-raised px-3 py-2 text-sm text-ink focus:border-forensic-cyan/50 focus:outline-none"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              disabled={acquisition.status === "RUNNING"}
            >
              {devices.map((d) => <option key={d.id} value={d.id}>{d.path} — {d.model}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-ink-dim">Acquisition Method</span>
            <select className="w-full rounded-md border border-border-light bg-base-raised px-3 py-2 text-sm text-ink" disabled defaultValue="Physical Acquisition">
              <option>Physical Acquisition</option>
            </select>
          </label>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
          <div className="rounded-md border border-border-light bg-base-raised px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">Destination Image</div>
            <div className="mt-1 font-mono text-ink">/evidence/{caseData?.id || "CF-2026-001"}/disk01.E01</div>
          </div>
          <div className="rounded-md border border-border-light bg-base-raised px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">Image Format / Hash / Verification</div>
            <div className="mt-1 text-ink">E01 · SHA-256 · Enabled</div>
          </div>
        </div>

        {acquisition.status !== "RUNNING" && acquisition.status !== "COMPLETED" && (
          <div className="mt-5 flex gap-2">
            <button onClick={start} className="rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90">
              Start Acquisition
            </button>
          </div>
        )}

        {acquisition.status === "RUNNING" && (
          <div className="mt-5">
            <ProgressBar value={acquisition.progress} tone="cyan" label={stages[acquisition.stage]} />
            <div className="mt-4 flex justify-end">
              <button onClick={cancel} className="rounded-md border border-border-light px-3.5 py-1.5 text-xs font-medium text-ink-dim hover:bg-base-raised">
                Cancel
              </button>
            </div>
          </div>
        )}

        {acquisition.status === "COMPLETED" && (
          <div className="mt-5 rounded-md border border-success/30 bg-success/5 p-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 size={16} />
              <span className="text-sm font-semibold tracking-wide">ACQUISITION COMPLETE</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint">Image</div>
                <div className="mt-1 font-mono text-ink">{acquisition.image}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint">Size</div>
                <div className="mt-1 text-ink">{acquisition.size}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint">Verification</div>
                <div className="mt-1"><StatusBadge status="PASS" /></div>
              </div>
            </div>
            <div className="mt-3">
              <HashDisplay hash={acquisition.hash} verified />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
