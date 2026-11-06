import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// Open modals, top-most last: Escape only closes the top one (e.g. a confirm dialog over another modal).
const modalStack = [];

// Bottom-sheet on phones, centred dialog from `sm` upwards.
export default function Modal({
  title,
  subtitle,
  icon: Icon,
  onClose,
  closeDisabled = false,
  maxWidth = "max-w-3xl",
  children,
}) {
  // Keep the latest handlers in refs so the effect below runs only once.
  // (Previously `onClose` was an effect dependency; because parents pass a new
  // function every render, the body-scroll lock was reset on every keystroke.)
  const onCloseRef = useRef(onClose);
  const disabledRef = useRef(closeDisabled);
  useEffect(() => {
    onCloseRef.current = onClose;
    disabledRef.current = closeDisabled;
  });

  useEffect(() => {
    const token = {};
    modalStack.push(token);

    const onKey = (e) => {
      if (e.key === "Escape" && modalStack[modalStack.length - 1] === token && !disabledRef.current) {
        onCloseRef.current();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      modalStack.splice(modalStack.indexOf(token), 1);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-neutral-950/60 backdrop-blur-[2px] sm:items-center sm:p-5"
      onClick={() => !closeDisabled && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-[92dvh] w-full ${maxWidth} animate-sheet-up flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab handle – phones only */}
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-slate-300 sm:hidden" />

        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              {Icon && (
                <span className="grid size-8 place-items-center rounded-lg bg-brand-soft">
                  <Icon size={17} />
                </span>
              )}
              <span className="truncate">{title}</span>
            </h2>
            {subtitle && (
              <p className="mt-1 text-[13px] text-slate-500">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            aria-label="Close"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export function ModalBody({ children }) {
  return <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">{children}</div>;
}

export function ModalFooter({ children }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:px-6">
      {children}
    </div>
  );
}
