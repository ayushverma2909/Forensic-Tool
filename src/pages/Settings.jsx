import React from "react";
import { useApp } from "../context/AppContext";
import { architecturePipeline, pythonModules } from "../data/mockCase";
import { ArrowDown, ShieldAlert } from "lucide-react";

export default function Settings() {
  const { demoMode, setDemoMode, ensureDemoCase, pushToast } = useApp();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-ink">Settings &amp; Architecture</h1>
        <p className="mt-1 text-sm text-ink-dim">Prototype configuration and the intended production architecture.</p>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-ink">Demo Mode</div>
            <p className="mt-0.5 text-xs text-ink-dim">Runs the full workflow with simulated devices, files, and results — no real hardware required.</p>
          </div>
          <button
            onClick={() => {
              const next = !demoMode;
              setDemoMode(next);
              if (next) ensureDemoCase();
              pushToast(next ? "Demo Mode enabled." : "Demo Mode disabled.", "info");
            }}
            className={`relative h-6 w-11 rounded-full transition-colors ${demoMode ? "bg-forensic-cyan" : "bg-base-raised border border-border-light"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${demoMode ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">Future Production Architecture</h2>
        <div className="flex flex-col items-center gap-1.5">
          {architecturePipeline.map((s, i) => (
            <React.Fragment key={s}>
              <div className="w-full max-w-sm rounded-md border border-border-light bg-base-raised px-4 py-2.5 text-center text-xs font-medium text-ink">
                {s}
              </div>
              {i < architecturePipeline.length - 1 && <ArrowDown size={14} className="text-ink-faint" />}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">Frontend (Production)</div>
            <div className="mt-1 text-sm text-ink">Python + Tkinter</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">Backend / Core</div>
            <div className="mt-1 text-sm text-ink">Python</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-[10px] uppercase tracking-wider text-ink-faint">Potential Modules</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pythonModules.map((m) => (
              <span key={m} className="rounded border border-border-light bg-base-raised px-2 py-1 font-mono text-[11px] text-ink-dim">{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink"><ShieldAlert size={15} className="text-warn" /> Authorized Use Only</h2>
        <p className="text-xs leading-relaxed text-ink-dim">
          This software is intended for authorized digital forensic investigation, evidence preservation, data recovery,
          and secure data sanitization. Sanitization operations are destructive and must require explicit target
          confirmation. Evidence should be acquired and analyzed according to applicable forensic procedures.
        </p>
      </div>
    </div>
  );
}
