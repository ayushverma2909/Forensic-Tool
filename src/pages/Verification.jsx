import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { devices } from "../data/devices";
import { sanitizationMethods } from "../data/mockCase";
import StatusBadge from "../components/ui/StatusBadge";
import { ShieldCheck, Download } from "lucide-react";

const checks = [
  ["Filesystem remnants", "PASS"],
  ["Partition metadata", "PASS"],
  ["File signatures", "0 detected"],
  ["Recoverable file records", "0 detected"],
  ["Random sector verification", "PASS"],
];

export default function Verification() {
  const { sanitization, setSanitization, certificate, setCertificate, caseData, logAudit, pushToast, navigate } = useApp();
  const [running, setRunning] = useState(false);
  const target = devices.find((d) => d.id === (sanitization.targetId || "dev-sdb"));
  const method = sanitizationMethods.find((m) => m.id === (sanitization.methodId || "single-pass"));

  const run = () => {
    setRunning(true);
    setSanitization((s) => ({ ...s, status: "VERIFYING" }));
    setTimeout(() => {
      setSanitization((s) => ({ ...s, status: "VERIFIED" }));
      setRunning(false);
      logAudit("Verification", target.path, "PASSED", "SUCCESS");
      pushToast("No recoverable artifacts detected by the configured verification scan.", "success");
    }, 1600);
  };

  const generateCertificate = () => {
    const cert = {
      id: "SAN-2026-00041",
      caseId: caseData?.id || "CF-2026-001",
      device: target.path,
      model: target.model,
      capacity: target.capacity,
      method: method.name,
      verification: "PASSED",
      started: "2026-09-16 14:10",
      completed: "2026-09-16 14:18",
      operator: "Demo Investigator",
    };
    setCertificate(cert);
    logAudit("Certificate Generated", cert.id, "SUCCESS");
    pushToast("Sanitization certificate generated.", "success");
  };

  const verified = sanitization.status === "VERIFIED";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-ink">Post-Sanitization Verification</h1>
        <p className="mt-1 text-sm text-ink-dim">Confirms no recoverable artifacts remain on {target.path} after sanitization.</p>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        {sanitization.status !== "COMPLETED" && sanitization.status !== "VERIFYING" && sanitization.status !== "VERIFIED" ? (
          <p className="text-xs text-ink-dim">Run a sanitization operation before verification.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {checks.map(([label, val]) => (
                <div key={label} className="flex items-center justify-between rounded-md border border-border-light bg-base-raised px-3 py-2 text-xs">
                  <span className="text-ink-dim">{label}</span>
                  <span className={val === "PASS" ? "font-mono text-success" : "font-mono text-success"}>{val}</span>
                </div>
              ))}
            </div>

            {!verified ? (
              <button onClick={run} disabled={running} className="mt-4 rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90 disabled:opacity-50">
                {running ? "Running verification scan…" : "Run Verification Scan"}
              </button>
            ) : (
              <div className="mt-5 rounded-md border border-success/30 bg-success/5 p-5 text-center">
                <ShieldCheck size={22} className="mx-auto text-success" />
                <div className="mt-2 text-sm font-semibold tracking-wide text-success">SANITIZATION VERIFIED</div>
                <p className="mt-1 text-xs text-ink-dim">No recoverable artifacts detected by the configured verification scan.</p>
              </div>
            )}
          </>
        )}
      </div>

      {verified && (
        <div className="rounded-lg border border-border bg-base-panel p-5">
          {!certificate ? (
            <button onClick={generateCertificate} className="rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90">
              Generate Sanitization Certificate
            </button>
          ) : (
            <Certificate cert={certificate} />
          )}
        </div>
      )}
    </div>
  );
}

function Certificate({ cert }) {
  const download = () => {
    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cert.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-forensic-cyan/30 bg-gradient-to-b from-base-raised to-base-panel p-6">
      <div className="text-center">
        <div className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">CipherTrace Forensic</div>
        <h2 className="mt-1 text-base font-semibold text-ink">Data Sanitization Certificate</h2>
        <div className="mt-1 font-mono text-xs text-forensic-cyan">{cert.id}</div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
        {[
          ["Case ID", cert.caseId],
          ["Device", cert.device],
          ["Model", cert.model],
          ["Capacity", cert.capacity],
          ["Method", cert.method],
          ["Verification", <StatusBadge key="v" status={cert.verification} />],
          ["Started", cert.started],
          ["Completed", cert.completed],
          ["Operator", cert.operator],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">{k}</div>
            <div className="mt-0.5 text-ink">{v}</div>
          </div>
        ))}
      </div>
      <button onClick={download} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-border-light py-2 text-xs font-medium text-ink hover:bg-base-raised">
        <Download size={13} /> Export Certificate
      </button>
    </div>
  );
}
