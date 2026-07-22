import { useEffect, useState } from "react";
import { Plus, RefreshCw, ArrowUpDown, Filter, Search, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

// import CreateVirtualAccountModal from "./CreateVirtualAccountModal";
const TABS = ["All", "Active", "Closed"];

function StatusBadge({ status }) {
    const isActive = status === "Active";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                }`}
        >
            {status}
        </span>
    );
}

export default function PaymentLinks() {

    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const filteredAccounts =
        activeTab === "All"
            ? accounts
            : accounts.filter((a) => a.status === activeTab);

    const displayData =
        filteredData.length > 0
            ? filteredData
            : filteredAccounts;

    const fetchManualOrders = async () => {
        try {
            setLoading(true);
            const payload = {
                fromDate: "01/07/2026",
                toDate: "18/07/2026"
            };
            const response = await axios.post(
                "/fetchManualOrders",
                payload
            );
            console.log("payload-->>>", payload);
            console.log("payload-->>>", response);

            setAccounts(response.respData || []);
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchManualOrders();
    }, []);

    const handleSearch = () => {
        const result = filteredAccounts.filter((item) => {
            const itemDate = new Date(item.date);
            const from = fromDate
                ? new Date(fromDate)
                : null;

            const to = toDate
                ? new Date(toDate)
                : null;

            const dateMatch =
                (!from || itemDate >= from) &&
                (!to || itemDate <= to);

            const search = searchText.toLowerCase();
            const textMatch =
                item.agent?.toLowerCase().includes(search) ||
                item.mid?.toLowerCase().includes(search) ||
                item.orderId?.toLowerCase().includes(search);

            return dateMatch && textMatch;
        });
        setFilteredData(result);
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-10 border-b border-gray-100">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Payment Links
                </h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                    >
                        <Plus size={16} strokeWidth={2.5} />
                        New Payment Links
                    </button>
                    <button
                        onClick={fetchManualOrders}
                        className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
                        <ArrowUpDown size={16} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 px-6 border-b border-gray-100">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="w-full bg-white border border-gray-200 rounded-md p-2 flex items-center gap-3">
                {/* From Date */}
                <div className="relative w-[140px]">
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none"
                    />
                    <Calendar
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                </div>

                {/* To Date */}
                <div className="relative w-[140px]">
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none"
                    />
                    <Calendar
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="h-11 px-8 rounded-lg bg-[#1565F7] text-white font-medium border border-[#0D47A1]"
                >
                    Search
                </button>

                {/* Search Input */}
                <div className="relative flex-1">
                    <Search
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search Agent / MID / Order ID..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full h-11 rounded-lg border border-gray-300 bg-white pl-11 pr-4 text-sm placeholder:text-gray-400 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                Order ID
                            </th>
                            <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                MID
                            </th>
                            <th className="text-right font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                Agent
                            </th>
                            <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                Mode
                            </th>
                            <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                Amount
                            </th>
                            <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                Status
                            </th>
                            <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                Link Status
                            </th>
                            <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                Date
                            </th>
                            <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                Url
                            </th>
                            <th className="text-left font-medium text-gray-400 uppercase text-xs tracking-wide px-6 py-3">
                                Action
                            </th>
                        </tr>
                        <tbody>
                            {filteredAccounts.length > 0 ? (
                                displayData.map((acc) => (
                                    <tr
                                        key={acc.id}
                                        className="border-b border-gray-50 hover:bg-gray-50/50"
                                    >
                                        <td className="px-6 py-4 text-blue-600 font-medium">
                                            {acc.orderId}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {acc.mid}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {acc.agent}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {acc.mode}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            ₹
                                            {Number(acc.amount).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={acc.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {acc.linkStatus}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {acc.date}
                                        </td>
                                        <td className="px-6 py-4 text-blue-600">
                                            <a href={acc.url} target="_blank">
                                                View Link
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-blue-600">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="10"
                                        className="text-center py-10 text-gray-400"
                                    >
                                        No Payment Links Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </thead>
                </table>
            </div>

            {/* <CreateVirtualAccountModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      /> */}
        </div>
    );
}