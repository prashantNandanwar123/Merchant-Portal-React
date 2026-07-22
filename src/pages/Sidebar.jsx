import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TbMoon } from "react-icons/tb";
import {
  LayoutDashboard,
  BarChart2,
  Settings,
  ChevronDown,
  Key,
  Webhook,
  Shield,
  LogOut,
  CircleUser,
  Home,
  Folder,
  Moon,
  Sun

} from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarColor, setSidebarColor] = useState("#020923");

  const navigate = useNavigate();

  useEffect(() => {
    setSidebarColor(
      darkMode ? "#020923" : "rgba(239,236,237,0.95)"
    );
  }, [darkMode]);

  const isLightSidebar =
    sidebarColor === "rgba(239,236,237,0.95)" ||
    sidebarColor === "#fff" ||
    sidebarColor === "#ffffff";

  const getMenuClass = (menu) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeMenu === menu
      ? "bg-[#1a1d2e] text-white"
      : isLightSidebar
        ? "text-black hover:bg-[#020923] hover:text-white"
        : "text-white/70 hover:bg-white hover:text-black"
    }`;


  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.respCode === 0) {
        localStorage.removeItem("isLogin");
        localStorage.removeItem("user");
        toast.success(response.respMsg);
        setTimeout(() => {
          navigate("/");
        }, 200);

      } else {
        toast.error(response.respMsg);
      }
    } catch (error) {
      toast.error(error);

      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  return (
    <>
      <aside
        className={`
                        fixed top-0 left-0 h-screen
                        flex flex-col
                        transition-all duration-300
                        z-[100]
                        ${isLightSidebar ? "text-black" : "text-white"}

                        lg:translate-x-0
                        ${open ? "translate-x-0 lg:w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}
                        w-64
                  `}
        style={{ backgroundColor: sidebarColor }}
      >
        {/* Header */}
        <div
          className={`px-5 py-6 border-b border-white/10 ${open ? "flex items-center justify-between" : "flex justify-center"
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black text-lg">
              H
            </div>

            {open && (
              <div>
                <h2 className="text-2xl font-semibold leading-none">
                  HelloPe
                </h2>
                <p
                  className={`text-xs mt-1 ${isLightSidebar ? "text-black/90" : "text-white/60"
                    }`}
                >
                  User Panel
                </p>
              </div>
            )}
          </div>

          {/* {open && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
          >
            ❮
          </button>
        )} */}
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-5 hide-scrollbar">
          {/* MAIN */}
          {open && (
            <p
              className={`text-[11px] uppercase tracking-widest font-semibold mb-3 ${isLightSidebar ? "text-black" : "text-white/40"
                }`}
            >
              Main
            </p>
          )}

          <div className="space-y-2">
            <NavLink
              to="/app/dashboard"
              onClick={() => setActiveMenu("dashboard")}
              className={getMenuClass("dashboard")}
            >
              <LayoutDashboard size={18} />
              {open && <span>Dashboard</span>}
            </NavLink>

            <NavLink
              to="/app/paymentlinks"
              onClick={() => setActiveMenu("paymentlinks")}
              className={getMenuClass("paymentlinks")}
            >
              <LayoutDashboard size={18} />
              {open && <span>Payment Links</span>}
            </NavLink>

            <NavLink
              to="/app/reports"
              onClick={() => setActiveMenu("reports")}
              className={getMenuClass("reports")}
            >
              <BarChart2 size={18} />
              {open && <span>Reports</span>}
            </NavLink>
          </div>

          {/* Manage */}
          {open && (
            <p
              className={`text-[11px] uppercase tracking-widest font-semibold mt-8 mb-3 ${isLightSidebar ? "text-black/80" : "text-white/40"
                }`}
            >
              Manage
            </p>
          )}

          <div className="space-y-2">
            {/* Settings */}
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setActiveMenu("settings");
              }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${activeMenu === "settings"
                ? "bg-[#16275a] text-white"
                : isLightSidebar
                  ? "text-black hover:bg-black/10"
                  : "text-white/70 hover:bg-white/5"
                }`}
            >
              <div className="flex items-center gap-3">
                <Settings size={18} />
                {open && <span>Settings</span>}
              </div>

              {open && (
                <ChevronDown
                  size={18}
                  className={`transition ${showSettings ? "rotate-180" : ""
                    }`}
                />
              )}
            </button>

            {/* Submenu */}
            {showSettings && open && (
              <div className="ml-4 mt-2 space-y-2 border-l border-white/10 pl-4">
                <NavLink
                  to="/app/api-keys"
                  onClick={() => setActiveMenu("api-keys")}
                  className={getMenuClass("api-keys")}
                >
                  <Key size={17} />
                  API Keys
                </NavLink>

                <NavLink
                  to="/app/webhooks"
                  onClick={() => setActiveMenu("webhooks")}
                  className={getMenuClass("webhooks")}
                >
                  <Webhook size={17} />
                  Webhooks
                </NavLink>

                <NavLink
                  to="/app/ip-Whishlist"
                  onClick={() => setActiveMenu("ip-whitelist")}
                  className={getMenuClass("ip-whitelist")}
                >
                  <Shield size={17} />
                  IP Whitelist
                </NavLink>

                <NavLink
                  to="/app/profile"
                  onClick={() => setActiveMenu("profile")}
                  className={getMenuClass("profile")}
                >
                  <CircleUser size={17} />
                  Profile
                </NavLink>

                <NavLink
                  to="/app/apidoc"
                  onClick={() => setActiveMenu("apidooc")}
                  className={getMenuClass("apidooc")}
                >
                  <BarChart2 size={17} />
                  API Docs
                </NavLink>
              </div>
            )}

          </div>
          {/* Upgrade Card */}
          {/* {open && (
          <div className="mt-8 rounded-2xl bg-[#16275a] p-4">
            <h4 className="text-sm font-semibold">
              Unlock more with HelloPe
            </h4>

            <p className="text-xs text-white/60 mt-2 leading-5">
              Increase limits, access advanced analytics and more.
            </p>

            <button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg py-2 text-sm font-medium transition">
              Upgrade Now ↗
            </button>
          </div>
        )} */}

          {/* Status */}
          {/* {open && (
          <div className="mt-5 rounded-2xl border border-white/10 p-4">
            <p className="text-sm font-medium">System Status</p>

            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>

              <span className="text-green-400 text-sm">
                All Systems Operational
              </span>
            </div>

            <p className="text-xs text-white/40 mt-2">
              99.9% uptime
            </p>
          </div>
        )} */}
        </div>

        {/* Dark Mode */}
        <div className="border-t border-white/10 px-5 py-4">
          <div
            className={`flex items-center ${open ? "justify-between" : "justify-center"
              }`}
          >
            {open && (
              <span className="flex items-center gap-2 text-sm">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                {darkMode ? "Dark Mode" : "Light Mode"}
              </span>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition ${darkMode ? "bg-blue-500" : "bg-gray-500"
                }`}
            >
              <span
                className={`absolute top-0.5 right-6 h-5 w-5 rounded-full bg-white transition ${darkMode ? "translate-x-6" : "translate-x-0.5"
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}