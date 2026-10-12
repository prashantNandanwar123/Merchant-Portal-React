import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import CreatePaymentLinkModal from "../pages/CreatePaymentLinkModal";

const TABS = ["All", "Active", "Expire"];

function StatusBadge({ status }) {
    const isActive = status === "Active";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                }`}>
            {status}
        </span>
    );
}

export default function PaymentLinks() {

    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [paymentData, setPaymentData] = useState({});

    const today = (() => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    })();

    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    // ---- Pagination state ----
    const [page, setPage] = useState(0); // 0-indexed- first
    const [size, setSize] = useState(10); // 10 - end

    // 🔹 Convert YYYY-MM-DD → DD/MM/YYYY HH:mm:ss
    const formatDate = (date) => {
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    };

    // ---- Tab state ----
    const filteredData = accounts.filter((item) => {
        const search = searchText.trim().toLowerCase();
        const tabMatch =
            activeTab === "All" ||
            (activeTab === "Active" &&
                String(item.linkStatus || "").toLowerCase() === "active") ||
            (activeTab === "Expire" &&
                String(item.linkStatus || "").toLowerCase() === "expired");

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

    // FetchManual Orders ApI Call      
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
    useEffect(() => {
        fetchManualOrders();
    }, []);

    // Handle Close Function
    const handleClosePaymentModal = async () => {
        setOpenModal(false);
        setShowLinkPopup(false)
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
            <div className="bg-white px-5 sm:px-6 lg:px-10 xl:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 xl:gap-2 py-5 xl:py-3 border-b border-gray-100">
                    <div>
                        <h1 className="text-xl lg:text-2xl xl:text-lg font-semibold text-gray-900 cursor-default">
                            Payment Links
                        </h1>
                        <p className="text-xs sm:text-sm lg:text-base xl:text-xs text-gray-500 mt-1 cursor-default">
                            Generate secure payment links and share them with customers instantly.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => {
                                setPaymentData({
                                    orderId: `ORD${Date.now()}`,
                                    mode: "PAYIN",
                                    agentName: "",
                                });
                                setOpenModal(true);
                            }}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#fec931] text-black text-sm xl:text-xs font-medium px-4 py-2.5 xl:px-3 xl:py-2 rounded-lg">
                            <Plus size={16} />
                            New Payment Link
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 sm:gap-6 xl:gap-3 px-3 sm:px-6 xl:px-2 border-b border-gray-100 overflow-x-auto hide-scrollbar">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 xl:py-2 text-sm xl:text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                                ? "border-black text-black"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                              >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Filters */}
                <div className="w-full  xl:p-2 my-4 xl:my-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 xl:gap-2">
                    {/* Left Side - From Date + To Date */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 xl:gap-3">
                        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                            <label
                                htmlFor="fromDate"
                                className="text-xs sm:text-sm xl:text-xs font-medium text-gray-700 whitespace-nowrap"
                            >
                                From Date
                            </label>
                            <input
                                id="fromDate"
                                type="date"
                                value={fromDate}
                                max={today}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full sm:w-[140px] xl:w-[130px] h-10 sm:h-11 xl:h-9 rounded-lg border border-gray-300 bg-white px-3 xl:px-2 text-xs sm:text-sm xl:text-xs font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                            <label
                                htmlFor="toDate"
                                className="text-xs sm:text-sm xl:text-xs font-medium text-gray-700 whitespace-nowrap"
                            >
                                To Date
                            </label>
                            <input
                                id="toDate"
                                type="date"
                                value={toDate}
                                max={today}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full sm:w-[140px] xl:w-[130px] h-10 sm:h-11 xl:h-9 rounded-lg border border-gray-300 bg-white px-3 xl:px-2 text-xs sm:text-sm xl:text-xs font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={fetchManualOrders}
                            className="h-10 sm:h-11 xl:h-9 px-6 sm:px-8 xl:px-5 rounded-lg bg-[#fec931] text-black font-medium text-sm xl:text-xs border-none whitespace-nowrap transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                        >
                            <Search size={16} strokeWidth={2} />
                            <span>Search</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-3 xl:gap-2  xl:pt-3 mb-3 px-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm xl:text-xs text-gray-600">
                                Show
                            </span>
                            <select
                                value={size}
                                onChange={(e) => {
                                    setSize(Number(e.target.value));
                                    setPage(0);
                                }}
                                className="rounded-lg border border-gray-300 px-3 py-2 xl:px-2 xl:py-1 text-sm xl:text-xs outline-none focus:ring-1 focus:ring-[#fec931]">
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-sm xl:text-xs text-gray-600">
                                entries
                            </span>
                        </div>

                        {/* Search - Right Side */}
                        <div className="relative w-full sm:w-72 md:w-80 xl:w-64">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Agent / MID / Order ID..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="h-10 sm:h-11 xl:h-9 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-xs sm:text-sm xl:text-xs outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                    {/* Table */}
                    <div className="w-full max-h-[420px] overflow-auto">
                        <table className="w-full min-w-[1200px] text-sm xl:text-[11px] border-collapse">
                            <thead className="sticky top-0 z-30 bg-[#FEC931]">
                                <tr className="border-b border-gray-200">
                                    <th className="w-[6%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-3 xl:py-1 border border-gray-200"
                                        style={{ paddingBlock: "10px" }}>
                                        S.No
                                    </th>
                                    <th className="w-[15%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-3 xl:py-1 border border-gray-200">
                                        Order ID
                                    </th>
                                    <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                                        MID
                                    </th>
                                    <th className="w-[12%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1  border border-gray-200">
                                        Agent
                                    </th>
                                    <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1  border border-gray-200">
                                        Mode
                                    </th>
                                    <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1  border border-gray-200">
                                        Amount
                                    </th>
                                    <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1  border border-gray-200">
                                        Status
                                    </th>
                                    <th className="w-[12%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1  border border-gray-200">
                                        Link Status
                                    </th>
                                    <th className="w-[12%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1  border border-gray-200">
                                        Date
                                    </th>
                                    <th className="w-[15%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1  border border-gray-200">
                                        Url
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {displayData.length > 0 ? (
                                    displayData.map((acc, index) => (
                                        <tr
                                            key={acc.id}
                                            className="border-b border-gray-50 hover:bg-gray-50/50 h-[45px] xl:h-[26px]"
                                        >
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 text-gray-600 font-medium border border-gray-200">
                                                {page * size + index + 1}
                                            </td>
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 text-black font-medium border border-gray-200">
                                                {acc.orderId}
                                            </td>
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 text-gray-600 border border-gray-200">
                                                {acc.mid}
                                            </td>
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 text-gray-600 border border-gray-200">
                                                {acc.agentName}
                                            </td>
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 text-gray-600 border border-gray-200">
                                                {acc.mode}
                                            </td>
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 text-gray-600 border border-gray-200">
                                                ₹
                                                {Number(acc.txnAmount).toLocaleString("en-IN", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 whitespace-nowrap border border-gray-200">
                                                <StatusBadge status={acc.orderStatus} />
                                            </td>
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 text-gray-600 border border-gray-200">
                                                {acc.linkStatus}
                                            </td>
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 text-gray-600 border border-gray-200">
                                                {acc.creation_Date}
                                            </td>
                                            <td className="px-4 xl:px-2 py-2 xl:py-0.5 text-black whitespace-nowrap border border-gray-200">
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
                                            className="text-center py-10 xl:py-6 text-gray-400"
                                        >
                                            No Payment Links Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* ================= Pagination ================= */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 xl:gap-2 py-3 px-3">
                        {/* Left Side */}
                        <div className="text-sm xl:text-xs text-gray-500 text-center md:text-left">
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
                        <div className="flex items-center justify-center gap-2 xl:gap-1.5">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className=" px-4
                                            py-2
                                            xl:px-3
                                            xl:py-1.5
                                            xl:text-sm
                                            rounded-lg
                                            border
                                            bg-white
                                            hover:bg-gray-100
                                            disabled:opacity-50
                                            disabled:cursor-not-allowed
                                            transition
                                            ">
                                Prev
                            </button>

                            <div className="
                                min-w-[42px]
                                h-[42px]
                                xl:min-w-[34px]
                                xl:h-[34px]
                                xl:text-sm
                                rounded-lg
                                bg-[#fec931]
                                text-black
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
                                xl:px-3
                                xl:py-1.5
                                xl:text-sm
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
                    isOpen={openModal}
                    onClose={handleClosePaymentModal}
                    data={paymentData}
                    createPaymentLink={createPaymentLink}
                />
            </div>
        </>
    );
}