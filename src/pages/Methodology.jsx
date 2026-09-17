import React from "react";
import Pipeline from "../components/forensics/Pipeline";
import { tooltipContent } from "../data/mockCase";
import { Tooltip } from "../components/ui/TechnicalDetails";

const recoveryStages = [
  "Device Detection", "Evidence Acquisition", "Hashing", "Filesystem Analysis",
  "Metadata Analysis", "Deleted Record Analysis", "File Signature Scanning",
  "File Carving", "Recovery Validation", "Reporting",
];
const sanitizationStages = ["Target Identification", "Method Selection", "Sanitization", "Post-Op Verification", "Certificate"];

const glossary = [
  ["MFT", tooltipContent.mft],
  ["Unallocated Space", tooltipContent.unallocated],
  ["File Carving", tooltipContent.carving],
  ["SHA-256", tooltipContent.sha256],
  ["USN Journal", tooltipContent.usn],
];

export default function Methodology() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-ink">Forensic Methodology</h1>
        <p className="mt-1 text-sm text-ink-dim">The system pipeline behind recovery and sanitization operations.</p>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Recovery Pipeline</h2>
        <div className="flex flex-col gap-2">
          {recoveryStages.map((s) => (
            <div key={s} className="rounded-md border border-border-light bg-base-raised px-3 py-2 text-xs text-ink">{s}</div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Sanitization Pipeline</h2>
        <Pipeline steps={sanitizationStages} />
      </div>

      <div className="rounded-lg border border-border bg-base-panel p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink">Glossary</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {glossary.map(([term, def]) => (
            <div key={term} className="rounded-md border border-border-light bg-base-raised p-3 text-xs">
              <div className="font-medium text-forensic-cyan">
                <Tooltip text={def}>{term}</Tooltip>
              </div>
              <p className="mt-1 leading-relaxed text-ink-dim">{def}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
