import React from "react";
import { useApp } from "../../context/AppContext";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

const icons = { success: CheckCircle2, warn: AlertTriangle, error: XCircle, info: Info };
const toneClass = {
  success: "border-success/30 text-success",
  warn: "border-warn/30 text-warn",
  error: "border-crit/30 text-crit",
  info: "border-forensic-cyan/30 text-forensic-cyan",
};

export default function ToastNotification() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-80 flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.tone] || Info;
        return (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 rounded-md border bg-base-raised px-3.5 py-3 shadow-2xl ${toneClass[t.tone] || toneClass.info}`}
          >
            <Icon size={16} className="mt-0.5 shrink-0" />
            <span className="text-xs text-ink">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
