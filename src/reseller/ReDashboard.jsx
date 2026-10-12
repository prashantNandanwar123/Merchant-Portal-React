import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import axiosInstance from "../api/axios";

const EMPTY_DATA = {
    pending_count: 0,
    pending_amount: 0,
    pending_recommission: 0,
    success_count: 0,
    success_amount: 0,
    success_recommission: 0,
    failed_count: 0,
    failed_amount: 0,
    failed_recommission: 0,
    total_count: 0,
    total_amount: 0,
    total_recommission: 0,
};

export default function ReDashboard() {
      const today = new Date().toISOString().split("T")[0];

    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    const [payinBank, setPayinBank] = useState("All Bank");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(EMPTY_DATA);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const resellerId = user?.resellerId;

    // YYYY-MM-DD -> DD/MM/YYYY
    const formatDate = (date) => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    };

    // Percentage of a status's count against total_count
    const getPercentage = (count) => {
        //success count =50
        //total count =150
        if (!data.total_count) return "0%";

        return `${((Number(count) / Number(data.total_count)) * 100).toFixed(2)}%`;
    };

    const formatAmount = (amt) =>
        `₹${Number(amt || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;


    const fetchResellerDashboard = async () => {
        if (!resellerId) {
            toast.error("Reseller ID not found");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                fromDate: formatDate(fromDate),
                toDate: formatDate(toDate),
            };

            const response = await axiosInstance.post(
                `/reseller/Dashboard/${resellerId}`,
                payload
            );

            if (response?.respCode === 0) {
                setData(response?.respData);
            } else {
                setData(response?.respData);
                toast.error(response?.respMsg);
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResellerDashboard();

    }, []);

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <main className="mx-auto max-w-6xl px-6 py-6">
                <h1 className="mb-5 text-xl font-bold text-slate-800">Dashboard Overview</h1>

                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    {/* From Date */}
                    <div className="w-full sm:w-auto">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full sm:w-[140px] md:w-[150px] xl:w-[130px] rounded-lg border border-gray-300 px-2 py-1.5 xl:py-1 text-xs sm:text-sm xl:text-xs focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                    </div>

                    {/* To Date */}
                    <div className="w-full sm:w-auto">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full sm:w-[140px] md:w-[150px] xl:w-[130px] rounded-lg border border-gray-300 px-2 py-1.5 xl:py-1 text-xs sm:text-sm xl:text-xs focus:ring-2 focus:ring-yellow-400 outline-none"
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={() => {
                            console.log("Search button clicked");
                            fetchResellerDashboard();
                        }}
                        disabled={loading}
                        className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 xl:px-5 xl:py-2 text-xs sm:text-sm xl:text-xs text-white rounded-lg transition ${loading
                            ? "bg-yellow-300 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"
                            }`}
                    >
                        <FaSearch className="text-base" />
                        <span>{loading ? "Loading..." : "Search"}</span>
                    </button>
                </div>

                {/* Payin */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-800">Payin</h2>
                        <select
                            value={payinBank}
                            onChange={(e) => setPayinBank(e.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option>All Bank</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                                    <th className="py-2 pr-4 font-medium">Status</th>
                                    <th className="py-2 pr-4 font-medium">Total Txns</th>
                                    <th className="py-2 pr-4 font-medium">Commission</th>
                                    <th className="py-2 pr-4 font-medium">Payin Amt</th>
                                    <th className="py-2 pr-4 font-medium">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*SUCCESS */}
                                <tr className="border-b border-slate-100">
                                    <td className="py-3 pr-4">
                                        <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                                            SUCCESS
                                        </span>
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {data?.success_count ?? 0}
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {formatAmount(data?.success_recommission)}
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {formatAmount(data?.success_amount)}
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {getPercentage(data?.success_count)}
                                    </td>
                                </tr>
                                {/*PENDING */}
                                <tr className="border-b border-slate-100">
                                    <td className="py-3 pr-4">
                                        <span className="rounded-md bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-600">
                                            PENDING
                                        </span>
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {data?.pending_count ?? 0}
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {formatAmount(data?.pending_recommission)}
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {formatAmount(data?.pending_amount)}
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {getPercentage(data?.pending_count)}
                                    </td>
                                </tr>
                                {/*FAILED */}
                                <tr className="border-b border-slate-100">
                                    <td className="py-3 pr-4">
                                        <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                                            FAILED
                                        </span>
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {data?.failed_count ?? 0}
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {formatAmount(data?.failed_recommission)}
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {formatAmount(data?.failed_amount)}
                                    </td>

                                    <td className="py-3 pr-4 text-slate-700">
                                        {getPercentage(data?.failed_count)}
                                    </td>
                                </tr>

                                {/* Total */}
                                <tr className="font-semibold text-slate-800">
                                    <td className="py-3 pr-4">
                                        <span className="rounded-md bg-sky-50 px-2 py-1 text-xs text-sky-600">
                                            TOTAL
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4">
                                        {data?.total_count ?? 0}
                                    </td>
                                    <td className="py-3 pr-4">
                                        {formatAmount(data?.total_recommission)}
                                    </td>
                                    <td className="py-3 pr-4">
                                        {formatAmount(data?.total_amount)}
                                    </td>
                                    <td className="py-3 pr-4">
                                        100%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}