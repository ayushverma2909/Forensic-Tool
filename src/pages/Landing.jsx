import React from "react";
import { useApp } from "../context/AppContext";
import { Radar, HardDriveDownload, ShieldCheck, FileBarChart2, Fingerprint } from "lucide-react";

const features = [
  { icon: HardDriveDownload, title: "Advanced Recovery", text: "Filesystem-aware carving reconstructs deleted and fragmented evidence." },
  { icon: ShieldCheck, title: "Secure Sanitization", text: "Configurable overwrite and crypto-erase workflows with post-op verification." },
  { icon: Fingerprint, title: "Forensic Integrity", text: "SHA-256 hashing and chain-of-custody logging at every stage." },
  { icon: FileBarChart2, title: "Evidence Reporting", text: "Court-ready reports, certificates, and immutable audit trails." },
];

export default function Landing() {
  const { navigate, setDemoMode, ensureDemoCase, pushToast } = useApp();

  const enterDemo = () => {
    setDemoMode(true);
    ensureDemoCase();
    pushToast("Demo Mode enabled — case CF-2026-001 loaded with simulated evidence.", "info");
    navigate("dashboard");
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-base px-6">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl border border-forensic-cyan/30 bg-forensic-cyan/10 text-forensic-cyan">
        <Radar size={26} strokeWidth={1.5} />
      </div>

      <h1 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        CipherTrace Forensic
      </h1>
      <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-ink-dim">
        Integrated digital forensics &amp; secure data sanitization platform.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate("case-init")}
          className="rounded-md bg-forensic-cyan px-5 py-2.5 text-sm font-semibold text-base hover:bg-forensic-cyan/90"
        >
          Initialize Case
        </button>
        <button
          onClick={enterDemo}
          className="rounded-md border border-border-light px-5 py-2.5 text-sm font-medium text-ink hover:bg-base-panel"
        >
          Enter Demo Mode
        </button>
      </div>

      <div className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border border-border bg-base-panel p-4">
            <f.icon size={17} className="mb-2 text-forensic-cyan" strokeWidth={1.5} />
            <div className="text-xs font-medium text-ink">{f.title}</div>
            <div className="mt-1 text-[11px] leading-snug text-ink-faint">{f.text}</div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-[11px] text-ink-faint">
        Prototype interface — forensic operations are simulated. · CIPHER SHADOWS
      </p>
    </div>
  );
}
