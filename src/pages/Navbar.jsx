import { useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const pageTitles = {
        "/app/dashboard": "Dashboard",
        "/app/reports": "Reports",
        "/app/api-keys": "API Keys",
        "/app/webhooks": "Webhooks",
        "/app/ip-Whishlist": "IP Whitelist",
        "/app/profile": "Profile",
        "/app/apidoc": "API Docs",
        "/app/paymentlinks": "Payment Links"
    };


    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const companyName = user?.company_name || "No Company";
    const merchantName = user?.merchant_Name || "No User";

    const initials = merchantName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");

    return (
        <>
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6 h-16 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center py-10 gap-4">
                    {/* Sidebar Toggle */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Menu size={22} className="text-gray-700" />
                    </button>
                    {/* Page Title */}
                    <h1 className="text-3xl font-semibold text-gray-900">
                        {pageTitles[location.pathname] || "Dashboard"}
                    </h1>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-5">
                    {/* Notification */}
                    <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                        <svg
                            xmlns="http://www.w3"
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0h6z"
                            />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
                    </button>

                    {/* Profile */}
                    <button className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-gray-100 transition">
                        <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">
                            {initials}
                        </div>
                        <div className="hidden sm:flex flex-col text-left leading-tight">
                            <span className="text-sm font-semibold text-gray-900">
                                {merchantName}
                            </span>
                            <span className="text-xs text-gray-500">
                                {companyName}
                            </span>
                        </div>
                    </button>
                </div>
            </header>
        </>
    );
}

