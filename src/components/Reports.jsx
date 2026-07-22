import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { Package, CheckCircle2, RefreshCcw, AlertCircle } from "lucide-react";
import { CiExport } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { Filter, Download } from "lucide-react";


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
  }, [page, size, fromDate, toDate]);

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

    const from = new Date();
    from.setDate(today.getDate() - Number(days));

    const formattedFrom = from.toISOString().split("T")[0];
    const formattedTo = today.toISOString().split("T")[0];

    setFromDate(formattedFrom);
    setToDate(formattedTo);
  };

  return (
    <div
      className="
      h-screen
      bg-gray-50
      p-3 sm:p-5 lg:p-6
      overflow-y-auto      
      hide-scrollbar
  "
    >
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-center md:text-left text-3xl md:text-3xl font-bold text-gray-800">
          Transaction Report
        </h1>
        <p className="text-sm font-normal text-gray-500 mt-2 text-center md:text-left">
          View and analyze your transaction data
          <br className="block md:hidden" />
          with detailed insights.
        </p>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          {/* Left Side */}
          <div className="flex flex-wrap items-end gap-3">
            {/* From + To Date */}
            <div className="flex w-full gap-2 md:w-auto">
              {/* From Date */}
              <div className="flex-1 md:flex-none">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full md:w-[150px] rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              {/* To Date */}
              <div className="flex-1 md:flex-none">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  To Date
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full md:w-[150px] rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            </div>

            {/* Quick Filter */}
            <div className="relative w-full md:w-auto">
              <Filter
                size={14}
                className="absolute left-3 top-10 -translate-y-1/2 text-gray-500"
              />
              <label className="block text-xs font-medium text-gray-600 mb-1">
                All Transactions
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => handleQuickFilter(e.target.value)}
                className="h-9 md:w-auto pl-9 pr-7 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 font-medium appearance-none cursor-pointer"
              >
                <option value="">All Transactions</option>
                <option value="7">Last 7 Days</option>
                <option value="14">Last 14 Days</option>
                <option value="21">Last 21 Days</option>
                <option value="30">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex flex-row gap-2">
            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-sm border border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50 transition"
            >
              <CiExport className="text-base" />
              <span>Export</span>
            </button>

            {/* <button
              onClick={handleExport}
              className="w-full h-12 rounded-2xl bg-green-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              <Download size={18} />
              Export
            </button> */}


            {/* Search Button */}
            <button
              onClick={() => {
                setPage(0);
                fetchReport();
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              <FaSearch className="text-base" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
      {/* ================= TABLE SECTION ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Top Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 border-b">
          {/* Left */}
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

          {/* Right */}
          <div className="flex md:flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:ring-2 focus:ring-gray-100 outline-none"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                <FaSearch />
              </span>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-10 pr-8 rounded-lg border border-gray-300 bg-white text-gray-700 appearance-none cursor-pointer focus:ring-2 focus:ring-yellow-400"
              >
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
          h-[420px]
          lg:h-[400px]
          overflow-x-auto
          overflow-y-auto   
          "
        >
          <table className="min-w-[1700px] text-sm border-collapse">
            <thead className="sticky top-0 z-30 bg-white shadow-sm">
              <tr className="text-gray-700">
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">ID</th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Transaction Reference No.
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Order No.
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Date & Time
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Payment Type
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Txn Amount
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  MSF Fee
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  MSF GST Fee
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Conv Fee
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Convenience GST Fee
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Total Txn Amount
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Status
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Customer Name
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Mobile No.
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
                  Email
                </th>
                <th className="px-3 py-4 text-left font-semibold bg-gray-50 whitespace-nowrap border border-gray-200">
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
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {page * size + index + 1}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[0]}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[1]}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[2]}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[3]}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      ₹ {(row[4] || 0) / 100}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[10] || 0}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[11] || 0}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[12] || 0}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[13] || 0}
                    </td>
                    <td className="px-3 py-1.5 font-semibold text-green-600 whitespace-nowrap border border-gray-200">
                      ₹ {(row[14] || 0) / 100}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold
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
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[6]}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[7]}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[8]}
                    </td>
                    <td className="px-3 py-1.5 whitespace-nowrap border border-gray-200">
                      {row[9] || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={16}
                    className="py-20 text-center border border-gray-200"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-6xl mb-4">
                        📄
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700">
                        No transactions found
                      </h3>
                      <p className="text-gray-500 mt-2">
                        Try adjusting your filters or date range.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}