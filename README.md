# CipherTrace Forensic — SIH MVP Prototype

Integrated Digital Forensics & Secure Data Sanitization Platform — a high-fidelity React frontend prototype for the SIH problem statement "Integrated Secure Data Erasure and Advanced File Recovery Tool for Digital Forensics and Data Sanitization Software."

This is a **frontend-only prototype**. All device data, scans, hashes, recovery results, and sanitization operations are **simulated** with mock data and React state — no real disk access, wiping, or recovery is performed. It demonstrates the complete intended workflow and UI/UX for a recorded SIH judge demonstration, with an architecture clean enough that a future Python (Tkinter + pytsk3/libewf/hashlib-based) backend can replace the simulated functions.

## Tech stack
- React 19 + Vite
- Tailwind CSS
- lucide-react icons
- Recharts (dashboard chart)

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

To build for production / recording:

```bash
npm run build
npm run preview
```

## Demo flow (~5–8 minutes)

1. **Landing** → click **Enter Demo Mode** (or **Initialize Case** to fill out the case form first).
2. **Case Initialization** → create case `CF-2026-001`.
3. **System Detection** → select `/dev/sda`, click **Calculate Hash**.
4. **Evidence Acquisition** → **Start Acquisition**, watch the staged progress to completion.
5. **Storage Analysis** → review the disk map and NTFS metadata.
6. **File Recovery** → choose a scan mode, **Start Forensic Scan**, review signature detection.
7. **Recovered Files** → filter/search/sort, open a file for the hex/metadata/confidence preview, select files and **Recover Selected Files**.
8. **Secure Erasure** → select target `/dev/sdb`, choose a method, confirm, **Begin Sanitization**.
9. **Verification** → **Run Verification Scan**, then **Generate Sanitization Certificate** (downloadable JSON).
10. **Forensic Report** → review the consolidated report and chain of custody; export JSON or print.
11. **Audit Logs** → review the append-only operation log, filterable by level.

## Project structure

```
src/
  components/
    layout/        Sidebar, Topbar
    ui/             StatCard, StatusBadge, ProgressBar, HashDisplay, Modal,
                     ConfirmationDialog, TechnicalDetails, EmptyState, ToastNotification
    forensics/      Pipeline, ForensicTimeline, FilePreview
  context/          AppContext - global case/demo/audit/toast state
  data/             devices.js, recoveredFiles.js, mockCase.js - mock data, separate
                     from components so it can be swapped for real API calls later
  pages/            One file per sidebar screen
  App.jsx           Layout shell + page routing (state-based, no react-router)
```

## Notes for judges

- Labels such as **SIMULATED**, **DEMO MODE**, and **PROTOTYPE** appear throughout to make clear that no real forensic operations are performed.
- The **Settings** screen documents the intended production architecture (Python/Tkinter UI over a Python forensic/recovery/sanitization engine using modules such as `pytsk3`, `libewf`, `hashlib`, `psutil`).
