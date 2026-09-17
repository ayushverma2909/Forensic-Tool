import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { devices, systemInfo, mockHash } from "../data/devices";
import StatusBadge from "../components/ui/StatusBadge";
import HashDisplay from "../components/ui/HashDisplay";
import TechnicalDetails, { Tooltip } from "../components/ui/TechnicalDetails";
import { Cpu, MemoryStick, Terminal, Server, Fingerprint, ChevronRight } from "lucide-react";

export default function SystemDetection() {
  const { selectedDeviceId, setSelectedDeviceId, deviceHashes, setDeviceHashes, logAudit, pushToast } = useApp();
  const [hashing, setHashing] = useState(false);
  const device = devices.find((d) => d.id === selectedDeviceId);

  const calculateHash = () => {
    if (!device) return;
    setHashing(true);
    setTimeout(() => {
      const h = mockHash(device.id);
      setDeviceHashes((m) => ({ ...m, [device.id]: h }));
      setHashing(false);
      logAudit("Hash Calculated", device.path, "SUCCESS", "SUCCESS", h.slice(0, 16) + "…");
      pushToast(`SHA-256 hash generated for ${device.path}.`, "success");
    }, 1400);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-ink">System &amp; Storage Detection</h1>
        <p className="mt-1 text-sm text-ink-dim">Automatically detected workstation and attached device information.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          [Terminal, "Operating System", systemInfo.os],
          [Server, "Kernel", systemInfo.kernel],
          [Cpu, "Architecture", systemInfo.architecture],
          [MemoryStick, "RAM", systemInfo.ram],
          [Fingerprint, "Hostname", systemInfo.hostname],
        ].map(([Icon, label, val]) => (
          <div key={label} className="rounded-lg border border-border bg-base-panel p-4">
            <Icon size={15} className="mb-2 text-ink-faint" strokeWidth={1.75} />
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">{label}</div>
            <div className="mt-1 truncate text-sm text-ink">{val}</div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-base-panel">
        <div className="border-b border-border px-4 py-3 text-sm font-semibold text-ink">Detected Storage Devices</div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-ink-faint">
              <th className="px-4 py-2.5 font-medium">Device</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium">Capacity</th>
              <th className="px-4 py-2.5 font-medium">Filesystem</th>
              <th className="px-4 py-2.5 font-medium">Partition</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {devices.map((d) => (
              <tr
                key={d.id}
                onClick={() => setSelectedDeviceId(d.id)}
                className={`cursor-pointer border-b border-border last:border-0 hover:bg-base-raised ${selectedDeviceId === d.id ? "bg-base-raised" : ""}`}
              >
                <td className="px-4 py-3 font-mono text-ink">{d.path} <span className="ml-1 font-sans text-ink-faint">({d.model})</span></td>
                <td className="px-4 py-3 text-ink-dim">{d.type}</td>
                <td className="px-4 py-3 text-ink-dim">{d.capacity}</td>
                <td className="px-4 py-3 text-ink-dim">{d.filesystem}</td>
                <td className="px-4 py-3 text-ink-dim">{d.partitionTable}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 text-right"><ChevronRight size={14} className="inline text-ink-faint" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {device && (
        <div className="rounded-lg border border-border bg-base-panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Device Information — {device.path}</h2>
            <StatusBadge status={device.status} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            {[
              ["Model", device.model],
              ["Serial Number", device.serial],
              ["Device Path", device.path],
              ["Capacity", device.capacity],
              ["Sector Size", device.sectorSize],
              ["Total Sectors", device.totalSectors],
              ["Interface", device.interface],
              ["Media Type", device.type],
              ["Partition Table", device.partitionTable],
              ["Filesystem", device.filesystem],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-[10px] uppercase tracking-wider text-ink-faint">{k}</div>
                <div className="mt-1 font-mono text-ink">{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-2 text-[10px] uppercase tracking-wider text-ink-faint">Partitions</div>
            <div className="flex flex-col gap-2">
              {device.partitions.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-md border border-border-light bg-base-raised px-3 py-2 text-xs">
                  <span className="text-ink">{p.name} <span className="text-ink-faint">— {p.label}</span></span>
                  <span className="font-mono text-ink-dim">{p.size} · {p.fs}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={calculateHash}
              disabled={hashing}
              className="rounded-md bg-forensic-cyan px-4 py-2 text-xs font-semibold text-base hover:bg-forensic-cyan/90 disabled:opacity-50"
            >
              {hashing ? "Calculating…" : "Calculate Hash"}
            </button>
            {deviceHashes[device.id] && (
              <div className="min-w-[280px] flex-1">
                <HashDisplay hash={deviceHashes[device.id]} verified />
              </div>
            )}
          </div>
        </div>
      )}

      <TechnicalDetails title="How device detection works">
        <ol className="list-decimal space-y-1 pl-4">
          <li>Enumerate block devices connected to the workstation.</li>
          <li>Read partition tables (<Tooltip text="GUID Partition Table — modern partitioning scheme supporting large disks.">GPT</Tooltip> / MBR) and filesystem headers.</li>
          <li>Report capacity, sector geometry, and filesystem type without mounting the device.</li>
          <li>Generate a <Tooltip text="Cryptographic hash used to verify evidence integrity.">SHA-256</Tooltip> hash of the device to establish an integrity baseline before acquisition.</li>
        </ol>
      </TechnicalDetails>
    </div>
  );
}
