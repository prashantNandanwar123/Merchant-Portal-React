import { useEffect, useRef, useState } from "react";
import { ChevronDown, CircleUserRound, LogOut, UserRound } from "lucide-react";

// Avatar dropdown with Profile / Logout – shared by both top bars.
export default function UserMenu({ name, subtitle, onProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const item =
    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-slate-50";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 text-sm font-medium shadow-xs transition hover:border-slate-300 hover:shadow-sm sm:pr-3"
      >
        <span className="grid size-8 place-items-center rounded-full bg-brand text-neutral-900">
          <CircleUserRound size={19} />
        </span>
        <span className="hidden max-w-32 truncate sm:inline">{name}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 animate-fade-in overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-bold text-slate-900">{name}</p>
            {subtitle && <p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p>}
          </div>

          {onProfile && (
            <button
              type="button"
              role="menuitem"
              className={item}
              onClick={() => {
                setOpen(false);
                onProfile();
              }}
            >
              <UserRound size={16} /> Profile
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className={`${item} text-red-600 hover:bg-red-50`}
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
