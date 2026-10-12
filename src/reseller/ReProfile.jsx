import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { User, X, MapPin, Building2, CreditCard } from "lucide-react";

export default function ReProfile() {
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get resellerId from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const resellerId = user?.resellerId;

  // Convert API field names into readable labels
  const formatLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    if (resellerId) {
      handleProfileClick();
    }
  }, [resellerId]);

  // Fetch profile API
  const handleProfileClick = async () => {   
    // setLoading(true);

    try {
      const response = await axiosInstance.post(
        `/reseller/profile/${resellerId}`
      );
      if (response?.respCode === 0) {
        setProfileData(response.respData);
      } else {
        toast.error(response?.respMsg);
        setProfileData(null);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Initials
  const initials = profileData
    ? `${profileData.firstName?.charAt(0) || ""}${profileData.lastName?.charAt(0) || ""}`.toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="px-6 py-7 text-black bg-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 text-black">

              {/* Avatar */}
              <div className="w-15 h-15 rounded-full  text-gray-700 border-2 border-yellow-500 flex items-center justify-center text-2xl font-bold shadow-lg">
                {initials}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-700 uppercase">
                  {profileData?.firstName} {profileData?.lastName}
                </h2>
                <p className="text-orange-500 text-sm mt-1">
                  {profileData?.companyName}
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-5 sm:p-6 lg:p-8 space-y-8">
            {/* ================= BASIC INFORMATION ================= */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-500 font-bold">01</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Personal and company information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData?.firstName || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    value={profileData?.lastName || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="text"
                    value={profileData?.email || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile
                  </label>

                  <input
                    type="text"
                    value={profileData?.mobile || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Company */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>

                  <input
                    type="text"
                    value={profileData?.companyName || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

              </div>
            </section>


            {/* DIVIDER */}
            <div className="border-t border-gray-100"></div>


            {/* ================= ADDRESS INFORMATION ================= */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">02</span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Address Information
                  </h3>

                  <p className="text-sm text-gray-500">
                    Registered address details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>

                  <input
                    type="text"
                    value={profileData?.country || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>

                  <input
                    type="text"
                    value={profileData?.state || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>

                  <input
                    type="text"
                    value={profileData?.city || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>

                  <input
                    type="text"
                    value={profileData?.pincode || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>

                  <textarea
                    value={profileData?.address || ""}
                    readOnly
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none resize-none"
                  />
                </div>

              </div>
            </section>


            <div className="border-t border-gray-100"></div>


            {/* ================= KYC INFORMATION ================= */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">03</span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    KYC Information
                  </h3>

                  <p className="text-sm text-gray-500">
                    Identity and verification details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* Aadhaar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number
                  </label>

                  <input
                    type="text"
                    value={profileData?.aadharNo}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* PAN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number
                  </label>

                  <input
                    type="text"
                    value={profileData?.panNo}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 uppercase outline-none"
                  />
                </div>

                {/* GST */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>

                  <input
                    type="text"
                    value={profileData?.gstNo}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 uppercase outline-none"
                  />
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100"></div>

            {/* ================= BANK INFORMATION ================= */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">04</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bank Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Beneficiary and banking details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Account Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiary Account Name
                  </label>
                  <input
                    type="text"
                    value={profileData?.reBeneficiaryAccountName}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beneficiary Account Number
                  </label>
                  <input
                    type="text"
                    value={profileData?.reBeneficiaryAccountNo}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Bank */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={profileData?.reBeneficiaryBankName  || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={profileData?.reBeneficiaryBranchName || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* IFSC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={profileData?.reIFSCCode || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 uppercase outline-none"
                  />
                </div>
              </div>
            </section>


            <div className="border-t border-gray-100"></div>

            {/* ================= SETTLEMENT INFORMATION ================= */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">05</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Settlement Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Settlement configuration and account status
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Settlement Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Settlement Type
                  </label>

                  <input
                    type="text"
                    value={profileData?.rssSettlementType || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Settlement Cycle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Settlement Cycle
                  </label>
                  <input
                    type="text"
                    value={profileData?.rssSettlementCycle || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Created At */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created At
                  </label>
                  <input
                    type="text"
                    value={profileData?.rssPaymentBy || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {profileData?.status}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}


