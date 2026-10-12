import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { CiExport } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { Filter, Search } from "lucide-react";


export default function ReportsPage() {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      // setData([]);
      // setTotalRecords(0);
      // setTotalPages(0);
      const payload = {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      };
      const response = await axiosInstance.post(`/meTxnReport?page=${page}&size=${size}`, payload);
      if (response.respCode === 0) {
        setData(response.data || []);
        setTotalPages(response.totalPages || 0);
        setTotalRecords(response.totalRecords || 0);
      } else {
        toast.error(response.respMsg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [page, size]);

  // Export Api Call
  const handleExport = async () => {
    try {
      const payload = {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      };
      const response = await axiosInstance.post(
        "/dwnMeTxnReport",
        payload,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Merchant_Transaction_Report.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      toast.error(error);
    }
  };

  // convert YYYY-MM-DD → DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  // Search
  const filteredData = data.filter((row) => {
    const matchSearch = row.some((cell) =>
      String(cell || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    const matchStatus =
      statusFilter === "" || row[5] === statusFilter;
    return matchSearch && matchStatus;
  });

  // Handle Quick Filter Logic
  const handleQuickFilter = (days) => {
    setSelectedFilter(days);
    const today = new Date();
    if (days === "") {
      setFromDate("");
      setToDate("");
      return;
    }
    // Date Function
    const from = new Date();
    from.setDate(today.getDate() - Number(days));
    const formattedFrom = from.toISOString().split("T")[0];
    const formattedTo = today.toISOString().split("T")[0];
    setFromDate(formattedFrom);
    setToDate(formattedTo);
  };

  return (

    <div
      className="h-screen bg-gray-50 p-3 sm:p-5 lg:p-6 xl:p-4 overflow-y-auto sm:overflow-hidden hide-scrollbar flex flex-col gap-4 sm:gap-6 xl:gap-3"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 xl:gap-3">
        <div className="flex-1">
          <h1 className="text-center md:text-left text-xl sm:text-2xl md:text-3xl xl:text-2xl font-semibold text-gray-800 cursor-default">
            Transaction Report
          </h1>
          <p className="text-xs sm:text-sm font-normal text-gray-500 mt-1 sm:mt-2 xl:mt-1 text-center md:text-left cursor-default">
            View and analyze your transaction data with detailed insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-2 xl:gap-1.5 w-full lg:w-auto">
          <div className="flex-1 sm:flex-none">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              max={today}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full sm:w-[140px] md:w-[150px] xl:w-[130px]
          rounded-lg border border-gray-300
          px-2 py-1.5 xl:py-1
          text-xs sm:text-sm xl:text-xs
          focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {/* To Date */}
          <div className="flex-1 sm:flex-none">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              To Date
            </label>
            <input
              type="date"
              max={today}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full sm:w-[140px] md:w-[150px] xl:w-[130px]
          rounded-lg border border-gray-300
          px-2 py-1.5 xl:py-1
          text-xs sm:text-sm xl:text-xs
          focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          </div>

          {/* Search */}
          <button
            onClick={() => {
              setPage(0);
              fetchReport();
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 xl:px-3 xl:py-1.5
            text-xs sm:text-sm xl:text-xs font-semibold bg-[#fec931] text-black rounded-lg transition">
            <Search size={16} strokeWidth={2} />
            <span>Search</span>
          </button>

          {/* Export */}
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 xl:px-3 xl:py-1.5
             text-xs sm:text-sm xl:text-xs border border-[#fec931] text-black rounded-lg hover:bg-[#fec931] transition"
          >
            <CiExport className="text-base" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="mx-2">
        {/* Search section no longer needed here */}
      </div>

      {/* ============== TABLE SECTION =========== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mx-2 md:mx-0">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 xl:gap-2 p-4 sm:p-5 xl:p-3">
          {/* Left */}
          <div className="flex items-center gap-2">
            <span className="text-sm xl:text-xs text-gray-600 cursor-default">
              Show
            </span>
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 xl:px-2 xl:py-1 text-sm xl:text-xs focus:ring-2 focus:ring-yellow-400">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm xl:text-xs text-gray-600 cursor-default">
              entries
            </span>
          </div>

          {/* Right */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 xl:gap-1.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 md:w-72 xl:w-56">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 xl:py-1.5 pl-10 xl:pl-9 pr-3 text-xs sm:text-sm xl:text-xs focus:ring-2 focus:ring-gray-100 outline-none"
              />
              <span className="absolute left-3 top-2.5 xl:top-2 text-gray-400">
                <FaSearch />
              </span>
            </div>

            {/* Status Filter */}
            <div className="relative w-full sm:w-auto">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 xl:h-8 w-full sm:w-auto pl-10 xl:pl-9 pr-8 text-xs sm:text-sm xl:text-xs rounded-lg border border-gray-300 bg-white text-gray-700 appearance-none cursor-pointer focus:ring-2 focus:ring-yellow-400">
                <option value="">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div
          className="
          w-full
          min-w-0
          max-h-[420px] xl:max-h-[450px]
          overflow-x-auto
          overflow-y-auto
          ">
          <table className="min-w-[1800px] text-sm xl:text-[11px]">
            <thead className="sticky top-0 z-30 bg-[#fec931] shadow-sm">
              <tr className="text-black">
                <th className="w-[2%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                  ID</th>
                <th className="w-[15%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                  Transaction Reference No.
                </th>
                <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                  Order No.
                </th>
                <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                  Date & Time
                </th>
                <th className="w-[12%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                  Payment Type
                </th>
                <th className="w-[10%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                  Txn Amount
                </th>
                <th className="px-3 xl:px-2 py-4 xl:py-2 text-left font-semibold whitespace-nowrap border border-gray-300">
                  MSF Fee
                </th>
                <th className="w-[13%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                  MSF GST Fee
                </th>
                <th className="w-[8%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                  Conv Fee
                </th>
                <th className="w-[12%] text-left font-medium text-gray-900 uppercase text-xs tracking-wide px-4 xl:px-2 py-2 xl:py-1 border border-gray-200">
                  Conv GST Fee
                </th>
                <th className="px-3 xl:px-2 py-4 xl:py-2 text-left font-semibold whitespace-nowrap border border-gray-300">
                  Total Txn Amount
                </th>
                <th className="px-3 xl:px-2 py-4 xl:py-2 text-left font-semibold whitespace-nowrap border border-gray-300">
                  Status
                </th>
                <th className="px-3 xl:px-2 py-4 xl:py-2 text-left font-semibold whitespace-nowrap border border-gray-300">
                  Customer Name
                </th>
                <th className="px-3 xl:px-2 py-4 xl:py-2 text-left font-semibold whitespace-nowrap border border-gray-300">
                  Mobile No.
                </th>
                <th className="px-3 xl:px-2 py-4 xl:py-2 text-left font-semibold whitespace-nowrap border border-gray-300">
                  Email
                </th>
                <th className="px-3 xl:px-2 py-4 xl:py-2 text-left font-semibold whitespace-nowrap border border-gray-300">
                  UTR No.
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-yellow-50 transition"
                  >
                    <td className="px-5 xl:px-3 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      {page * size + index + 1}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      {row[0]}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      {row[1]}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      {row[2]}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      {row[3]}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      ₹ {(row[4] || 0) / 100}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      {row[10] || 0}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      {row[11] || 0}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      {row[12] || 0}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      {row[13] || 0}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 font-semibold text-green-600 whitespace-nowrap border border-gray-300">
                      ₹ {(row[14] || 0) / 100}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-300">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs xl:text-[10px] font-semibold
                    ${row[5] === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : row[5] === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {row[5]}
                      </span>
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-200">
                      {row[6]}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-200">
                      {row[7]}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-200">
                      {row[8]}
                    </td>
                    <td className="px-3 xl:px-2 py-1.5 xl:py-2 whitespace-nowrap border border-gray-200">
                      {row[9] || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={16}
                    className="py-20 xl:py-12 text-center border border-gray-200"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-6xl xl:text-4xl mb-4 xl:mb-2">
                        📄
                      </div>
                      <h3 className="text-xl xl:text-base font-semibold text-gray-700">
                        No transactions found
                      </h3>
                      <p className="text-gray-500 xl:text-xs mt-2 xl:mt-1">
                        Try adjusting your filters or date range.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= Pagination ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 xl:gap-2 p-3">
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
    </div>
  );
}