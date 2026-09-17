import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

const sources = ["Internal HDD", "External HDD", "SSD", "USB Drive", "Memory Card", "Disk Image", "Other"];
const priorities = ["Low", "Standard", "High", "Critical"];

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-dim">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-border-light bg-base-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-forensic-cyan/50 focus:outline-none";

export default function CaseInitialization() {
  const { setCaseData, navigate, logAudit, pushToast } = useApp();
  const [form, setForm] = useState({
    caseId: "CF-2026-001",
    caseName: "",
    investigator: "Demo Investigator",
    organization: "",
    description: "",
    source: sources[2],
    priority: priorities[1],
    notes: "",
  });
  const [created, setCreated] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();
    setCaseData({ ...form, id: form.caseId, createdAt: timestamp, status: "Ready for acquisition" });
    logAudit("Case Created", form.caseId, "SUCCESS");
    pushToast(`Case ${form.caseId} initialized.`, "success");
    setCreated(true);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-lg font-semibold text-ink">Initialize Forensic Case</h1>
      <p className="mt-1 text-sm text-ink-dim">Create a new case record before beginning acquisition.</p>

      <div className="mt-4 flex items-start gap-2.5 rounded-md border border-warn/25 bg-warn/5 px-3.5 py-3 text-xs text-warn">
        <ShieldAlert size={15} className="mt-0.5 shrink-0" />
        All forensic operations should be performed on authorized evidence only.
      </div>

      {!created ? (
        <form onSubmit={submit} className="mt-5 rounded-lg border border-border bg-base-panel p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Case ID">
              <input className={inputClass} value={form.caseId} onChange={update("caseId")} required />
            </Field>
            <Field label="Case Name">
              <input className={inputClass} placeholder="e.g. Financial Fraud Investigation" value={form.caseName} onChange={update("caseName")} required />
            </Field>
            <Field label="Investigator Name">
              <input className={inputClass} value={form.investigator} onChange={update("investigator")} required />
            </Field>
            <Field label="Organization">
              <input className={inputClass} placeholder="Agency / department" value={form.organization} onChange={update("organization")} />
            </Field>
            <Field label="Evidence Source">
              <select className={inputClass} value={form.source} onChange={update("source")}>
                {sources.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Case Priority">
              <select className={inputClass} value={form.priority} onChange={update("priority")}>
                {priorities.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Evidence Description">
                <textarea className={inputClass} rows={2} placeholder="Brief description of the evidence" value={form.description} onChange={update("description")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Notes">
                <textarea className={inputClass} rows={2} placeholder="Additional notes" value={form.notes} onChange={update("notes")} />
              </Field>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button type="submit" className="rounded-md bg-forensic-cyan px-4 py-2 text-sm font-semibold text-base hover:bg-forensic-cyan/90">
              Create Case
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5 rounded-lg border border-success/30 bg-success/5 p-6">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 size={18} />
            <span className="text-sm font-semibold tracking-wide">CASE INITIALIZED</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">Case ID</div>
              <div className="mt-1 font-mono text-ink">{form.caseId}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">Status</div>
              <div className="mt-1 text-ink">Ready for acquisition</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">Created</div>
              <div className="mt-1 text-ink">{new Date().toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-ink-faint">Investigator</div>
              <div className="mt-1 text-ink">{form.investigator}</div>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <button onClick={() => navigate("dashboard")} className="rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90">
              Go to Dashboard
            </button>
            <button onClick={() => navigate("system-detection")} className="rounded-md border border-border-light px-4 py-2 text-xs font-medium text-ink hover:bg-base-raised">
              Continue to Detection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
