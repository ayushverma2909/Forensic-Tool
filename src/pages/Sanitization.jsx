import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { devices } from "../data/devices";
import { sanitizationMethods } from "../data/mockCase";
import ProgressBar from "../components/ui/ProgressBar";
import StatusBadge from "../components/ui/StatusBadge";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";
import { ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

const steps = ["Select Target", "Choose Method", "Review", "Execute", "Verify"];
const progressStages = ["Preparing device", "Locking target", "Writing overwrite pattern", "Verifying written sectors", "Flushing buffers", "Final verification"];
const SYSTEM_DEVICE_ID = "dev-sda";

export default function Sanitization() {
  const { sanitization, setSanitization, logAudit, pushToast, navigate } = useApp();
  const [step, setStep] = useState(0);
  const [targetId, setTargetId] = useState("dev-sdb");
  const [methodId, setMethodId] = useState(sanitizationMethods[0].id);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetError, setTargetError] = useState("");
  const timer = useRef(null);

  const target = devices.find((d) => d.id === targetId);
  const method = sanitizationMethods.find((m) => m.id === methodId);

  useEffect(() => () => clearInterval(timer.current), []);

  const execute = () => {
    setConfirmOpen(false);
    setStep(3);
    setSanitization({ status: "RUNNING", progress: 0, stage: 0, targetId, methodId });
    logAudit("Sanitization Started", target.path, "RUNNING", "WARNING");
    let p = 0;
    timer.current = setInterval(() => {
      p += 3;
      const stage = Math.min(progressStages.length - 1, Math.floor((p / 100) * progressStages.length));
      if (p >= 100) {
        clearInterval(timer.current);
        setSanitization({ status: "COMPLETED", progress: 100, stage, targetId, methodId });
        logAudit("Sanitization", target.path, "COMPLETED", "SUCCESS");
        pushToast("Sanitization complete. Proceed to verification.", "success");
        setStep(4);
      } else {
        setSanitization({ status: "RUNNING", progress: p, stage, targetId, methodId });
      }
    }, 150);
  };

  const selectTarget = (id) => {
    if (id === SYSTEM_DEVICE_ID) {
      setTargetError("System/evidence device cannot be selected as a sanitization target.");
      return;
    }
    setTargetError("");
    setTargetId(id);
  };

  const requestBegin = () => {
    if (!confirmed) {
      pushToast("Sanitization target not confirmed.", "warn");
      return;
    }
    setConfirmOpen(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-ink">Secure Data Sanitization</h1>
        <p className="mt-1 text-sm text-ink-dim">Configure, execute, and verify secure erasure of a target device.</p>
      </div>

      <div className="flex items-start gap-2.5 rounded-md border border-crit/25 bg-crit/5 px-3.5 py-3 text-xs text-crit">
        <ShieldAlert size={15} className="mt-0.5 shrink-0" />
        Sanitization permanently destroys data. Verify the selected target before continuing.
      </div>

      <div className="flex flex-wrap gap-1.5">
        {steps.map((s, i) => (
          <div key={s} className={`rounded-md border px-3 py-1.5 text-[11px] font-medium ${i === step ? "border-forensic-cyan/50 bg-forensic-cyan/10 text-forensic-cyan" : i < step ? "border-success/30 bg-success/5 text-success" : "border-border-light text-ink-faint"}`}>
            {i + 1}. {s}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="rounded-lg border border-border bg-base-panel p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Select Target Device</h2>
          <div className="flex flex-col gap-2">
            {devices.map((d) => (
              <label key={d.id} className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-2.5 text-xs ${targetId === d.id ? "border-forensic-cyan/50 bg-forensic-cyan/5" : "border-border-light hover:bg-base-raised"} ${d.id === SYSTEM_DEVICE_ID ? "opacity-60" : ""}`}>
                <span className="flex items-center gap-2.5">
                  <input type="radio" name="target" checked={targetId === d.id} onChange={() => selectTarget(d.id)} className="accent-forensic-cyan" />
                  <span className="text-ink">{d.path} — {d.model}</span>
                  {d.id === SYSTEM_DEVICE_ID && <span className="rounded border border-warn/30 bg-warn/10 px-1.5 py-0.5 font-mono text-[10px] text-warn">Evidence Device</span>}
                </span>
                <span className="font-mono text-ink-dim">{d.capacity} · {d.filesystem}</span>
              </label>
            ))}
          </div>
          {targetError && (
            <div className="mt-3 flex items-center gap-2 rounded-md border border-crit/25 bg-crit/5 px-3 py-2 text-xs text-crit">
              <XCircle size={13} /> {targetError}
            </div>
          )}
          <button onClick={() => setStep(1)} className="mt-4 rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90">
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-lg border border-border bg-base-panel p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Choose Sanitization Method</h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {sanitizationMethods.map((m) => (
              <label key={m.id} className={`cursor-pointer rounded-md border p-3 text-xs ${methodId === m.id ? "border-forensic-cyan/50 bg-forensic-cyan/5" : "border-border-light hover:bg-base-raised"}`}>
                <div className="flex items-center gap-2">
                  <input type="radio" name="method" checked={methodId === m.id} onChange={() => setMethodId(m.id)} className="accent-forensic-cyan" />
                  <span className="font-medium text-ink">{m.name}</span>
                </div>
                <p className="mt-1.5 pl-5 text-[11px] leading-relaxed text-ink-faint">{m.description}</p>
                <div className="mt-1.5 pl-5 font-mono text-[10px] text-ink-faint">Passes: {m.passes} · Speed: {m.speed}</div>
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setStep(0)} className="rounded-md border border-border-light px-3.5 py-2 text-xs font-medium text-ink-dim hover:bg-base-raised">Back</button>
            <button onClick={() => setStep(2)} className="rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90">Continue</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-lg border border-border bg-base-panel p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Review Operation</h2>
          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
            <div className="rounded-md border border-border-light bg-base-raised p-3">
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">Target Device</div>
              <div className="mt-1 text-ink">{target.path} — {target.model}</div>
              <div className="mt-0.5 font-mono text-ink-faint">{target.capacity}</div>
            </div>
            <div className="rounded-md border border-border-light bg-base-raised p-3">
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">Method</div>
              <div className="mt-1 text-ink">{method.name}</div>
            </div>
            <div className="sm:col-span-2 rounded-md border border-warn/25 bg-warn/5 p-3 text-warn">
              <div className="text-[10px] uppercase tracking-wider">Expected Effect</div>
              <div className="mt-1">Data will become inaccessible through normal recovery techniques.</div>
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 text-xs text-ink-dim">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="accent-crit" />
            I understand that sanitization is irreversible.
          </label>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setStep(1)} className="rounded-md border border-border-light px-3.5 py-2 text-xs font-medium text-ink-dim hover:bg-base-raised">Back</button>
            <button onClick={requestBegin} disabled={!confirmed} className="rounded-md bg-crit px-4 py-2 text-xs font-semibold text-white hover:bg-crit/90 disabled:cursor-not-allowed disabled:opacity-40">
              Begin Sanitization
            </button>
          </div>

          <ConfirmationDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={execute}
            title="Confirm Sanitization"
            confirmLabel="Sanitize Device"
          >
            You are about to permanently sanitize <strong className="text-ink">{target.path}</strong> ({target.model}, {target.capacity})
            using <strong className="text-ink">{method.name}</strong>. This action cannot be undone. Continue?
          </ConfirmationDialog>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-lg border border-border bg-base-panel p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Sanitization in Progress</h2>
          <ProgressBar value={sanitization.progress || 0} tone="crit" label={progressStages[sanitization.stage || 0]} />
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">Processed</div>
              <div className="mt-1 font-mono text-ink">{((sanitization.progress || 0) / 100 * 64).toFixed(1)} GB / 64 GB</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">Write Verification</div>
              <div className="mt-1"><StatusBadge status="RUNNING" /></div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">Est. Completion</div>
              <div className="mt-1 font-mono text-ink">00:{Math.max(0, 30 - Math.floor((sanitization.progress || 0) / 3.3)).toString().padStart(2, "0")}</div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="rounded-lg border border-success/30 bg-success/5 p-5">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 size={16} />
            <span className="text-sm font-semibold tracking-wide">SANITIZATION COMPLETE</span>
          </div>
          <p className="mt-2 text-xs text-ink-dim">Status: VERIFIED pending post-operation verification scan.</p>
          <button onClick={() => navigate("verification")} className="mt-4 rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90">
            Run Verification →
          </button>
        </div>
      )}

    </div>
  );
}
