import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import { loginPathFor } from "../../utils/session";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import { merchantNav, resellerNav, titleFor } from "./nav";

const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

// Shell for both portals: sidebar + sticky top bar + routed content.
export default function AppShell() {
  const { user, role, isReseller, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const nav = isReseller ? resellerNav : merchantNav;

  const [open, setOpen] = useState(isDesktop);

  useEffect(() => {
    if (!isDesktop()) setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setOpen(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open || isDesktop()) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Always ends the local session – even when the server call fails
  // (before, a non-zero respCode left the user stuck logged in).
  const handleLogout = async () => {
    try {
      const endpoint = isReseller ? `/reseller/logout/${user?.resellerId}` : "/auth/logout";
      const response = await axiosInstance.post(endpoint);
      if (response?.respCode === 0 && response?.respMsg) toast.success(response.respMsg);
    } catch {
      /* ignore – we still log out locally */
    } finally {
      logout();
      navigate(loginPathFor(role), { replace: true });
    }
  };

  const name = isReseller ? user?.companyName || "Reseller" : user?.merchant_Name || "Merchant";
  const subtitle = isReseller
    ? `Reseller ID: ${user?.resellerId || "-"}`
    : user?.company_name || "";

  return (
    <div className="min-h-dvh">
      <Sidebar open={open} onClose={() => setOpen(false)} onNavigate={() => !isDesktop() && setOpen(false)} nav={nav} />

      <div className={`flex min-h-dvh min-w-0 flex-col transition-[padding] duration-200 ${open ? "lg:pl-64" : ""}`}>
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-3 backdrop-blur sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            {!open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
                aria-controls="app-sidebar"
                className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand text-neutral-900 shadow-xs transition hover:bg-brand-dark"
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className="truncate text-sm font-bold uppercase tracking-wide text-slate-800 sm:text-[15px]">
              {titleFor(nav, pathname)}
            </h1>
          </div>

          <UserMenu
            name={name}
            subtitle={subtitle}
            onProfile={() => navigate(nav.profilePath)}
            onLogout={handleLogout}
          />
        </header>

        <main className="mx-auto w-full min-w-0 max-w-[1600px] flex-1 p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
