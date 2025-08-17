//Modal.jsx-->frontend

import { useEffect, useRef } from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  disableClose = false,
}) {
  const panelRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !disableClose) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, disableClose, onClose]);

  // Focus the panel
  useEffect(() => {
    if (open) {
      const id = setTimeout(() => panelRef.current?.focus(), 0);
      // lock background scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(id);
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  const close = () => {
    if (!disableClose) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "Dialog"}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={close} />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-lg border p-4 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-base">{title}</h2>
          <button
            className="text-sm rounded px-2 py-1 border bg-white hover:bg-gray-50 disabled:opacity-50"
            onClick={close}
            disabled={disableClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-auto pr-1 max-h-[64vh]">{children}</div>
      </div>
    </div>
  );
}
