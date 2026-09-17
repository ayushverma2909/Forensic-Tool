const sig = {
  JPEG: "FF D8 FF E0",
  PNG: "89 50 4E 47",
  PDF: "25 50 44 46",
  ZIP: "50 4B 03 04",
  DOCX: "50 4B 03 04",
  XLSX: "50 4B 03 04",
  MP4: "00 00 00 18 66 74 79 70",
  TXT: "—",
  CSV: "—",
};

export const recoveredFiles = [
  { id: 1, name: "IMG_20240128_101823.jpg", type: "JPEG", size: "4.2 MB", location: "Unallocated Space", status: "Recoverable", confidence: 98, sector: "12,842,910 – 12,844,110", source: "Unallocated Space + Signature Carving" },
  { id: 2, name: "invoice_2024_Q1.pdf", type: "PDF", size: "812 KB", location: "Deleted MFT Entry", status: "Recoverable", confidence: 96, sector: "18,221,004 – 18,221,410", source: "Deleted MFT Entry" },
  { id: 3, name: "project_backup.zip", type: "ZIP", size: "83 MB", location: "Unallocated Space", status: "Partial", confidence: 72, sector: "22,904,551 – 22,951,882", source: "Signature Carving (fragmented)" },
  { id: 4, name: "evidence_video_cam3.mp4", type: "MP4", size: "231 MB", location: "Fragmented", status: "Partial", confidence: 64, sector: "31,102,004 – 31,289,447", source: "Fragment Reassembly" },
  { id: 5, name: "passport_scan.png", type: "PNG", size: "2.1 MB", location: "Deleted Entry", status: "Recoverable", confidence: 99, sector: "9,004,221 – 9,005,010", source: "Deleted MFT Entry" },
  { id: 6, name: "financial_report_2023.docx", type: "DOCX", size: "1.4 MB", location: "Deleted MFT Entry", status: "Recoverable", confidence: 94, sector: "14,552,110 – 14,552,910", source: "Deleted MFT Entry" },
  { id: 7, name: "employee_records.xlsx", type: "XLSX", size: "3.7 MB", location: "Unallocated Space", status: "Recoverable", confidence: 91, sector: "27,331,004 – 27,333,882", source: "Signature Carving" },
  { id: 8, name: "IMG_20240129_140011.jpg", type: "JPEG", size: "3.8 MB", location: "Unallocated Space", status: "Recoverable", confidence: 97, sector: "12,988,220 – 12,989,401", source: "Unallocated Space + Signature Carving" },
  { id: 9, name: "meeting_notes.txt", type: "TXT", size: "14 KB", location: "Deleted MFT Entry", status: "Recoverable", confidence: 89, sector: "8,221,004 – 8,221,022", source: "Deleted MFT Entry" },
  { id: 10, name: "transaction_log.csv", type: "CSV", size: "220 KB", location: "Deleted MFT Entry", status: "Recoverable", confidence: 92, sector: "8,441,110 – 8,441,338", source: "Deleted MFT Entry" },
  { id: 11, name: "contract_signed.pdf", type: "PDF", size: "1.1 MB", location: "Deleted Entry", status: "Recoverable", confidence: 95, sector: "19,004,552 – 19,005,201", source: "Deleted MFT Entry" },
  { id: 12, name: "site_photo_042.jpg", type: "JPEG", size: "5.6 MB", location: "Unallocated Space", status: "Recoverable", confidence: 93, sector: "13,441,220 – 13,442,981", source: "Signature Carving" },
  { id: 13, name: "archive_2022.zip", type: "ZIP", size: "412 MB", location: "Unallocated Space", status: "Partial", confidence: 58, sector: "34,552,004 – 34,821,110", source: "Signature Carving (fragmented)" },
  { id: 14, name: "id_card_scan.png", type: "PNG", size: "1.8 MB", location: "Deleted Entry", status: "Recoverable", confidence: 99, sector: "9,221,441 – 9,222,003", source: "Deleted MFT Entry" },
  { id: 15, name: "surveillance_clip_09.mp4", type: "MP4", size: "184 MB", location: "Fragmented", status: "Partial", confidence: 61, sector: "38,004,221 – 38,177,554", source: "Fragment Reassembly" },
  { id: 16, name: "budget_forecast.xlsx", type: "XLSX", size: "2.2 MB", location: "Deleted MFT Entry", status: "Recoverable", confidence: 90, sector: "15,221,004 – 15,221,742", source: "Deleted MFT Entry" },
  { id: 17, name: "report_draft_v3.docx", type: "DOCX", size: "980 KB", location: "Unallocated Space", status: "Recoverable", confidence: 88, sector: "26,004,221 – 26,004,712", source: "Signature Carving" },
  { id: 18, name: "receipt_scan_0091.jpg", type: "JPEG", size: "2.9 MB", location: "Deleted Entry", status: "Recoverable", confidence: 97, sector: "11,221,004 – 11,221,662", source: "Deleted MFT Entry" },
  { id: 19, name: "customer_db_export.csv", type: "CSV", size: "6.4 MB", location: "Unallocated Space", status: "Partial", confidence: 69, sector: "29,552,110 – 29,556,441", source: "Signature Carving (fragmented)" },
  { id: 20, name: "signature_page.pdf", type: "PDF", size: "340 KB", location: "Deleted Entry", status: "Recoverable", confidence: 96, sector: "17,004,110 – 17,004,301", source: "Deleted MFT Entry" },
  { id: 21, name: "corrupted_fragment_01.jpg", type: "JPEG", size: "1.2 MB", location: "Unallocated Space", status: "Failed", confidence: 21, sector: "41,221,004 – 41,221,330", source: "Signature Carving (incomplete)" },
  { id: 22, name: "corrupted_archive.zip", type: "ZIP", size: "44 MB", location: "Unallocated Space", status: "Failed", confidence: 18, sector: "43,004,552 – 43,041,882", source: "Signature Carving (incomplete)" },
];

export function fileHeaderHex(type) {
  return sig[type] || "—";
}

export const signatureCounts = [
  { type: "JPEG", header: "FF D8 FF", count: 312 },
  { type: "PNG", header: "89 50 4E 47", count: 91 },
  { type: "PDF", header: "25 50 44 46", count: 48 },
  { type: "DOCX", header: "50 4B 03 04", count: 72 },
  { type: "ZIP", header: "50 4B 03 04", count: 33 },
  { type: "MP4", header: "66 74 79 70", count: 21 },
];

export const recoverySummary = [
  { name: "Images", value: 18 },
  { name: "Documents", value: 94 },
  { name: "Videos", value: 27 },
  { name: "Archives", value: 31 },
  { name: "Other", value: 77 },
];
