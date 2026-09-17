import React from "react";
import { X, Image, FileText, FileArchive, Video, File as FileIcon } from "lucide-react";
import HashDisplay from "../ui/HashDisplay";
import StatusBadge from "../ui/StatusBadge";
import { mockHash } from "../../data/devices";
import { fileHeaderHex } from "../../data/recoveredFiles";

const iconFor = (type) => {
  if (type === "JPEG" || type === "PNG") return Image;
  if (type === "PDF" || type === "DOCX" || type === "TXT" || type === "CSV" || type === "XLSX") return FileText;
  if (type === "ZIP") return FileArchive;
  if (type === "MP4") return Video;
  return FileIcon;
};

function hexBlock(seed) {
  const bytes = mockHash(seed).slice(0, 32).match(/.{1,2}/g) || [];
  const rows = [];
  for (let i = 0; i < bytes.length; i += 8) {
    rows.push({ offset: (i).toString(16).padStart(8, "0"), bytes: bytes.slice(i, i + 8).join(" ").toUpperCase() });
  }
  return rows;
}

export default function FilePreview({ file, onClose }) {
  if (!file) return null;
  const Icon = iconFor(file.type);
  const rows = hexBlock(file.name);
  const confPct = file.confidence;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full max-w-md overflow-y-auto border-l border-border-light bg-base-panel">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2 min-w-0">
            <Icon size={16} className="shrink-0 text-forensic-cyan" />
            <span className="truncate text-sm font-medium text-ink">{file.name}</span>
          </div>
          <button onClick={onClose} className="text-ink-faint hover:text-ink"><X size={16} /></button>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-wider text-ink-faint">File Details</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Row label="File Type" value={file.type} />
              <Row label="File Size" value={file.size} />
              <Row label="Original Path" value={`C:\\Users\\demo\\...\\${file.name}`} mono />
              <Row label="Created" value="2024-01-28 10:18:23" />
              <Row label="Modified" value="2024-02-03 09:41:07" />
              <Row label="Accessed" value="2024-02-03 09:41:07" />
            </div>
          </div>

          <div>
            <div className="mb-2 text-[10px] uppercase tracking-wider text-ink-faint">Recovery Source</div>
            <div className="rounded-md border border-border-light bg-base-raised p-3 text-xs">
              <Row label="Source" value={file.source} />
              <Row label="Sector Range" value={file.sector} mono />
              <Row label="Recovery Method" value="Filesystem Metadata + Signature Carving" />
            </div>
          </div>

          <div>
            <div className="mb-2 text-[10px] uppercase tracking-wider text-ink-faint">Integrity</div>
            <HashDisplay hash={mockHash(file.name)} verified={file.status !== "Failed"} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider text-ink-faint">
              <span>Recovery Confidence</span>
              <span className="font-mono text-ink">{confPct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-raised">
              <div
                className={`h-full rounded-full ${confPct >= 85 ? "bg-success" : confPct >= 50 ? "bg-warn" : "bg-crit"}`}
                style={{ width: `${confPct}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
              {["Metadata", "Header", "Footer", "Fragments", "Filesystem reference"].map((c) => (
                <div key={c} className="flex items-center gap-1.5 text-ink-dim">
                  <span className={confPct >= 50 ? "text-success" : "text-crit"}>{confPct >= 50 ? "✓" : "✕"}</span> {c}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[10px] uppercase tracking-wider text-ink-faint">Preview</div>
            <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-border-light bg-base-raised text-xs text-ink-faint">
              {file.type === "JPEG" || file.type === "PNG" ? "Image preview (simulated)" :
               file.type === "PDF" ? "Document preview (simulated)" :
               file.type === "TXT" || file.type === "CSV" ? "Text content preview (simulated)" :
               "Binary preview unavailable"}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[10px] uppercase tracking-wider text-ink-faint">Hexadecimal Preview</div>
            <div className="rounded-md border border-border-light bg-base-raised p-3 font-mono text-[11px] leading-relaxed text-ink-dim">
              <div className="text-ink-faint">Header: {fileHeaderHex(file.type)}</div>
              {rows.map((r) => (
                <div key={r.offset} className="flex gap-4">
                  <span className="text-ink-faint">{r.offset}</span>
                  <span className="text-ink">{r.bytes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="col-span-2">
      <div className="text-ink-faint">{label}</div>
      <div className={`mt-0.5 truncate text-ink ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
