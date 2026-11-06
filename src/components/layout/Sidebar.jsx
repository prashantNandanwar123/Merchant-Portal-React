import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, PanelLeftClose } from "lucide-react";
import logo from "../../assets/logo-white.png";

const linkCls = (isActive) =>
  `group flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[13px] font-semibold transition ${
    isActive
      ? "bg-brand text-neutral-900 shadow-md shadow-brand/20"
      : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

// One sidebar for the merchant and the reseller portal.
// Slide-in drawer below `lg`, collapsible on desktop.
export default function Sidebar({ open, onClose, onNavigate, nav }) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState({});

  // Expand a group automatically when one of its pages is open.
  useEffect(() => {
    nav.items.forEach((item) => {
      if (item.children?.some((c) => c.to.toLowerCase() === pathname.toLowerCase())) {
        setExpanded((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [pathname, nav]);

  return (
    <>
      <aside
        id="app-sidebar"
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-white shadow-2xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <div className="min-w-0">
            <img src={logo} alt="HelloPe" className="-ml-3 h-14 w-auto max-w-40 object-contain" />
            <p className="-mt-3 truncate pl-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
              {nav.portal}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <PanelLeftClose size={19} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {nav.items.map((item, index) => {
            if (item.section) {
              return (
                <p
                  key={`s-${item.section}`}
                  className={`px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 ${index ? "pt-5" : ""}`}
                >
                  {item.section}
                </p>
              );
            }

            const Icon = item.icon;

            if (!item.children) {
              return (
                <NavLink key={item.to} to={item.to} end onClick={onNavigate} className={({ isActive }) => linkCls(isActive)}>
                  <Icon size={18} strokeWidth={2.3} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            }

            const active = item.children.some((c) => c.to.toLowerCase() === pathname.toLowerCase());
            const isOpen = Boolean(expanded[item.label]);

            return (
              <div key={item.label}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded((p) => ({ ...p, [item.label]: !p[item.label] }))}
                  className={`${linkCls(active)} w-full text-left`}
                >
                  <Icon size={18} strokeWidth={2.3} className="shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <div className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-white/10 pl-3">
                      {item.children.map((c) => {
                        const ChildIcon = c.icon;
                        return (
                          <NavLink
                            key={c.to}
                            to={c.to}
                            end
                            onClick={onNavigate}
                            tabIndex={isOpen ? 0 : -1}
                            className={({ isActive }) =>
                              `flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-[13px] font-semibold transition ${
                                isActive ? "bg-brand text-neutral-900" : "text-slate-400 hover:bg-white/10 hover:text-white"
                              }`
                            }
                          >
                            {ChildIcon && <ChildIcon size={15} className="shrink-0" />}
                            {c.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <p className="border-t border-white/10 px-5 py-4 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} HelloPe
        </p>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 animate-fade-in bg-black/50 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
