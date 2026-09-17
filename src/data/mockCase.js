export const sanitizationMethods = [
  {
    id: "single-pass",
    name: "Single-Pass Overwrite",
    description: "Overwrites every addressable sector once with a fixed pattern (0x00). Fast, suitable for low-sensitivity data on magnetic and flash media.",
    passes: 1,
    speed: "Fast",
  },
  {
    id: "multi-pass",
    name: "Multi-Pass Overwrite",
    description: "Overwrites all sectors across multiple passes with alternating patterns, reducing the likelihood of residual magnetic or charge traces.",
    passes: 3,
    speed: "Moderate",
  },
  {
    id: "random",
    name: "Random Data Overwrite",
    description: "Writes cryptographically random data across every sector instead of a fixed pattern, eliminating pattern-based inference.",
    passes: 1,
    speed: "Moderate",
  },
  {
    id: "dod",
    name: "DoD-Style Method (Simulated)",
    description: "Simulates a 3-pass overwrite sequence (pattern, complement, random) modeled after legacy DoD 5220.22-M guidance, plus verification.",
    passes: 3,
    speed: "Slow",
  },
  {
    id: "crypto",
    name: "Cryptographic Erasure",
    description: "Destroys the encryption key protecting the volume, rendering existing ciphertext permanently unreadable without overwriting all sectors.",
    passes: 0,
    speed: "Very Fast",
  },
  {
    id: "ssd-secure",
    name: "SSD Secure Erase / TRIM-aware Workflow",
    description: "Issues an ATA Secure Erase / TRIM-aware sequence appropriate for flash media, avoiding unnecessary write amplification.",
    passes: 1,
    speed: "Fast",
  },
];

export const auditLogSeed = [
  { id: 1, time: "14:02:11", user: "Demo Investigator", action: "Case Created", target: "CF-2026-001", result: "SUCCESS", level: "SUCCESS", hash: "—" },
];

export const architecturePipeline = [
  "React / Tkinter UI",
  "Forensic Engine",
  "Filesystem Parser",
  "Recovery Engine",
  "Sanitization Engine",
  "Verification Engine",
  "Evidence Database",
  "Report Generator",
];

export const pythonModules = ["psutil", "pytsk3", "libewf", "hashlib", "os", "pathlib", "struct", "subprocess"];

export const tooltipContent = {
  mft: "Master File Table — NTFS metadata structure containing file and directory records.",
  unallocated: "Storage regions not currently assigned to active filesystems where remnants of deleted data may remain.",
  carving: "Recovery technique that identifies files from raw data using known file signatures rather than filesystem metadata.",
  sha256: "Cryptographic hash used to verify evidence integrity.",
  usn: "USN Journal — NTFS change log recording recent file and directory modifications.",
};
