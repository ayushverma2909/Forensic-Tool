import React from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmationDialog({ open, onClose, onConfirm, title, children, confirmLabel = "Confirm", disabled }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-crit" />
        <div className="text-sm text-ink-dim">{children}</div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-md border border-border-light px-3.5 py-2 text-xs font-medium text-ink-dim hover:bg-base-raised"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="rounded-md bg-crit px-3.5 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-crit/90"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
