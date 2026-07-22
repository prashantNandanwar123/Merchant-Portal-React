import { useEffect, useState } from "react";
import { Plus, RefreshCw, ArrowUpDown, Filter, Search, Calendar } from "lucide-react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import CreatePaymentLinkModal from "../pages/CreatePaymentLinkModal";

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
    const today = new Date().toISOString().split("T")[0];

    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [searchText, setSearchText] = useState("");
    const [paymentData, setPaymentData] = useState({});

    // ---- Pagination state ----
    const [page, setPage] = useState(0); // 0-indexed- first
    const [size, setSize] = useState(10); // 10 - end

    // 🔹 Convert YYYY-MM-DD → DD/MM/YYYY HH:mm:ss
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // ---- Tab state ----
    const filteredData = accounts.filter((item) => {
        const search = searchText.trim().toLowerCase();
        const tabMatch =
            activeTab === "All" ||
            String(item.linkStatus || "").toLowerCase() === activeTab.toLowerCase();
        const searchableFields = [
            item.orderId,
            item.mid,
            item.agentName,
            item.orderStatus,
            item.linkStatus,
        ];
        const searchMatch =
            search === "" ||
            searchableFields.some((value) =>
                String(value ?? "").toLowerCase().includes(search)
            );
        return tabMatch && searchMatch;
    });

    // ---- Pagination Data ----
    const totalRecords = filteredData.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / size));
    const displayData = filteredData.slice(page * size, page * size + size);

    // ---- First Data ----
    useEffect(() => {
        fetchManualOrders();
    }, [fromDate, toDate]);

    const fetchManualOrders = async () => {
        try {
            setLoading(true);
            const payload = {
                fromDate: formatDate(fromDate),
                toDate: formatDate(toDate),
            };
            const response = await axiosInstance.post(
                "/fetchManualOrders",
                payload
            );
            setAccounts(response.respData || []);
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Close Function
    const handleClosePaymentModal = async () => {
        setOpenModal(false);
        await fetchManualOrders();
    }

    useEffect(() => {
        setPage(0);
    }, [activeTab, searchText, fromDate, toDate, size]);

    // pagination Logic
    useEffect(() => {
        if (page > 0 && page >= totalPages) {
            setPage(totalPages - 1);
        }
    }, [totalPages, page]
    )

    const createPaymentLink = async (modalData = {}) => {
        try {
            const payload = {
                orderId: modalData?.orderId || `ORD${Date.now()}`,
                mode: modalData?.mode || "PAYIN",
                agentName: modalData?.agentName || "Rohit",
                createdBy: "Rohit Sharma",
                createdByUserId: "HELLOPE10001",
            };
            const response = await axiosInstance.post(
                "/createManualOrder",
                payload
            );
            const responseData = response?.respData || {};
            // Save API response
            setPaymentData({
                ...responseData,
                agentName:
                    responseData?.agentName ||
                    payload.agentName,
            });
            toast.success(
                response?.respMsg
            );
            fetchManualOrders();
            return response;
        } catch (error) {
            toast.error(error);
            throw error;
        }
    };

    return (
        <>
            <div className="bg-white px-10">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h1 className="lg:text-2xl text-xl font-semibold text-gray-900 uppercase">
                        Payment Links
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setPaymentData({
                                    orderId: `ORD${Date.now()}`,
                                    mode: "PAYIN",
                                    agentName: "",
                                });
                                setOpenModal(true);
                            }}
                            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg"
                        >
                            <Plus size={16} />
                            New Payment Links
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
                <div className="w-full bg-white border border-gray-200 rounded-md p-3 flex flex-col sm:flex-row gap-3">
                    {/* First Row (Mobile): From Date + To Date */}
                    <div className="flex gap-3 w-full sm:w-auto">
                        {/* From Date */}
                        <div className="relative flex-1 sm:w-[140px]">
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none"
                            />
                        </div>

                        {/* To Date */}
                        <div className="relative flex-1 sm:w-[140px]">
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full h-11 rounded-lg border border-gray-300 bg-white px-4 pr-10 text-sm font-medium text-gray-700 outline-none"
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={fetchManualOrders}
                            className="h-11 px-6 sm:px-8 rounded-lg bg-[#1565F7] text-white font-medium border border-[#0D47A1] whitespace-nowrap"
                        >
                            Search
                        </button>
                    </div>

                    {/* Second Row (Mobile): Search Button + Search Input */}
                    <div className="flex gap-3 w-full">

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
                </div>

                {/* Show entries row — sits right above the table, aligned left */}
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            Show
                        </span>
                        <select
                            value={size}
                            onChange={(e) => {
                                setSize(Number(e.target.value));
                                setPage(0);
                            }}
                            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-600">
                            entries
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto overflow-y-auto max-h-[495px] bg-white rounded-xl shadow-sm border border-gray-100">                    <table className="w-full min-w-[1200px] text-sm table-fixed">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b border-gray-200">
                            <th className="w-[6%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-3">
                                S.No
                            </th>
                            <th className="w-[15%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-3">
                                Order ID
                            </th>
                            <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-2">
                                MID
                            </th>
                            <th className="w-[12%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-2">
                                Agent
                            </th>
                            <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-2">
                                Mode
                            </th>
                            <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-2">
                                Amount
                            </th>
                            <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-2">
                                Status
                            </th>
                            <th className="w-[12%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-2">
                                Link Status
                            </th>
                            <th className="w-[12%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-2">
                                Date
                            </th>
                            <th className="w-[15%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 py-2">
                                Url
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {displayData.length > 0 ? (
                            displayData.map((acc, index) => (
                                <tr
                                    key={acc.id}
                                    className="border-b border-gray-50 hover:bg-gray-50/50 h-[45px]"
                                >
                                    <td className="px-4 py-2 text-gray-600 font-medium">
                                        {page * size + index + 1}
                                    </td>
                                    <td className="px-4 py-2 text-blue-600 font-medium">
                                        {acc.orderId}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {acc.mid}
                                    </td>

                                    <td className="px-4 py-2 text-gray-600">
                                        {acc.agentName}
                                    </td>

                                    <td className="px-4 py-2 text-gray-600">
                                        {acc.mode}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        ₹
                                        {Number(acc.txnAmount).toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                    <td className="px-4 py-2">
                                        <StatusBadge status={acc.orderStatus} />
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {acc.linkStatus}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">
                                        {acc.creation_Date}
                                    </td>
                                    <td className="px-4 py-2 text-blue-600">
                                        <a
                                            href={acc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            View Link
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="text-center py-10 text-gray-400"
                                >
                                    No Payment Links Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>

                {/* ================= Pagination ================= */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 sm:px-6 py-4 lg:mb-0 my-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Left Side */}
                        <div className="text-sm text-gray-500 text-center md:text-left">
                            {totalRecords > 0 ? (
                                <>
                                    Showing{" "}
                                    <span className="font-semibold text-gray-700">
                                        {page * size + 1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold text-gray-700">
                                        {Math.min((page + 1) * size, totalRecords)}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-gray-700">
                                        {totalRecords}
                                    </span>{" "}
                                    entries
                                </>
                            ) : (
                                <>Showing 0 to 0 of 0 entries</>
                            )}
                        </div>
                        {/* Right Side */}
                        <div className="flex items-center justify-center gap-2">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className="
                                px-4
                                py-2
                                rounded-lg
                                border
                                bg-white
                                hover:bg-gray-100
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition
                                "
                            >
                                Prev
                            </button>

                            <div className="
                            min-w-[42px]
                            h-[42px]
                            rounded-lg
                            bg-yellow-500
                            text-white
                            flex
                            items-center
                            justify-center
                            font-semibold
                            shadow
                            ">
                                {page + 1}
                            </div>

                            <button
                                disabled={page + 1 >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="
                                px-4
                                py-2
                                rounded-lg
                                border
                                bg-white
                                hover:bg-gray-100
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition
                                "
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                <CreatePaymentLinkModal
                    isOpen={openModal}//true
                    onClose={handleClosePaymentModal}
                    data={paymentData}//api ka response
                    createPaymentLink={createPaymentLink}  //api call hua
                />
            </div>
        </>
    );
}