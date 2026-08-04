import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TbMoon } from "react-icons/tb";
import { PiLinkSimpleBold } from "react-icons/pi";
import balcklogo from "../assets/img-1.jpeg";
import whitelogo from "../assets/logo-copy.png";
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
  const location = useLocation();

  useEffect(() => {
    setSidebarColor(
      darkMode ? "#020923" : "rgba(239,236,237,0.95)"
    );
  }, [darkMode]);

  const isLightSidebar =
    sidebarColor === "rgba(239,236,237,0.95)" ||
    sidebarColor === "#fff" ||
    sidebarColor === "#ffffff";

  const getMenuClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive && activeMenu !== "settings"
      ? isLightSidebar
        ? "bg-yellow-400 text-black"
        : "bg-white text-black"
      : isLightSidebar
        ? "text-black hover:bg-yellow-400"
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
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 200);
    }
  };

  const isSettingsChildActive = [
    "/app/api-keys",
    "/app/webhooks",
    "/app/ip-Whishlist",
    "/app/profile",
    "/app/apidoc",
  ].includes(location.pathname);

  const isSettingsMainActive =
    location.pathname === "/app/settings";

  // Only For Mobile Device
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setOpen(false);
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
          className={`px-5 py-6 border-b border-white/10 ${open ? "flex items-center" : "flex justify-center"
            }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-black text-lg shrink-0">
              H
            </div>

            {open && (
              <div className="relative w-20 flex flex-col items-center">
                <div className="relative w-40 h-10 overflow-visible">
                  <img
                    className="absolute object-contain"
                    style={{
                      top: "-30px",
                      left: "30px",
                      width: "175px",
                      height: "110px",
                    }}
                    src={isLightSidebar ? whitelogo : balcklogo}
                    alt="logo"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-5 hide-scrollbar">
          {/* MAIN */}
          {open && (
            <p
              className={`text-[11px] uppercase tracking-widest font-semibold mb-3 ${isLightSidebar ? "text-black" : "text-white"
                }`}
            >
              Main
            </p>
          )}

          <div className="space-y-2">
            <NavLink
              to="/app/dashboard"
              onClick={() => {
                setActiveMenu("dashboard");
                setShowSettings(false);
                closeSidebarOnMobile();
              }}
              className={getMenuClass}
            >
              <LayoutDashboard size={18} />
              {open && <span>Dashboard</span>}
            </NavLink>

            <NavLink
              to="/app/paymentlinks"
              onClick={() => {
                setActiveMenu("paymentlinks");
                setShowSettings(false);
                closeSidebarOnMobile();
              }}
              className={getMenuClass}
            >
              <PiLinkSimpleBold size={18} />
              {open && <span>Payment Links</span>}
            </NavLink>

            <NavLink
              to="/app/reports"
              onClick={() => {
                setActiveMenu("reports");
                setShowSettings(false);
                closeSidebarOnMobile();

              }}
              className={getMenuClass}
            >
              <BarChart2 size={18} />
              {open && <span>Reports</span>}
            </NavLink>
          </div>

          {/* Manage */}
          {open && (
            <p
              className={`text-[11px] uppercase tracking-widest font-semibold mt-8 mb-3 ${isLightSidebar ? "text-black/80" : "text-white"
                }`}
            >
              Manage
            </p>
          )}
          <div className="space-y-2">
            {/* Settings */}
            <button
              onClick={() => {
                setActiveMenu("settings");
                setShowSettings((prev) => !prev);
              }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${activeMenu === "settings"
                ? isLightSidebar
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-black"
                : isLightSidebar
                  ? "text-black"
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
                  onClick={() => {
                    setActiveMenu("api-keys");
                    setShowSettings(true);
                    closeSidebarOnMobile();
                  }}
                  className={getMenuClass}
                >
                  <Key size={17} />
                  API Keys
                </NavLink>
                <NavLink
                  to="/app/webhooks"
                  onClick={() => {
                    setActiveMenu("webhooks");
                    setShowSettings(true);
                    closeSidebarOnMobile();
                  }}
                  className={getMenuClass}
                >
                  <Webhook size={17} />
                  Webhooks
                </NavLink>
                <NavLink
                  to="/app/profile"
                  onClick={() => {
                    setActiveMenu("profile");
                    setShowSettings(true);
                    closeSidebarOnMobile();
                  }}
                  className={getMenuClass}
                >
                  <CircleUser size={17} />
                  Profile
                </NavLink>
                <NavLink
                  to="/app/apidoc"
                  onClick={() => {
                    setActiveMenu("api-docs");
                    setShowSettings(true);
                    closeSidebarOnMobile();
                  }}
                  className={getMenuClass}
                >
                  <BarChart2 size={17} />
                  API Docs
                </NavLink>
              </div>
            )}
          </div>
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