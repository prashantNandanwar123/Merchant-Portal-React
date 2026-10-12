import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { CiExport } from "react-icons/ci";

export default function ReReport() {
  const today = new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("Payin");

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const resellerId = user?.resellerId;

  // YYYY-MM-DD -> DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (resellerId) {
      fetchResellerReport(0);
    }
  }, [resellerId]);

  const fetchResellerReport = async (pageNumber = 0) => {
    try {
      setLoading(true);
      const payload = {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      };
      const response = await axiosInstance.post(
        `/reseller/trans/${resellerId}?page=${pageNumber}&size=${size}`,
        payload
      );
      console.log("Report API Response--->>:", response.data);

      if (response.respCode === 0) {
        setData(response.data || []);
        setTotalPages(response.totalPages || 0);
        setTotalRecords(response.totalRecords || 0);
        setPage(pageNumber);
      } else {
        toast.error(response.respMsg);
        setData([]);
      }
    } catch (error) {
      toast.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchResellerReport(0);
  };

  const handlePrevious = () => {
    if (page > 0 && !loading) {
      fetchResellerReport(page - 1);
    }
  };

  const handleNext = () => {
    if (
      !loading &&
      page < totalPages - 1
    ) {
      fetchResellerReport(page + 1);
    }
  };

  // Export Api Call
  const handleExport = async () => {
    try {
      const payload = {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      };
      const response = await axiosInstance.post(
        `/reseller/dwnReTxnReport/${resellerId}`,
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
      link.download = "Reseller_MeTxn__Report.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      toast.error(error);
    }
  };

  const statusClassMap = {
    INITIATED: "bg-amber-100 text-amber-700",
    SUCCESSFUL: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-600",
  };

  const columns = [
    "Sr.No",
    "Merchant ID",
    "Transaction ID",
    "Transaction Type",
    "Txn Date",
    "Amount",
    "Status",
    "RP Commission",
    "Merchant Charge",
    "GST Amt",
  ];

  return (
    <div className="min-h-screen bg-[#eef0f3] p-6 font-sans">
      {/* Filters */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-md shadow-sm px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6 pb-2">
          {/* Dates */}
          <div className="flex w-full gap-2 sm:w-auto">
            {/* From Date */}
            <div className="flex-1 sm:flex-none">
              <label className="block text-[11px] sm:text-xs font-medium text-gray-600 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                max={toDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="
                w-full sm:w-[130px] md:w-[140px] xl:w-[120px]
                rounded-lg border border-gray-300
                px-2 py-1 xl:py-1
                text-[11px] sm:text-sm xl:text-[11px]
                focus:ring-2 focus:ring-yellow-400
                outline-none
              "
              />
            </div>

            {/* To Date */}
            <div className="flex-1 sm:flex-none">
              <label className="block text-[11px] sm:text-xs font-medium text-gray-600 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                onChange={(e) => setToDate(e.target.value)}
                className="
                w-full sm:w-[130px] md:w-[140px] xl:w-[120px]
                rounded-lg border border-gray-300
                px-2 py-1 xl:py-1
                text-[11px] sm:text-sm xl:text-[11px]
                focus:ring-2 focus:ring-yellow-400
                outline-none
              "
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex w-full sm:w-auto gap-2">
            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`
                flex-1 sm:flex-none
                flex items-center justify-center gap-1.5
                px-3 sm:px-4 xl:px-4
                py-1.5 sm:py-2 xl:py-1.5
                text-[11px] sm:text-sm xl:text-xs
                text-white rounded-lg transition
                ${loading
                  ? "bg-yellow-300 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
                }
             `}
            >
              <FaSearch className="text-sm" />
              <span>{loading ? "Loading..." : "Search"}</span>
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="
              flex-1 sm:flex-none
              flex items-center justify-center gap-1.5
              px-4 py-2 xl:px-3 xl:py-1.5
              text-xs sm:text-sm xl:text-xs
              border border-yellow-500
              text-yellow-600
              rounded-lg
              hover:bg-yellow-50
              transition
            "
            >
              <CiExport className="text-base" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-md shadow-sm px-6 pt-5 pb-4 mt-5">
        {/* Tabs */}
        <div className="flex gap-2.5 mt-1 mb-2">
          {["Payin"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                rounded px-5 py-2 text-[13px]
                ${activeTab === tab
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-gray-100 text-gray-600"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="
                      text-center font-bold text-slate-400
                      px-2 py-1.5
                      border-b-1 border-gray-100
                      whitespace-nowrap
                    "
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-4 text-gray-500"
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-4 text-gray-500"
                  >
                    No transaction data found
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={row?.txnId || index}
                    className="hover:bg-gray-50"
                  >
                    {/* Sr No */}
                    <td className="px-2 py-1.5 border-b border-gray-100 text-gray-600 whitespace-nowrap">
                      {page * size + index + 1}
                    </td>

                    {/* Merchant */}
                    <td className="px-2 py-1.5 border-b border-gray-100 text-gray-600 whitespace-nowrap">
                      {row?.mid}
                    </td>

                    {/* Transaction ID */}
                    <td className="px-2 py-1.5 border-b border-gray-100 text-gray-600 whitespace-nowrap">
                      {row?.meTrnRefNo}
                    </td>

                    {/* Transaction Type */}
                    <td className="px-2 py-1.5 border-b border-gray-100 text-gray-600 whitespace-nowrap text-center">
                      {row?.paymentType}
                    </td>

                    {/* Date */}
                    <td className="px-2 py-1.5 border-b border-gray-100 text-gray-600 whitespace-nowrap">
                      {row?.txnDate}
                    </td>

                    {/* Amount */}
                    <td className="px-2 py-1.5 border-b border-gray-100 text-gray-600 whitespace-nowrap">
                      {row?.totalAmount/100}
                    </td>

                    {/* Status */}
                    <td className="px-2 py-1.5 border-b border-gray-100 whitespace-nowrap">
                      {(() => {
                        const status = String(
                          row?.respMessage || ""
                        ).toUpperCase();

                        return (
                          <span
                            className={`
                              inline-block px-2 py-0.5
                              rounded text-[10px] font-bold
                              ${statusClassMap[status] ||
                              "bg-gray-100 text-gray-600"
                              }
                            `}
                          >
                            {status || "-"}
                          </span>
                        );
                      })()}
                    </td>

                    {/* RP Commission */}
                    <td className="px-2 py-1.5 border-b border-gray-100 text-gray-600 whitespace-nowrap text-center">
                      {row?.reCommission}
                    </td>

                    {/* Merchant Charge */}
                    <td className="px-2 py-1.5 border-b border-gray-100 text-gray-600 whitespace-nowrap">
                      {row?.msfFee}
                    </td>

                    {/* GST */}
                    <td className="px-2 py-1.5 border-b border-gray-100 text-gray-600 whitespace-nowrap">
                      {row?.msfGstFee}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {totalRecords === 0 ? 0 : page * size + 1}
            </span>
            {" "}to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min((page + 1) * size, totalRecords)}
            </span>
            {" "}of{" "}
            <span className="font-semibold text-gray-700">
              {totalRecords}
            </span>
            {" "}records
          </div>

          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              onClick={handlePrevious}
              disabled={page === 0 || loading}
              className={`
                  px-3 py-1.5
                  rounded-md
                  border
                  text-xs font-medium
                  transition
                  ${page === 0 || loading
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }
                `}
            >
              Previous
            </button>

            {/* Page */}
            <span className="text-xs text-gray-600 px-2">
              Page{" "}
              <span className="font-semibold text-gray-800">
                {page + 1}
              </span>
              {" "}of{" "}
              <span className="font-semibold text-gray-800">
                {totalPages}
              </span>
            </span>

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={
                page >= totalPages - 1 || loading
              }
              className={`
                  px-3 py-1.5
                  rounded-md
                  border
                  text-xs font-medium
                  transition

                  ${page >= totalPages - 1 || loading
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }
                `}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}