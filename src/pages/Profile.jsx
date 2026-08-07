import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-hot-toast";
import { MdStorefront } from "react-icons/md";
import {
    FiUser,
    FiBriefcase,
    FiPhone,
    FiMapPin,
    FiShield,
    FiEdit2,
    FiGlobe,
    FiCopy,
    FiCheck
} from "react-icons/fi";

export default function Profile() {

    const [profileData, setProfileData] = useState({});
    const [userId, setUserId] = useState("");

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.post("/auth/meProfile");
            if (response.respCode === 0) {
                setProfileData(response.respData);
            } else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            toast.error(error);
        }
    }
    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 h-[calc(100vh-64px)] overflow-y-auto hide-scrollbar">
                <div className="w-full">
                    {/* Top Merchant Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Left */}
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="p-3 rounded-2xl bg-[#FEF6E7] flex items-center justify-center shrink-0">
                                    <MdStorefront size={28} color="#FDC501" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">
                                        {profileData.legalName || "--"}
                                    </h2>
                                    <p className="text-gray-500 mt-1 text-xs sm:text-sm">
                                        Merchant ID :
                                        <span className="font-medium ml-1 text-gray-700">
                                            {profileData.mid}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Right */}
                            <div className="self-start sm:self-auto">
                                <span
                                    className={`inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${profileData.status === "A"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-current"></span>
                                    {profileData.status === "A"
                                        ? "ACTIVE"
                                        : "INACTIVE"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ACCOUNT */}
                    <Section title="Account Information">
                        <ProfileField label="User ID" value={profileData.userId} />
                        <ProfileField label="Username" value={profileData.userName} />
                        <ProfileField label="Merchant ID" value={profileData.mid} />
                        <ProfileField
                            label="Status"
                            value={
                                profileData.status === "A"
                                    ? "ACTIVE"
                                    : "INACTIVE"
                            }
                        />
                    </Section>

                    {/* BUSINESS */}
                    <Section title="Business Information">
                        <ProfileField
                            label="Legal Name"
                            value={profileData.legalName}
                        />
                        <ProfileField
                            label="DBA Name"
                            value={profileData.dbaName}
                        />
                        <ProfileField
                            label="Business Type"
                            value={profileData.businessType}
                        />
                        <ProfileField
                            label="Category"
                            value={profileData.category}
                        />
                        <ProfileField
                            label="Website"
                            value={profileData.websiteUrl}
                        />
                        <ProfileField
                            label="Store Type"
                            value={profileData.storeType}
                        />
                        <ProfileField
                            label="Turnover Category"
                            value={profileData.turnoverCategory}
                        />
                    </Section>

                    {/* CONTACT */}
                    <Section title="Contact Information">
                        <ProfileField
                            label="Contact Person"
                            value={profileData.contactPersonName}
                        />
                        <ProfileField
                            label="Primary Email"
                            value={profileData.primaryEmail}
                        />
                        <ProfileField
                            label="Secondary Email"
                            value={profileData.secondaryEmail}
                        />
                        <ProfileField
                            label="Contact Mobile"
                            value={profileData.contactMobile}
                        />
                    </Section>

                    {/* ADDRESS */}
                    <Section title="Address Details">
                        <ProfileField
                            label="Address 1"
                            value={profileData.address1}
                        />
                        <ProfileField
                            label="Address 2"
                            value={profileData.address2}
                        />
                        <ProfileField
                            label="City"
                            value={profileData.city}
                        />
                        <ProfileField
                            label="State"
                            value={profileData.state}
                        />
                        <ProfileField
                            label="Country"
                            value={profileData.country}
                        />
                        <ProfileField
                            label="Pincode"
                            value={profileData.pincode}
                        />
                    </Section>

                    {/* KYC */}
                    <Section title="KYC Details">
                        <ProfileField
                            label="PAN Number"
                            value={profileData.panNo}
                        />
                        <ProfileField
                            label="GST Number"
                            value={profileData.gstNo}
                        />
                        <ProfileField
                            label="Aadhaar Number"
                            value={profileData.aadhaarNo}
                        />
                        <ProfileField
                            label="Risk Status"
                            value={profileData.riskStatus}
                        />
                    </Section>
                </div>
            </div>
        </>
    );
}

function Section({ title, children }) {
    const icons = {
        "Account Information": <FiUser size={20} />,
        "Business Information": <FiBriefcase size={20} />,
        "Contact Information": <FiPhone size={20} />,
        "Address Details": <FiMapPin size={20} />,
        "KYC Details": <FiShield size={20} />,
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#FEF6E7] text-[#FDC501] flex items-center justify-center">
                        {icons[title]}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Manage your {title.toLowerCase()}
                        </p>
                    </div>
                </div>
                {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                    <FiEdit2 size={15} />
                    Edit
                </button> */}
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                {children}
            </div>
        </div>
    );
}

// Resuable Component
function ProfileField({ label, value }) {
    const [copied, setCopied] = useState(false);

    const isLink =
        label === "Website" &&
        value?.startsWith("http");

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.log("Copy error:", error);
        }
    };

    return (
        <div className="border-b border-gray-200 p-4 sm:p-6 xl:p-2.5">
            <p className="text-sm xl:text-[11px] font-medium text-gray-500 mb-2 xl:mb-0.5">
                {label}
            </p>

            {isLink ? (
                <div className="flex items-center gap-2 xl:gap-1">
                    {/* Before URL icon */}
                    <FiGlobe
                        size={17}
                        className="text-blue-500 flex-shrink-0 xl:w-3.5 xl:h-3.5"
                    />

                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-[15px] xl:text-[11px] font-semibold text-blue-600 hover:underline break-all"
                    >
                        {value}
                    </a>

                    {/* Copy icon */}
                    {copied ? (
                        <FiCheck
                            size={16}
                            className="text-green-500 flex-shrink-0 xl:w-3.5 xl:h-3.5"
                        />
                    ) : (
                        <FiCopy
                            size={16}
                            onClick={copyUrl}
                            title="Copy URL"
                            className="cursor-pointer text-blue-500 hover:text-[#FDC501] flex-shrink-0 xl:w-3.5 xl:h-3.5"
                        />
                    )}
                </div>
            ) : (
                <p className="text-[15px] xl:text-[11px] font-semibold text-gray-800 break-words">
                    {value || "--"}
                </p>
            )}
        </div>
    );
}