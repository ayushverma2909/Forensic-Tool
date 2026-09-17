import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import ToastNotification from "./components/ui/ToastNotification";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CaseInitialization from "./pages/CaseInitialization";
import SystemDetection from "./pages/SystemDetection";
import EvidenceAcquisition from "./pages/EvidenceAcquisition";
import StorageAnalysis from "./pages/StorageAnalysis";
import FileRecovery from "./pages/FileRecovery";
import RecoveredFiles from "./pages/RecoveredFiles";
import Sanitization from "./pages/Sanitization";
import Verification from "./pages/Verification";
import Report from "./pages/Report";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import Methodology from "./pages/Methodology";

const pageMap = {
  dashboard: Dashboard,
  "case-init": CaseInitialization,
  "system-detection": SystemDetection,
  "evidence-acquisition": EvidenceAcquisition,
  "storage-analysis": StorageAnalysis,
  "file-recovery": FileRecovery,
  "recovered-files": RecoveredFiles,
  sanitization: Sanitization,
  verification: Verification,
  report: Report,
  "audit-log": AuditLogs,
  settings: Settings,
  methodology: Methodology,
};

function Shell() {
  const { page, demoMode } = useApp();

  if (page === "landing") return <Landing />;

  const Page = pageMap[page] || Dashboard;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-base">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        {demoMode && (
          <div className="border-b border-warn/20 bg-warn/5 px-5 py-1.5 text-center text-[11px] font-mono tracking-wide text-warn">
            DEMO MODE — SIMULATED FORENSIC OPERATIONS
          </div>
        )}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Page />
        </main>
      </div>
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
