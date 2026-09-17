import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { recoveredFiles as recoveredFilesSeed } from "../data/recoveredFiles";

const AppContext = createContext(null);

function nowTime() {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

export function AppProvider({ children }) {
  const [page, setPage] = useState("landing");
  const [demoMode, setDemoMode] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [deviceHashes, setDeviceHashes] = useState({});
  const [acquisition, setAcquisition] = useState({ status: "IDLE" });
  const [scan, setScan] = useState({ status: "IDLE" });
  const [files, setFiles] = useState(recoveredFilesSeed);
  const [recoveredSet, setRecoveredSet] = useState({}); // id -> RECOVERED | FAILED
  const [sanitization, setSanitization] = useState({ status: "IDLE", targetId: null, methodId: null });
  const [verification, setVerification] = useState({ status: "IDLE" });
  const [certificate, setCertificate] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const pushToast = useCallback((message, tone = "info") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  const logAudit = useCallback((action, target, result, level = "SUCCESS", hash = "—") => {
    setAuditLog((log) => [
      {
        id: log.length + 1,
        time: nowTime(),
        user: caseData?.investigator || "Demo Investigator",
        action,
        target,
        result,
        level,
        hash,
      },
      ...log,
    ]);
  }, [caseData]);

  const navigate = useCallback((p) => setPage(p), []);

  const ensureDemoCase = useCallback(() => {
    setCaseData((c) => {
      if (c) return c;
      const created = {
        caseId: "CF-2026-001",
        id: "CF-2026-001",
        caseName: "Sample Digital Media Investigation",
        investigator: "Demo Investigator",
        organization: "CipherTrace Forensic Lab",
        description: "Digital media examined for deleted evidence and secure sanitization (demo data).",
        source: "SSD",
        priority: "Standard",
        notes: "Auto-generated for demo mode.",
        createdAt: new Date().toLocaleString(),
        status: "Ready for acquisition",
      };
      return created;
    });
  }, []);

  const value = {
    page, navigate,
    demoMode, setDemoMode, ensureDemoCase,
    caseData, setCaseData,
    selectedDeviceId, setSelectedDeviceId,
    deviceHashes, setDeviceHashes,
    acquisition, setAcquisition,
    scan, setScan,
    files, setFiles,
    recoveredSet, setRecoveredSet,
    sanitization, setSanitization,
    verification, setVerification,
    certificate, setCertificate,
    auditLog, logAudit,
    toasts, pushToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
