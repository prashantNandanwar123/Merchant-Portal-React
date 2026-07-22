import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRef } from "react";
import DashboardBottomSection from "../components/DashboardBottomSection";
import { FaRegCheckCircle, FaRegCalendarAlt } from "react-icons/fa";
import {
    Wallet,
    CheckCircle,
    XCircle,
    Clock3,
    RefreshCcw,
    IndianRupee,
    Check,
    X,
    Filter,
    CalendarDays,
    Download
} from "lucide-react";

const newLocal = "text-4xl font-bold text-gray-900 mt-3";
export default function Dashboard({ title, value, icon, iconBg }) {
    const [data, setData] = useState("");


    const formatDisplay = (val) => val.replace(/-/g, "/");
    const formatStore = (val) => val.replace(/\//g, "-");

    const today = new Date().toISOString().split("T")[0];

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [selectedFilter, setSelectedFilter] = useState("");


    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);


    // 🔹 Convert YYYY-MM-DD → DD/MM/YYYY HH:mm:ss
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Handle Quick Filter Logic
    const handleQuickFilter = (days) => {
        setSelectedFilter(days);

        const today = new Date();
        const from = new Date();

        from.setDate(today.getDate() - Number(days));

        setFromDate(from);
        setToDate(today);
    };

    useEffect(() => {
        fetchDashboard();
    }, [fromDate, toDate]);

    const fetchDashboard = async () => {
        try {
            const payload = {
                fromDate: formatDate(fromDate),
                toDate: formatDate(toDate),
            };
            const res = await axiosInstance.post("/mrchntDashboard", payload);
            setData(res.respData);
        } catch (error) {
            toast.error(error);
        }
    };

    if (!data) {
        return (
            <div className="h-screen flex items-center justify-center">
                No Data Found
            </div>
        );
    }

    const Card = ({ title, value, color = "from-blue-500 to-indigo-600" }) => {
        return (
            <div className={`p-5 h-32 rounded-xl shadow-md text-white bg-gradient-to-r ${color} 
            hover:scale-105 transition transform duration-300`}>
                <h2 className="text-sm font-medium opacity-90">{title}</h2>
                <p className="text-2xl font-bold mt-2">{value}</p>
            </div>
        );
    };

    // HandleExport
    const handleExport = () => {
        // yaha apni export logic likho
        console.log("Export clicked");
    };

    return (
        <div className="p-6 h-[calc(100vh-64px)] w-full max-w-full overflow-y-auto overflow-x-hidden hide-scrollbar">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
                {/* Left */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back,
                        <span className="text-blue-600 ml-2">
                            SuperUser 
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm font-normal">
                        Here's your real-time overview of transactions and performance.
                    </p>
                </div>

                {/* Right */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Date Range */}
                    <div className="flex items-center h-11 gap-3 px-3 rounded-xl border border-gray-200 bg-white shadow-sm">
                        <span className="text-sm text-gray-800 font-normal whitespace-nowrap">
                            From:
                        </span>
                        <input
                            ref={fromDateRef}
                            type="date"
                            value={fromDate ? fromDate.toISOString().split("T")[0] : ""}
                            onChange={(e) => setFromDate(new Date(e.target.value))}
                            onClick={() => fromDateRef.current?.showPicker()}
                            max={new Date().toISOString().split("T")[0]}
                            className="w-[125px] h-9 text-sm outline-none rounded-md px-2 cursor-pointer text-gray-700 font-medium"
                        />

                        <span className="text-sm text-gray-800 font-normal whitespace-nowrap">
                            To:
                        </span>
                        <input
                            ref={toDateRef}
                            type="date"
                            value={toDate ? toDate.toISOString().split("T")[0] : ""}
                            onChange={(e) => setToDate(new Date(e.target.value))}
                            onClick={() => toDateRef.current?.showPicker()}
                            min={fromDate ? fromDate.toISOString().split("")[0] : ""}
                            max={new Date().toISOString().split("T")[0]}
                            className="w-[125px] h-9 text-sm outline-none rounded-md px-2 cursor-pointer text-gray-700 font-medium"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={fetchDashboard}
                        className="h-11 px-5 min-w-[120px] rounded-xl border border-gray-200 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                        <Filter size={16} />
                        Search
                    </button>

                    {/* Filter Button */}
                    <div className="relative">
                        <Filter
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <select
                            value={selectedFilter}
                            onChange={(e) => handleQuickFilter(e.target.value)}
                            className="h-11 pl-10 pr-8 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium shadow-sm appearance-none cursor-pointer"
                        >
                            <option value="">Quick Filter</option>
                            <option value="7">Last 7 Days</option>
                            <option value="14">Last 14 Days</option>
                            <option value="21">Last 21 Days</option>
                            <option value="30">Last 30 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ================= DASHBOARD CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                {/* Total Transactions */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>

                    <div className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-semibold text-gray-500">
                                    Total Transactions
                                </p>

                                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                    {data.total_count || 0}
                                </h2>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Wallet className="text-blue-600" size={22} />
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs text-gray-500">
                                Amount
                            </p>

                            <h3 className="text-lg font-bold text-gray-900 mt-1">
                                ₹ {Number(data.total_amount || 0) / 100}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
                        <span className="text-green-600 text-xs font-semibold">
                            ↑ 12.5%
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                            vs last 7 days
                        </span>
                    </div>
                </div>


                {/* Success */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden relative min-h-[180px]">

                    <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-r-full"></div>

                    <div className="p-4">
                        <div className="flex justify-between items-start">

                            <div>
                                <p className="text-xs font-semibold text-gray-500">
                                    Successful Transactions
                                </p>

                                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                    {data.success_count || 0}
                                </h2>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <FaRegCheckCircle className="text-green-600" size={22} />
                            </div>

                        </div>


                        <div className="mt-4">
                            <p className="text-xs text-gray-500">
                                Amount
                            </p>

                            <h3 className="text-lg font-bold text-gray-900 mt-1">
                                ₹ {Number(data.success_amount || 0) / 100}
                            </h3>
                        </div>

                    </div>


                    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">

                        <span className="text-green-600 text-xs font-semibold">
                            ↑ 11.8%
                        </span>

                        <span className="text-gray-500 text-xs ml-2">
                            vs last 7 days
                        </span>

                    </div>

                </div>



                {/* Pending */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden relative min-h-[180px]">

                    <div className="absolute left-0 top-0 h-full w-1 bg-yellow-500 rounded-r-full"></div>

                    <div className="p-4">

                        <div className="flex justify-between items-start">

                            <div>

                                <p className="text-xs font-semibold text-gray-500">
                                    Pending Transactions
                                </p>

                                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                    {data.pending_count || 0}
                                </h2>

                            </div>


                            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <Clock3 className="text-yellow-600" size={22} />
                            </div>

                        </div>


                        <div className="mt-4">

                            <p className="text-xs text-gray-500">
                                Amount
                            </p>

                            <h3 className="text-lg font-bold text-gray-900 mt-1">
                                ₹ {Number(data.pending_amount || 0) / 100}
                            </h3>

                        </div>

                    </div>


                    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">

                        <span className="text-red-500 text-xs font-semibold">
                            ↓ 4.3%
                        </span>

                        <span className="text-gray-500 text-xs ml-2">
                            vs last 7 days
                        </span>

                    </div>

                </div>



                {/* Failed */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden relative min-h-[180px]">

                    <div className="absolute left-0 top-0 h-full w-1 bg-red-500 rounded-r-full"></div>


                    <div className="p-4">

                        <div className="flex justify-between items-start">

                            <div>

                                <p className="text-xs font-semibold text-gray-500">
                                    Failed Transactions
                                </p>

                                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                    {data.failed_count || 0}
                                </h2>

                            </div>


                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                <X className="text-red-600" size={22} />
                            </div>

                        </div>


                        <div className="mt-4">

                            <p className="text-xs text-gray-500">
                                Amount
                            </p>

                            <h3 className="text-lg font-bold text-gray-900 mt-1">
                                ₹ {Number(data.failed_amount || 0) / 100}
                            </h3>

                        </div>

                    </div>


                    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">

                        <span className="text-red-500 text-xs font-semibold">
                            ↓ 7.6%
                        </span>

                        <span className="text-gray-500 text-xs ml-2">
                            vs last 7 days
                        </span>

                    </div>

                </div>

            </div>
            <DashboardBottomSection />
        </div>
    );
}

/* CARD COMPONENT */
function Card({ title, value }) {
    return (
        <div className="bg-white shadow-md rounded-xl p-5 border">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-xl font-bold mt-2">{value}</h2>
        </div>
    );
}