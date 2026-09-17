import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function HashDisplay({ label = "SHA-256", hash, verified }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(hash).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="rounded-md border border-border bg-base-raised px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-ink-faint">{label}</span>
        {verified && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-success">Verified</span>
        )}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="truncate font-mono text-xs text-ink">{hash}</span>
        <button onClick={handleCopy} className="shrink-0 text-ink-faint hover:text-ink" title="Copy hash">
          {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
        </button>
      </div>
    </div>
  );
}
