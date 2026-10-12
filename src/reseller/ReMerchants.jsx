import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";

export default function ReMerchants() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const resellerId = user?.resellerId;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState("2026-08-08");
  const [toDate, setToDate] = useState("2026-08-08");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (resellerId) {
      fetchResellerMerchants();
    }
  }, [resellerId]);

  const fetchResellerMerchants = async () => {
    try {
      setLoading(true);

      const payload = {
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      };

      console.log("API Payload:", payload);

      const response = await axiosInstance.post(
        `/reseller/merchant/${resellerId}`,
        payload
      );

      console.log("Merchant API Response:", response);

      if (response?.respCode === 0) {
        setData(response?.respData || []);
      } else {
        setData([]);
        toast.error(
          response?.respMsg
        );
      }
    } catch (error) {     
      setData([]);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((merchant) => {
    const merchantId = String(merchant?.[0] || "").toLowerCase();
    const merchantName = String(merchant?.[1] || "").toLowerCase();
    const companyName = String(merchant?.[2] || "").toLowerCase();
    const merchantStatus = String(merchant?.[3] || "");

    const searchValue = search.toLowerCase();

    const matchesSearch =
      !search ||
      merchantId.includes(searchValue) ||
      merchantName.includes(searchValue) ||
      companyName.includes(searchValue);

    const matchesStatus =
      !status || merchantStatus === status;

    return matchesSearch && matchesStatus;
  });

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setFromDate("2026-08-08");
    setToDate("2026-08-08");
  };

  return (
    <div className="min-h-screen bg-[#eef0f3] p-6 font-sans">
      <div className="max-w-[1200px] mx-auto">
        {/* Page Title */}
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Merchant List
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-md shadow-sm p-6 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-700">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Merchant ID / Name"
                className="h-[34px] border border-gray-300 rounded text-[13px] text-gray-600 px-2.5 outline-none focus:border-blue-400"
              />
            </div>

            {/* From Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-700">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-[34px] border border-gray-300 rounded text-[13px] text-gray-600 px-2.5 outline-none"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-700">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-[34px] border border-gray-300 rounded text-[13px] text-gray-600 px-2.5 outline-none"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-[34px] border border-gray-300 rounded text-[13px] text-gray-600 px-2.5 bg-white outline-none"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Deactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={fetchResellerMerchants}
              disabled={loading}
              className={`h-[34px] px-5 rounded text-[13px] text-white ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
                }`}
            >
              {loading ? "Loading..." : "Search"}
            </button>

            <button
              onClick={handleReset}
              className="h-[34px] px-5 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-[13px] text-gray-600"
            >
              Reset
            </button>

          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-md shadow-sm px-6 pt-5 pb-2">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[15px] font-bold text-gray-800">
              Merchant List
            </h2>
            <span className="text-xs text-gray-400">
              Total: {filteredData.length} Merchants
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="text-left font-bold text-blue-600 px-3 py-2.5 border-b-2 border-gray-100 whitespace-nowrap">
                    Merchant ID
                  </th>
                  <th className="text-left font-bold text-blue-600 px-3 py-2.5 border-b-2 border-gray-100 whitespace-nowrap">
                    Merchant Name
                  </th>
                  <th className="text-left font-bold text-blue-600 px-3 py-2.5 border-b-2 border-gray-100 whitespace-nowrap">
                    Company Name
                  </th>
                  <th className="text-left font-bold text-blue-600 px-3 py-2.5 border-b-2 border-gray-100 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-gray-500"
                    >
                      Loading merchants...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-gray-500"
                    >
                      No merchants found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((merchant, index) => {

                    const merchantId = merchant?.[0] || "-";
                    const merchantName = merchant?.[1] || "-";
                    const companyName = merchant?.[2] || "-";
                    const merchantStatus = merchant?.[3] || "-";

                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50"
                      >

                        {/* Merchant ID */}
                        <td className="px-3 py-3 border-b border-gray-100 text-blue-600 whitespace-nowrap">
                          {merchantId}
                        </td>

                        {/* Merchant Name */}
                        <td className="px-3 py-3 border-b border-gray-100 text-gray-700 whitespace-nowrap">
                          {merchantName}
                        </td>

                        {/* Company Name */}
                        <td className="px-3 py-3 border-b border-gray-100 text-gray-700 whitespace-nowrap">
                          {companyName}
                        </td>

                        {/* Status */}
                        <td
                          className={`px-3 py-3 border-b border-gray-100 whitespace-nowrap ${merchantStatus === "Active"
                            ? "text-green-600 font-semibold"
                            : "text-gray-500"
                            }`}
                        >
                          {merchantStatus}
                        </td>

                      </tr>
                    );
                  })
                )}

              </tbody>

            </table>

          </div>
        </div>

      </div>
    </div>
  );
}