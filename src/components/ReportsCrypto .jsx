import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { FaSearch, FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";


// Main Component
export default function ReportsCrypto () {

    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [activeTab, setActiveTab] = useState("ONRAMP");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        return `${d}/${m}/${y}`;
    };

    // Fetch Report
    const fetchData = async (
        currentPage = 0,
        currentSize = size,
        reportType = activeTab
    ) => {
        if (!fromDate || !toDate) {
            alert("Please select From Date and To Date");
            return;
        }
        if (new Date(fromDate) > new Date(toDate)) {
            alert("From Date cannot be greater than To Date");
            return;
        }
        try {
            setLoading(true);
            const apiUrl =
                reportType === "ONRAMP"
                    ? "/meOnRampTxnReport"
                    : "/meOffRampTxnReport";

            const response = await axiosInstance.post(
                `${apiUrl}?page = ${currentPage}& size=${currentSize}`,
                {
                    fromDate: formatDate(fromDate),
                    toDate: formatDate(toDate),
                }
            );

            if (response?.respCode === 0) {
                setData(response.data || []);
                setTotalPages(response.totalPages || 0);
                setTotalRecords(response.totalRecords || 0);
                setPage(currentPage);
                setSearched(true);

            } else {
                setData([]);
                setTotalPages(0);
                setTotalRecords(0);
                setSearched(true);
            }
        } catch (error) {
            setData([]);
            setTotalPages(0);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    // ───────────────────────────────────────────────────────────────────────────
    // Initial API call + tab switching    
    // When page opens:
    // ONRAMP API automatically called
    // When user changes:
    // ONRAMP → OFFRAMP
    // OFFRAMP → ONRAMP    
    // API automatically called
    // ───────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        setPage(0);
        setData([]);
        setTotalPages(0);
        setTotalRecords(0);
        fetchData(0, size, activeTab);
    }, [activeTab]);

    // Search
    const handleSearch = () => {
        setPage(0);
        fetchData(0, size, activeTab);
    };

    // Pagination
    const handlePageChange = (newPage) => {
        if (
            newPage < 0 ||
            newPage >= totalPages ||
            loading
        ) { return; }
        fetchData(newPage, size, activeTab);
    };

    // Page Size
    const handleSizeChange = (newSize) => {
        const parsedSize = Number(newSize);
        setSize(parsedSize);
        setPage(0);
        fetchData(0, parsedSize, activeTab);
    };

    // Pagination numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages === 0) {
            return pages;
        }
        let start = Math.max(
            0,
            page - Math.floor(maxVisible / 2)
        );
        let end = Math.min(
            totalPages - 1,
            start + maxVisible - 1
        );
        if (
            end - start <
            maxVisible - 1
        ) {
            start = Math.max(
                0,
                end - maxVisible + 1
            );
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    // Excel Export
    const exportToExcel = () => {
        if (!data || data.length === 0) {
            alert("No data available for export");
            return;
        }
        const exportData = data.map((item) => {
            if (activeTab === "ONRAMP") {
                return {                   

                    "Merchant Order ID":
                        item.merchant_order_id ??
                        item.merchantOrderId ??
                        "",

                    "Order ID":
                        item.order_id ??
                        item.orderId ??
                        "",

                    "Provider Order ID":
                        item.provider_order_id ??
                        item.providerOrderId ??
                        "",

                    "Buy Token Address":
                        item.buy_token_address ??
                        item.buyTokenAddress ??
                        "",

                    "Buy Token Symbol":
                        item.buy_token_symbol ??
                        item.buyTokenSymbol ??
                        "",

                    "Chain ID":
                        item.chain_id ??
                        item.chainId ??
                        "",

                    "Fiat Amount":
                        item.fiat_amount ??
                        item.fiatAmount ??
                        "",

                    "Fiat Currency":
                        item.fiat_currency ??
                        item.fiatCurrency ??
                        "",

                    "Payment Mode":
                        item.payment_mode ??
                        item.paymentMode ??
                        "",

                    "Receiver Address":
                        item.receiver_address ??
                        item.receiverAddress ??
                        "",

                    "Email":
                        item.email_id ??
                        item.emailId ??
                        "",

                    "UTR":
                        item.utr ?? "",

                    "Created At":
                        item.created_at ??
                        item.createdAt ??
                        "",

                    "Response At":
                        item.response_at ??
                        item.responseAt ??
                        "",

                    "Status":
                        item.status ?? "",
                };
            }

            // OFFRAMP
            return {                
                "Merchant Order ID":
                    item.merchant_order_id ??
                    item.merchantOrderId ??
                    "",

                "Order ID":
                    item.order_id ??
                    item.orderId ??
                    "",

                "Sell Token Symbol":
                    item.sell_token_symbol ??
                    item.sellTokenSymbol ??
                    "",

                "Sell Token Address":
                    item.sell_token_address ??
                    item.sellTokenAddress ??
                    "",

                "Chain ID":
                    item.chain_id ??
                    item.chainId ??
                    "",

                "Crypto Amount":
                    item.crypto_amount ??
                    item.cryptoAmount ??
                    "",

                "Fiat Amount":
                    item.fiat_amount ??
                    item.fiatAmount ??
                    "",

                "Fiat Currency":
                    item.fiat_currency ??
                    item.fiatCurrency ??
                    "",

                "Receiver Address":
                    item.receiver_address ??
                    item.receiverAddress ??
                    "",

                "UTR":
                    item.utr ?? "",

                "Created At":
                    item.created_at ??
                    item.createdAt ??
                    "",

                "Response At":
                    item.response_at ??
                    item.responseAt ??
                    "",

                "Status":
                    item.status ?? "",
            };

        });

        const worksheet =
            XLSX.utils.json_to_sheet(exportData);
        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            activeTab
        );
        XLSX.writeFile(
            workbook,
            `${activeTab} _Crypto_Transaction_Report.xlsx`
        );
    };

    // Table columns
    const renderTableHeaders = () => {
        if (activeTab === "ONRAMP") {
            return (
                <tr className="bg-[#fec931] text-black uppercase">                    
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Merchant Order ID</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Order ID</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Buy Token Symbol</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Chain ID</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Fiat Amount</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Transaction Fee</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">TDS Fee</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Currency</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Payment Mode</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Receiver Address</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">UTR</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Created At</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Response At</th>
                    <th className="px-3 py-2.5 whitespace-nowrap font-medium">Status</th>
                </tr>
            );
        }

        return (
            <tr className="bg-[#fec931] text-black uppercase">              
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Merchant Order ID</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Order ID</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Sell Token Symbol</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Sell Token Address</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Sell Token Amount</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Sender Wallet Address</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Chain ID</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Fiat Amount</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Currency</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Payment Mode</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Account Number</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Ifsc</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Created At</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Response At</th>
                <th className="px-3 py-2.5 whitespace-nowrap font-medium">Status</th>
            </tr>
        );
    };

    // Table Row
    const renderTableRow = (item, index) => {
        const getValue = (snake, camel) =>
            item?.[snake] ??
            item?.[camel] ??
            "";

        return (
            <tr key={index}>
                
                <td className="px-3 py-2.5">{getValue("merchantOrderId")}</td>
                <td className="px-3 py-2.5">{getValue("orderId")}</td>

                {activeTab === "ONRAMP" ? (
                    <>
                       
                        <td className="px-3 py-2.5">{getValue("buyTokenSymbol")}</td>
                        <td className="px-3 py-2.5">{getValue("chainId")}</td>
                        <td className="px-3 py-2.5">{getValue("fiatAmount")} </td>
                        <td className="px-3 py-2.5">{getValue("transactionFee")} </td>
                        <td className="px-3 py-2.5">{getValue("tdsFee")} </td>
                        <td className="px-3 py-2.5">{getValue("fiatCurrency")}</td>
                        <td className="px-3 py-2.5">{getValue("paymentMode")}</td>
                        <td className="px-3 py-2.5">{item?.receiverAddress || "-"}</td>
                        <td className="px-3 py-2.5">{item?.utr || "-"}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{getValue("createdAt")}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{getValue("responseAt")}</td>
                        <td className="px-3 py-2.5">
                            <StatusBadge
                                status={item?.status}
                            />
                        </td>
                    </>
                ) : (
                    <>
                        <td className="px-3 py-2.5">{getValue("sellTokenSymbol")}</td>
                        <td className="px-3 py-2.5">{getValue("sellTokenAddress")}</td>
                        <td className="px-3 py-2.5">{getValue("sellTokenAmount")}</td>
                        <td className="px-3 py-2.5">{getValue("senderWalletAddress")}</td>
                        <td className="px-3 py-2.5">{getValue("chainId")}</td>
                        <td className="px-3 py-2.5">{getValue("fiatAmount")}</td>
                        <td className="px-3 py-2.5">{getValue("fiatCurrency")}</td>
                        <td className="px-3 py-2.5">{getValue("paymentMode")}</td>
                        <td className="px-3 py-2.5">{getValue("bankAccountNumber")}</td>
                        <td className="px-3 py-2.5">{getValue("bankIfsc")}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{getValue("createdAt")}</td>
                        <td className="px-3 py-2.5 whitespace-nowrap">{getValue("responseAt")}</td>
                        <td className="px-3 py-2.5">
                            <StatusBadge
                                status={item?.status}
                            />
                        </td>
                    </>
                )}
            </tr>
        );
    };

    const filteredData = data.filter((item) => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;
        return Object.values(item).some((value) =>
            String(value ?? "").toLowerCase().includes(search)
        );
    });

    return (
        <div className="min-h-screen p-4 w-full overflow-x-auto">
            <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-2xl font-semibold text-[#1A2233]">
                    Crypto Transaction Report
                </h1>
                <p className="pb-3 text-sm text-slate-800">
                    View and monitor crypto transaction records with detailed reports, status tracking, payment insights, and export options.
                </p>
            </div>

            {/*  ONRAMP / OFFRAMP TOGGLE */}
            <div className="mb-5">
                <div className="flex items-center gap-8 border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab("ONRAMP")}
                        className={`
                        relative
                        px-2
                        pb-3
                        text-sm
                        font-semibold
                        transition-all
                        duration-200
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
                        type="button"
                        onClick={() => setActiveTab("OFFRAMP")}
                        className={`
                        relative
                        px-2
                        pb-3
                        text-sm
                        font-semibold
                        transition-all
                        duration-200
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
            </div>

            {/* Filter Bar */}
            <div className="mb-5">
                <div className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
                    <div className="w-full md:w-52">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            max={today}
                            onChange={(e) =>
                                setFromDate(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div className="w-full md:w-52">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            max={today}
                            onChange={(e) =>
                                setToDate(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    {/* Search */}
                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-[#fec931] disabled:bg-gray-300 disabled:cursor-not-allowed
                        text-black px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm
                        font-normal shadow transition">
                        <FaSearch />
                        {loading
                            ? "Searching..."
                            : "Search"
                        }
                    </button>

                    {/* Excel */}
                    <button
                        type="button"
                        onClick={exportToExcel}
                        disabled={
                            loading ||
                            !data.length
                        }
                        className="
                        bg-green-600                       
                        disabled:bg-gray-400
                        disabled:cursor-not-allowed
                        text-white
                        px-6
                        py-2.5
                        rounded-lg
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        shadow
                        transition
                        ">
                        <FaFileExcel />
                        Excel
                    </button>
                </div>
            </div>

            {/* Report Info */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-[#1A2233]">
                    {activeTab === "ONRAMP"
                        ? "ONRAMP Transactions"
                        : "OFFRAMP Transactions"
                    }
                </h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6">
                <div className="w-full">
                    {/* Search */}
                    <div className="flex justify-end mb-4">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex items-center gap-3 text-sm">
                                <span className="text-slate-600 font-medium">Show</span>
                                <select
                                    value={size}
                                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                                    className="border border-gray-300 rounded px-2 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#fec931]"                >
                                    <option value={10}>10</option>
                                    <option value={25}>25 </option>
                                    <option value={50}>50 </option>
                                </select>
                                <span className="text-slate-600 font-medium">entries</span>
                            </div>

                            <div className="relative">
                                <FaSearch className="absolute top-4 left-3 text-slate-400 text-sm" />
                                <input
                                    type="text"
                                    placeholder="Search merchant..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-slate-300 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#fec931]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto overflow-y-hidden">
                        <div className="min-w-[1800px]">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-100 text-gray-700">
                                    {renderTableHeaders()}
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={
                                                    activeTab === "ONRAMP"
                                                        ? 12
                                                        : 11
                                                }
                                                className="text-center py-10 text-gray-500">
                                                Loading {activeTab} transactions...
                                            </td>
                                        </tr>
                                    ) : filteredData.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={
                                                    activeTab === "ONRAMP"
                                                        ? 12
                                                        : 11
                                                }
                                                className="text-center py-10 text-gray-500">
                                                No {activeTab} transactions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map(
                                            (item, index) => renderTableRow(item, index)
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/*  Pagination  */}
                    {totalPages > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5">
                            <div className="text-sm text-gray-500">
                                Showing page{" "}
                                <span className="font-semibold text-gray-800">
                                    {page + 1}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-gray-800">
                                    {totalPages}
                                </span>
                            </div>

                            {/* Page Buttons */}
                            <div className="flex items-center gap-1">
                                {/* Previous */}
                                <button
                                    type="button"
                                    disabled={page === 0 || loading}
                                    onClick={() => handlePageChange(page - 1)}
                                    className="
                                    px-3 py-2
                                    border border-gray-300
                                    rounded-lg
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    hover:bg-gray-100
                                "
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
                                {getPageNumbers().map((pageNumber) => (
                                    <button
                                        type="button"
                                        key={pageNumber}
                                        onClick={() =>
                                            handlePageChange(pageNumber)
                                        }
                                        disabled={loading}
                                        className={`
                                        min-w-[40px]
                                        px-3 py-2
                                        rounded-lg
                                        border
                                        ${page === pageNumber
                                                ? "bg-[#fec931] border-[#fec931] text-black font-semibold"
                                                : "border-gray-300 hover:bg-gray-100"
                                            }
                                     `}
                                    >
                                        {pageNumber + 1}
                                    </button>
                                ))}

                                {/* Next */}
                                <button
                                    type="button"
                                    disabled={
                                        page >= totalPages - 1 ||
                                        loading
                                    }
                                    onClick={() =>
                                        handlePageChange(page + 1)
                                    }
                                    className="
                                    px-3 py-2
                                    border border-gray-300
                                    rounded-lg
                                    disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    hover:bg-gray-100
                                    ">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Status Badge
function StatusBadge({ status }) {
    const normalizedStatus =
        String(status || "")
            .toUpperCase();

    let className =
        "bg-gray-100 text-gray-700";

    if (
        normalizedStatus === "SUCCESS" ||
        normalizedStatus === "COMPLETED" ||
        normalizedStatus === "SUCCESSFUL"
    ) {
        className =
            "bg-green-100 text-green-700";
    }
    if (
        normalizedStatus === "FAILED" ||
        normalizedStatus === "FAILURE" ||
        normalizedStatus === "REJECTED"
    ) {
        className = "bg-red-100 text-red-700";
    }
    if (
        normalizedStatus === "PAYMENT_PENDING" ||
        normalizedStatus === "CRYPTO_PENDING"
    ) {
        className = "bg-yellow-100 text-yellow-700";
    }

    return (
        <span
            className={`inline-flex px-2.5 py-1 rounded-full  text-xs font-semibold ${className}`}>
            {status || "-"}
        </span>
    );
}