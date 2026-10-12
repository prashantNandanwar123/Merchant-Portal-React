import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  FileText,
} from "lucide-react";

import whitelogo from "../assets/logo-copy.png";

export default function Sidebar({ open, setOpen }) {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // Only for mobile device
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  const menuItems = [
    {
      name: "dashboard",
      label: "Dashboard",
      path: "/reseller/reDashboard",
      icon: LayoutDashboard,
    },
    {
      name: "merchants",
      label: "Merchants",
      path: "/reseller/merchants",
      icon: LayoutDashboard,
    },
    {
      name: "reports",
      label: "Reports",
      path: "/reseller/reReport",
      icon: BarChart2,
    },
    {
      name: "api-docs",
      label: "API Docs",
      path: "/reseller/api-docs",
      icon: FileText,
    },
  ];


  return (
    <aside
      className={`
        fixed top-0 left-0
        h-screen
        flex flex-col
        z-[100]
        bg-white
        text-gray-800
        shadow-sm
        transition-all duration-300
        lg:translate-x-0
        ${open
          ? "translate-x-0 lg:w-64 xl:w-56"
          : "-translate-x-full lg:translate-x-0 lg:w-20"
        }
        w-64
      `}
    >
      {/* ================= HEADER ================= */}
      <div
        className={`
          px-5
          xl:px-4  border-b border-gray-200
          ${open
            ? "flex items-center"
            : "flex justify-center"
          }
        `}
      >
        <div className="flex items-center gap-3 xl:gap-2 overflow-hidden">
          {/* Logo Circle */}
          <div
            className="
              w-10 h-10
              xl:w-9 xl:h-9             
              rounded-full
              bg-yellow-400
              flex items-center justify-center
              font-bold
              text-black
              text-lg
              xl:text-base
              shrink-0
            "
          >
            H
          </div>

          {/* Logo */}
          {open && (
            <div className="d-flex items-center overflow-hidden  xl:mt-2">
              <img
                src={whitelogo}
                alt="logo"
                className="
                  h-10
                  xl:h-18                 
                  w-auto
                  object-contain
                  max-w-[160px]
                  xl:max-w-[150px]
                "
              />
              <div className="text-xs py-2 text-left ml-3.5 text-gray-900
                  -mt-7"><p>Reseller Panel</p></div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MENU ================= */}
      <div
        className="
          flex-1
          overflow-y-auto
          px-3
          py-5
          xl:px-2
          xl:py-4
          hide-scrollbar
        "
      >
        {/* MAIN */}
        {open && (
          <p
            className="
              px-3
              mb-3
              xl:mb-2
              text-[11px]
              xl:text-[10px]
              uppercase
              tracking-widest
              font-semibold
              text-black
            "
          >
            Main
          </p>
        )}

        {/* MENU ITEMS */}
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  setActiveMenu(item.name);
                  closeSidebarOnMobile();
                }}
                className={({ isActive }) => `
                  group
                  relative
                  flex
                  items-center
                  h-11
                  xl:h-10
                  ${open
                    ? "px-3 xl:px-3"
                    : "justify-center px-0"
                  }

                  gap-3
                  xl:gap-2.5
                  text-sm
                  xl:text-[13px]
                  font-medium
                  no-underline
                  transition-all
                  duration-200
                  border-l-4

                  ${isActive
                    ? `
                        bg-yellow-100
                        text-gray-900
                        border-yellow-600
                        rounded-xl
                      `
                    : `
                        bg-transparent
                        text-gray-600
                        border-transparent

                        hover:bg-yellow-100
                        hover:text-gray-900
                        hover:border-yellow-600
                         hover:rounded-xl
                      `
                  }
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={2}
                  className="
                    xl:w-4
                    xl:h-4
                    shrink-0
                  "
                />

                {open && (
                  <span className="truncate">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
}