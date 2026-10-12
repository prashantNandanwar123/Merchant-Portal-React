import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ReNavbar from "../reseller/ReNavbar";
import ReSidebar from "../reseller/ReSidebar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex min-h-screen sm:h-screen sm:overflow-hidden bg-[#FDFBFD]">
      {/* Sidebar */}
      <ReSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      {/* Main Content */}
      <div
        className={`
         flex-1
         flex
         flex-col
         min-h-screen
         sm:h-screen
         min-h-0
         min-w-0
         transition-all
         duration-300
         ml-0
        ${sidebarOpen ? "lg:ml-56" : "lg:ml-20"}
      `}
      >
        <ReNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 min-h-0 min-w-0 h-screen overflow-y-auto hide-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}