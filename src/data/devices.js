export const devices = [
  {
    id: "dev-sda",
    path: "/dev/sda",
    model: "Samsung SSD 870 EVO",
    serial: "S4XWNJ0R512837Q",
    type: "SSD",
    interface: "SATA",
    capacity: "500 GB",
    sectorSize: "512 bytes",
    totalSectors: "976,773,168",
    filesystem: "NTFS",
    partitionTable: "GPT",
    health: "Healthy",
    status: "Available",
    connection: "SATA",
    partitions: [
      { name: "Partition 1", label: "EFI System Partition", size: "100 MB", fs: "FAT32" },
      { name: "Partition 2", label: "Primary", size: "499 GB", fs: "NTFS" },
    ],
  },
  {
    id: "dev-sdb",
    path: "/dev/sdb",
    model: "Kingston DataTraveler",
    serial: "KDT-88213X0091",
    type: "USB",
    interface: "USB 3.0",
    capacity: "64 GB",
    sectorSize: "512 bytes",
    totalSectors: "125,042,688",
    filesystem: "FAT32",
    partitionTable: "MBR",
    health: "Healthy",
    status: "Available",
    connection: "USB",
    partitions: [
      { name: "Partition 1", label: "Primary", size: "64 GB", fs: "FAT32" },
    ],
  },
  {
    id: "dev-sdc",
    path: "/dev/sdc",
    model: "WD Elements",
    serial: "WXH1A9203847",
    type: "External HDD",
    interface: "USB 3.0",
    capacity: "1 TB",
    sectorSize: "4096 bytes",
    totalSectors: "244,190,646",
    filesystem: "exFAT",
    partitionTable: "GPT",
    health: "Healthy",
    status: "Available",
    connection: "USB",
    partitions: [
      { name: "Partition 1", label: "Primary", size: "1 TB", fs: "exFAT" },
    ],
  },
];

export const systemInfo = {
  os: "Ubuntu Linux 24.04 LTS",
  kernel: "6.8.0-52-generic",
  architecture: "x86_64",
  hostname: "FORENSIC-WORKSTATION-04",
  cpu: "Intel-compatible x86_64 processor, 8 cores",
  ram: "7.7 GB",
};

export function mockHash(seed = "") {
  const base = "a9c4f1e6d2b8073c5f19e4a7b6d0c3f2e8a1b4d7c6f9e2a5b8d1c4f7e0a3b6d9";
  let s = "";
  for (let i = 0; i < base.length; i++) {
    const c = base.charCodeAt(i) + seed.length + i;
    s += (c % 16).toString(16);
  }
  return s;
}
