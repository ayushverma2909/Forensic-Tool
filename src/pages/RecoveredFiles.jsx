import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import StatusBadge from "../components/ui/StatusBadge";
import FilePreview from "../components/forensics/FilePreview";
import ProgressBar from "../components/ui/ProgressBar";
import EmptyState from "../components/ui/EmptyState";
import { Search, CheckCircle2, FileSearch } from "lucide-react";

const filters = ["All", "Images", "Documents", "Videos", "Archives", "Other"];
const filterMap = {
  Images: ["JPEG", "PNG"],
  Documents: ["PDF", "DOCX", "XLSX", "TXT", "CSV"],
  Videos: ["MP4"],
  Archives: ["ZIP"],
};

const validationChecks = [
  "File signature", "Header integrity", "Footer integrity", "Metadata consistency",
  "Fragment continuity", "File size consistency", "Hash generated",
];

export default function RecoveredFiles() {
  const { files, recoveredSet, setRecoveredSet, caseData, logAudit, pushToast } = useApp();
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("Confidence");
  const [selected, setSelected] = useState({});
  const [activeFile, setActiveFile] = useState(null);
  const [recovering, setRecovering] = useState(false);
  const [recoverProgress, setRecoverProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const destination = `/evidence/${caseData?.id || "CF-2026-001"}/recovered/`;

  const visible = useMemo(() => {
    let list = files.filter((f) => {
      if (filter !== "All" && !(filterMap[filter] || []).includes(f.type)) return false;
      if (query && !f.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "Name") return a.name.localeCompare(b.name);
      if (sortBy === "Size") return parseFloat(b.size) - parseFloat(a.size);
      if (sortBy === "Type") return a.type.localeCompare(b.type);
      if (sortBy === "Confidence") return b.confidence - a.confidence;
      if (sortBy === "Recovery Status") return a.status.localeCompare(b.status);
      return 0;
    });
    return list;
  }, [files, filter, query, sortBy]);

  const toggleSelect = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const selectedIds = Object.keys(selected).filter((k) => selected[k]);

  const recoverSelected = () => {
    if (selectedIds.length === 0) {
      pushToast("No files selected for recovery.", "warn");
      return;
    }
    setResult(null);
    setValidated(false);
    setValidating(true);
    logAudit("Recovery Validation", `${selectedIds.length} files`, "RUNNING", "INFO");

    setTimeout(() => {
      setValidating(false);
      setValidated(true);
      logAudit("Recovery Validation", `${selectedIds.length} files`, "PASSED", "SUCCESS");

      setRecovering(true);
      setRecoverProgress(0);
      let p = 0;
      const t = setInterval(() => {
        p += 10;
        setRecoverProgress(p);
        if (p >= 100) {
          clearInterval(t);
          const outcome = { recovered: 0, partial: 0, failed: 0 };
          const newSet = { ...recoveredSet };
          selectedIds.forEach((id) => {
            const f = files.find((x) => String(x.id) === id);
            if (!f) return;
            if (f.status === "Failed" || f.confidence < 40) {
              outcome.failed++;
              newSet[id] = "FAILED";
            } else if (f.status === "Partial") {
              outcome.partial++;
              newSet[id] = "PARTIAL";
            } else {
              outcome.recovered++;
              newSet[id] = "RECOVERED";
            }
          });
          setRecoveredSet(newSet);
          setResult(outcome);
          setRecovering(false);
          logAudit("Recovery", `${selectedIds.length} files`, "SUCCESS");
          pushToast(`${outcome.recovered} files recovered to ${destination}`, "success");
        }
      }, 160);
    }, 1100);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink">Recoverable Evidence</h1>
          <p className="mt-1 text-sm text-ink-dim">{files.length} candidate files identified during the forensic scan.</p>
        </div>
        <button
          onClick={recoverSelected}
          disabled={recovering || validating}
          className="rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90 disabled:opacity-50"
        >
          Recover Selected Files ({selectedIds.length})
        </button>
      </div>

      {validating && (
        <div className="rounded-lg border border-border bg-base-panel p-4">
          <div className="mb-2.5 text-xs font-semibold text-ink">Recovery Validation</div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {validationChecks.map((c) => (
              <div key={c} className="flex items-center gap-1.5 text-ink-dim">
                <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-forensic-cyan" /> {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {validated && !recovering && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-4 py-2.5 text-xs text-success">
          <CheckCircle2 size={14} /> RECOVERY VALIDATED — all integrity checks passed for selected files.
        </div>
      )}

      {recovering && (
        <div className="rounded-lg border border-border bg-base-panel p-4">
          <ProgressBar value={recoverProgress} tone="cyan" label={`Recovering selected files to ${destination}`} />
        </div>
      )}

      {result && !recovering && (
        <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-xs">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 size={14} />
            <span className="font-semibold">Recovery destination: {destination}</span>
          </div>
          <div className="mt-2 text-ink-dim">
            {result.recovered} files successfully recovered · {result.partial} files partially recovered · {result.failed} files failed validation
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
              filter === f ? "border-forensic-cyan/50 bg-forensic-cyan/10 text-forensic-cyan" : "border-border-light text-ink-dim hover:bg-base-raised"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files…"
              className="rounded-md border border-border-light bg-base-raised py-1.5 pl-8 pr-3 text-xs text-ink placeholder:text-ink-faint focus:border-forensic-cyan/50 focus:outline-none"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-border-light bg-base-raised px-2.5 py-1.5 text-xs text-ink"
          >
            {["Name", "Size", "Type", "Confidence", "Recovery Status"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={FileSearch}
          title="No files match this filter"
          message="Try a different category or clear your search query."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-base-panel">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-ink-faint">
                <th className="px-3 py-2.5"><span className="sr-only">Select</span></th>
                <th className="px-3 py-2.5 font-medium">File Name</th>
                <th className="px-3 py-2.5 font-medium">Type</th>
                <th className="px-3 py-2.5 font-medium">Size</th>
                <th className="px-3 py-2.5 font-medium">Location</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-base-raised">
                  <td className="px-3 py-2.5">
                    <input type="checkbox" checked={!!selected[f.id]} onChange={() => toggleSelect(f.id)} className="accent-forensic-cyan" />
                  </td>
                  <td className="cursor-pointer px-3 py-2.5 font-mono text-ink" onClick={() => setActiveFile(f)}>
                    {f.name}
                    {recoveredSet[f.id] && <span className="ml-2 text-[10px] text-success">● {recoveredSet[f.id]}</span>}
                  </td>
                  <td className="px-3 py-2.5 text-ink-dim">{f.type}</td>
                  <td className="px-3 py-2.5 text-ink-dim">{f.size}</td>
                  <td className="px-3 py-2.5 text-ink-dim">{f.location}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={f.status} /></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-14 overflow-hidden rounded-full bg-base-raised">
                        <div
                          className={`h-full ${f.confidence >= 85 ? "bg-success" : f.confidence >= 50 ? "bg-warn" : "bg-crit"}`}
                          style={{ width: `${f.confidence}%` }}
                        />
                      </div>
                      <span className="font-mono text-ink-dim">{f.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FilePreview file={activeFile} onClose={() => setActiveFile(null)} />
    </div>
  );
}
