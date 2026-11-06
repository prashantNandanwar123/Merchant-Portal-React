import { TriangleAlert } from "lucide-react";
import Modal, { ModalBody, ModalFooter } from "./Modal";
import { btnSecondary } from "./ui";

// In-app replacement for window.confirm (which looks out of place and is blocked in some webviews).
export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title} icon={TriangleAlert} onClose={onCancel} closeDisabled={busy} maxWidth="max-w-md">
      <ModalBody>
        <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      </ModalBody>
      <ModalFooter>
        <button type="button" className={`${btnSecondary} sm:w-32`} onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={`inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white transition disabled:opacity-60 sm:w-36 ${
            danger ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {busy ? "Processing..." : confirmLabel}
        </button>
      </ModalFooter>
    </Modal>
  );
}
