import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

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


    // Auto Hide Notification
    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    // Notification Icon Click
    const handleNotificationClick = () => {
        setShowNotification(true);
    };

    // Close Notification
    const handleNotification = () => {
        setShowNotification(false);
    };

    return (
        <>
            {/* NAVBAR */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 xl:px-3 h-16 xl:h-14 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-2 sm:gap-4 xl:gap-2 min-w-0">
                    {/* Sidebar Toggle */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 xl:p-1.5 rounded-lg hover:bg-gray-100 transition shrink-0"
                    >
                        <Menu size={22} className="text-gray-700 xl:w-5 xl:h-5" />
                    </button>

                    {/* Page Title */}
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-xl font-semibold text-gray-900 truncate">
                        {pageTitles[location.pathname] || "Dashboard"}
                    </h1>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 sm:gap-5 xl:gap-3 shrink-0">
                    {/* Notification */}
                    <div className="relative">
                        {/* Notification Button */}
                        <button
                            onClick={handleNotificationClick}
                            className="relative p-2 xl:p-1.5 rounded-full hover:bg-gray-100 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 xl:w-5 xl:h-5 text-gray-600"
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

                            {/* Notification Dot */}
                            <span className="absolute top-1 right-1 xl:top-0.5 xl:right-0.5 w-2 h-2 xl:w-1.5 xl:h-1.5 rounded-full bg-red-500"></span>
                        </button>

                        {/* Notification Popup */}
                        {showNotification && (
                            <div className="fixed top-20 xl:top-16 right-4 sm:right-5 xl:right-3 z-50 w-[calc(100vw-2rem)] max-w-sm xl:max-w-xs bg-white rounded-xl shadow-xl p-4 xl:p-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 xl:text-sm">
                                            Congratulations! 🎉
                                        </h3>
                                        <p className="text-sm xl:text-xs text-gray-600 mt-1">
                                            Congratulations! You are now a member of HelloPe.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setShowNotification(false)}
                                        className="text-gray-400 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <button className="flex items-center gap-2 sm:gap-3 xl:gap-2 rounded-lg px-2 xl:px-1.5 py-1 hover:bg-gray-100 transition">
                        <div className="w-9 h-9 sm:w-10 h-10 xl:w-8 xl:h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-sm sm:text-base xl:text-sm shrink-0">
                            {initials}
                        </div>

                        <div className="hidden sm:flex flex-col text-left leading-tight">
                            <span className="text-sm xl:text-xs font-semibold text-gray-900">
                                {merchantName}
                            </span>
                            <span className="text-xs xl:text-[10px] text-gray-500">
                                {companyName}
                            </span>
                        </div>
                    </button>
                </div>
            </header>
        </>
    );
}

