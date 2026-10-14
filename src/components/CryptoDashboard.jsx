import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { FaChartLine, FaCheck, FaClock, FaArrowDown } from "react-icons/fa";

const CryptoDashboard = () => {
    const [activeTab, setActiveTab] = useState("ONRAMP");

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayDate = `${year}-${month}-${day}`;

    const [fromDate, setFromDate] = useState(todayDate);
    const [toDate, setToDate] = useState(todayDate);
    const [loading, setLoading] = useState(false);


    const [dashboardData, setDashboardData] = useState({
        total_count: 0,
        success_count: 0,
        failed_count: 0,
        pending_count: 0,
        total_amount: 0,
        success_amount: 0,
        failed_amount: 0,
        pending_amount: 0,
    });

    const formatDate = (date) => {
        if (!date) {
            return "";
        }
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    };

    // RESET DATA
    const resetDashboardData = () => {
        setDashboardData({
            total_count: 0,
            success_count: 0,
            failed_count: 0,
            pending_count: 0,

            total_amount: 0,
            success_amount: 0,
            failed_amount: 0,
            pending_amount: 0,
        });
    };

    // FETCH DASHBOARD
    const fetchDashboard = async () => {
        if (!fromDate || !toDate) {
            return;
        }
        try {
            setLoading(true);
            const apiUrl =
                activeTab === "ONRAMP"
                    ? "/meOnRampDashboard"
                    : "/meOffRampDashboard";

            const requestBody = {
                fromDate: formatDate(fromDate),
                toDate: formatDate(toDate),
            };
            const response = await axiosInstance.post(
                apiUrl,
                requestBody
            );
            if (response?.respCode === 0) {
                setDashboardData(response.respData || {});
            } else {
                resetDashboardData();
            }
        } catch (error) {
            resetDashboardData();
        } finally {
            setLoading(false);
        }
    };

   useEffect(() => {
    fetchDashboard();
   },[activeTab]);

    // AMOUNT FORMAT
    const formatAmount = (amount) => {
        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "₹0.00";
        }
        const number = Number(amount);
        if (isNaN(number)) {
            return "₹0.00";
        }
        return `₹${number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    // CARD CONFIGURATION
    const getCards = () => {
        if (activeTab === "ONRAMP") {
            return [
                {
                    title: "Total Transactions",
                    count: dashboardData.total_count,
                    amount: dashboardData.total_amount,
                    icon: <FaChartLine />,
                    iconClass: "total",
                },
                {
                    title: "Successful Transactions",
                    count: dashboardData.success_count,
                    amount: dashboardData.success_amount,
                    icon: <FaCheck />,
                    iconClass: "success",
                },
                {
                    title: "Pending Transactions",
                    count: dashboardData.pending_count,
                    amount: dashboardData.pending_amount,
                    icon: <FaClock />,
                    iconClass: "pending",
                },
            ];
        }

        // OFFRAMP
        return [
            {
                title: "Total Transactions",
                count: dashboardData.total_count,
                amount: dashboardData.total_amount,
                icon: <FaArrowDown />,
                iconClass: "total",
            },
            {
                title: "Successful Transactions",
                count: dashboardData.success_count,
                amount: dashboardData.success_amount,
                icon: <FaCheck />,
                iconClass: "success",
            },
            {
                title: "Failed Transactions",
                count: dashboardData.failed_count,
                amount: dashboardData.failed_amount,
                icon: <FaClock />,
                iconClass: "failed",
            },
        ];
    };

    return (
        <div className="w-full min-h-screen bg-white text-gray-900 px-3">
            <div className="px-2 pt-5 pb-[15px] flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-2xl font-semibold">
                        Crypto Order Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-800">
                        Monitor your business performance with key metrics, transaction insights, payment activity, and real-time updates.
                    </p>
                </div>
                {/* RIGHT - Date Filters + Search */}
                <div className="flex flex-col sm:flex-row items-end gap-3">
                    <div className="w-full sm:w-44">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            max={todayDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div className="w-full sm:w-44">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            To Date
                        </label>
                        <input
                            type="date"
                            max={todayDate}
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <button
                        onClick={fetchDashboard}
                        disabled={loading}
                        className={`bg-[#fec931] text-black px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium shadow
                                  transition ${loading ? "opacity-60 cursor-not-allowed"
                                : "opacity-100"
                            }
                             `}
                    >
                        {loading ? "Loading..." : "Search"}
                    </button>
                </div>
            </div>

            <div className="flex items-end gap-[30px] h-[55px] border-b border-[#dfe3e8] pl-2">
                <button
                    onClick={() => setActiveTab("ONRAMP")}
                    className={`
                        relative h-[55px] px-[7px] border-0 bg-transparent
                        cursor-pointer text-[12px] font-medium
                         ${activeTab === "ONRAMP"
                            ? "text-[#fec931]"
                            : "text-black"
                        }
                    `}
                >
                    ONRAMP
                    {activeTab === "ONRAMP" && (
                        <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-[#fec931] rounded-t-full" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab("OFFRAMP")}
                    className={`
                        relative h-[55px] px-[7px] border-0 bg-transparent
                        cursor-pointer text-[11px] font-medium
                       ${activeTab === "OFFRAMP"
                            ? "text-[#fec931]"
                            : "text-black"
                        }
                    `}
                >
                    OFFRAMP
                    {activeTab === "OFFRAMP" && (
                        <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] bg-[#fec931] rounded-t-full" />
                    )}
                </button>
            </div>

            {/* ========= MAIN CONTENT ======= */}
            <div className="px-2 py-[22px]">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-3">
                    <div>
                        <h3 className="m-0 text-lg font-semibold text-gray-900">
                            {activeTab === "ONRAMP"
                                ? "OnRamp Transactions"
                                : "OffRamp Transactions"}
                        </h3>
                        <p className="mt-1 mb-0 text-xs text-gray-500">
                            {activeTab === "ONRAMP"
                                ? "Monitor fiat to crypto transactions"
                                : "Monitor crypto to fiat transactions"}
                        </p>
                    </div>
                </div>

                {/* =========== CARDS============== */}

                <div className="grid grid-cols-3 gap-4">
                    {getCards().map((card, index) => (
                        <div key={index}
                            className="bg-white border border-gray-200 rounded-[6px] p-[18px]
                                shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-lg text-gray-900 mb-2 font-medium">
                                        {card.title}
                                    </div>
                                    <div className="text-2xl font-semibold text-gray-900">
                                        {card.count ?? 0}
                                    </div>
                                </div>
                                <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center text-[19px] font-semibold
                                        ${card.iconClass === "success"
                                        ? "bg-green-500 text-white"
                                        : card.iconClass === "pending"
                                            ? "bg-red-500 text-white"
                                            : card.iconClass === "failed"
                                                ? "bg-red-500 text-white"
                                                : "bg-[#fec931] text-black"
                                    }
                                    `}
                                >
                                    {card.icon}
                                </div>
                            </div>
                            <div className="h-px bg-[#eeeeee] my-4"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-900">
                                    Transaction Amount
                                </span>
                                <span className="text-[14px] font-semibold text-gray-900">
                                    {formatAmount(card.amount)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {loading && (
                    <div className="text-center mt-5 text-[12px] text-[#777]">
                        Loading dashboard...
                    </div>
                )}
            </div>
        </div>
    );
};

export default CryptoDashboard;