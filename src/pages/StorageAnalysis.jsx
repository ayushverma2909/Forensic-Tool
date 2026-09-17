import React from "react";
import TechnicalDetails, { Tooltip } from "../components/ui/TechnicalDetails";

const segments = [
  { label: "Used Space", value: 318, tone: "bg-forensic-blue" },
  { label: "Free Space", value: 96, tone: "bg-base-raised border border-border-light" },
  { label: "Unallocated", value: 72, tone: "bg-warn" },
  { label: "Deleted (recoverable)", value: 14.7, tone: "bg-crit" },
];
const total = segments.reduce((s, x) => s + x.value, 0);

export default function StorageAnalysis() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-ink">Storage &amp; Filesystem Analysis</h1>
        <p className="mt-1 text-sm text-ink-dim">Visual disk map and NTFS metadata structures for /dev/sda.</p>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <h2 className="text-sm font-semibold text-ink">Disk Map</h2>
        <div className="mt-4 flex h-8 w-full overflow-hidden rounded-md border border-border-light">
          {segments.map((s) => (
            <div key={s.label} className={s.tone} style={{ width: `${(s.value / total) * 100}%` }} title={s.label} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {segments.map((s) => (
            <div key={s.label} className="rounded-md border border-border-light bg-base-raised px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-ink-dim">
                <span className={`h-2 w-2 rounded-full ${s.tone.split(" ")[0]}`} />
                {s.label}
              </div>
              <div className="mt-1 font-mono text-sm text-ink">{s.value} GB</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <h2 className="text-sm font-semibold text-ink">
          Filesystem Metadata — <span className="font-mono text-forensic-cyan">NTFS</span>
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">
              <Tooltip text="Master File Table — NTFS metadata structure containing file and directory records.">MFT Entries</Tooltip>
            </div>
            <div className="mt-1 font-mono text-ink">238,491</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">Deleted Entries</div>
            <div className="mt-1 font-mono text-crit">4,281</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">Recoverable Entries</div>
            <div className="mt-1 font-mono text-success">1,927</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">
              <Tooltip text="USN Journal — NTFS change log recording recent file and directory modifications.">USN Journal Records</Tooltip>
            </div>
            <div className="mt-1 font-mono text-ink">92,431</div>
          </div>
        </div>
      </div>

      <TechnicalDetails title="How storage analysis works">
        <p>
          The filesystem parser walks the Master File Table to enumerate active and deleted directory
          entries, cross-references the USN Journal for recent change history, and maps unallocated
          clusters that may still contain remnants of previously deleted files.
        </p>
      </TechnicalDetails>
    </div>
  );
}
