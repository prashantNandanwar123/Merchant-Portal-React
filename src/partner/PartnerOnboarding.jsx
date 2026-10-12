import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { FiUser } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { GrShieldSecurity } from "react-icons/gr";
import { TbLogin2 } from "react-icons/tb";
import { UserRound } from "lucide-react";
import { RiUserShared2Line } from "react-icons/ri";
import { MdOutlineHeadsetMic } from "react-icons/md";
import statecity from "../components/utils/statecity.json";
import Select from "react-select";


import logo from "../assets/img-1.jpeg";
import img2 from "../assets/img-2.jpeg";
import bgImg from "../assets/img.png";
import mobileBg from "../assets/img3.png";
import { Clock3 } from "lucide-react";
import {
    FaUser,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaShieldAlt,
    FaBolt,
    FaChartBar,
    FaHeadset,
    FaStore,
    FaSignInAlt,
} from "react-icons/fa";

export default function PartnerOnboarding() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        aadharNo: "",
        panNo: "",
        gstNo: "",
        country: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        companyName: "",
    });
    const [loading, setLoading] = useState(false);
    const [showApprovalPopup, setShowApprovalPopup] = useState(false);
    const countryList = statecity.map((item) => item.country);

    // Country
    const selectedCountry = statecity.find(
        (item) => item.country === formData.country
    );

    const stateList = selectedCountry?.states || [];

    // State
    const selectedState = stateList.find(
        (item) => item.state === formData.state
    );

    // City
    const cityList = selectedState?.cities || [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit Api
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        const payload = {
            requestId: `REQ${Date.now()}`,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            mobile: formData.mobile,
            aadharNo: formData.aadharNo,
            panNo: formData.panNo,
            gstNo: formData.gstNo,
            country: formData.country,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            companyName: formData.companyName,
        };

        try {
            const response = await axiosInstance.post(
                "/reseller/auth/signup",
                payload
            );
            if (response.success === true) {
                toast.success(response.message);
                setShowApprovalPopup(true);

            } else if (response.success === false) {
                toast.error(response.message);
            }
            else {
                if (response?.respData && typeof response.respData === "object") {
                    Object.values(response.respData).forEach((msg) => {
                        toast.error(msg);
                    });
                }

            }

        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        // Disable right click
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Disable DevTools shortcuts
        const handleKeyDown = (e) => {

            // F12
            if (e.key === "F12") {
                e.preventDefault();
            }

            // Ctrl + Shift + I
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
                e.preventDefault();
            }

            // Ctrl + Shift + J
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
                e.preventDefault();
            }

            // Ctrl + Shift + C
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
                e.preventDefault();
            }

            // Ctrl + U
            if (e.ctrlKey && e.key.toLowerCase() === "u") {
                e.preventDefault();
            }
              
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup when leaving Login page
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };

    }, []);


    return (
        // Outer wrapper
        <div className="h-screen w-full flex login-bg overflow-hidden">
            <div className="h-screen w-full bg-white flex flex-col md:flex-row overflow-hidden">
                {/* ================= LEFT SIDE (FIXED / NON-SCROLLING) ================= */}
                <div className="hidden md:flex md:w-[35%] bg-[#040F25] relative text-white overflow-hidden shrink-0">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-cover bg-center opacity-20" />

                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                        {/* Logo */}
                        <div className="px-6 md:px-8 lg:px-10 xl:px-15 cursor-default -mt-6">
                            <img
                                src={logo}
                                alt="img"
                                className="h-16 md:h-18 lg:h-20 xl:h-35 object-contain block mb-0"
                                style={{ marginLeft: "-35px" }}
                            />

                            <h1 className="text-[18px] md:text-[24px] md:leading-[28px] font-medium m-0 -mt-8">
                                Manage your{" "}
                                <br className="xl:hidden" />
                                business payments
                                <br />
                                <span className="text-[#FFB504]">
                                    Effortlessly
                                </span>
                            </h1>
                            <p className="text-gray-300 md:mt-2 leading-4 md:text-sm font-normal">
                                Secure platform for merchants with
                                lightning-fast settlements and
                                powerful dashboard.
                            </p>

                            {/* Features */}
                            <div className="space-y-5 md:space-y-6 lg:space-y-8 xl:space-y-4 mt-4 md:mt-6">
                                <div className="flex items-start gap-3 md:gap-4 lg:gap-5">
                                    <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <FaShieldAlt className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            Secure Transactions
                                        </h3>
                                        <p className="text-gray-300 text-sm mt-1">
                                            Bank level encrypted
                                            <br />
                                            payment infrastructure.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 md:gap-4 lg:gap-5">
                                    <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <FaBolt className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            Fast Settlement
                                        </h3>
                                        <p className="text-gray-300 text-sm mt-1">
                                            Receive your payments
                                            <br />
                                            quickly and securely.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 md:gap-4 lg:gap-5">
                                    <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                        <FaChartBar className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            Analytics
                                        </h3>
                                        <p className="text-gray-300 text-sm mt-1">
                                            Smart reports to grow
                                            <br />
                                            your business.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Demo Image */}
                        <div className="flex justify-left">
                            <img
                                src={img2}
                                alt="logo"
                                className="object-contain max-w-full xl:max-h-60"
                            />
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT SIDE (SCROLLABLE) ================= */}
                <div className="flex-1 min-w-0 h-screen relative bg-cover bg-right bg-no-repeat overflow-y-auto py-6">                    <div>
                    <h2 className="text-3xl uppercase pb-3 text-[#F0B100] font-bold text-center">
                        Register As Partner
                    </h2>
                    <p className="px-5 py-3 text-sm text-blue-900 max-w-xl text-center mx-auto bg-yellow-100 mb-5">
                        Apply to become a Payin partner.
                        After admin approval, merchants you bring will be assigned to your account and you earn commission on their transactions.
                    </p>
                </div>

                    <div className="relative z-10 w-full px-5 md:px-8 lg:px-10">
                        <div className="w-full max-w-5xl mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-6 pb-2">
                                {/* Row 1 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            First Name <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            maxLength={25}
                                            value={formData.firstName}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

                                                handleChange({
                                                    target: {
                                                        name: "firstName",
                                                        value: value,
                                                    },
                                                });
                                            }}
                                            required
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            maxLength={25}
                                            value={formData.lastName}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");

                                                handleChange({
                                                    target: {
                                                        name: "lastName",
                                                        value: value,
                                                    },
                                                });
                                            }}
                                            required
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>
                                </div>
                                {/* Row 2 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Email Id <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Mobile <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="mobile"
                                            value={formData.mobile}
                                            required
                                            maxLength={10}
                                            inputMode="numeric"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    mobile: value,
                                                }));
                                            }}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>
                                </div>

                                {/* Row 4 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Aadhar No. <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="aadharNo"
                                            value={formData.aadharNo}
                                            required
                                            maxLength={12}
                                            inputMode="numeric"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");

                                                setFormData((prev) => ({
                                                    ...prev,
                                                    aadharNo: value,
                                                }));
                                            }}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            GSTN No. <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="gstNo"
                                            value={formData.gstNo}
                                            onChange={handleChange}
                                            required
                                            maxLength={15}
                                            placeholder="Eg. 27AAPFU0939F1ZV"
                                            className="w-full border border-gray-300 rounded px-3 py-2 uppercase"
                                        />
                                    </div>
                                </div>

                                {/* Row 6 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Address
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Pan No</label>
                                        <input
                                            type="text"
                                            name="panNo"
                                            value={formData.panNo}
                                            maxLength={10}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 uppercase"
                                        />
                                    </div>
                                </div>

                                {/* Row 7 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Country <span className="text-red-500">*</span>
                                        </label>

                                        <Select
                                            options={countryList.map((country) => ({
                                                value: country,
                                                label: country,
                                            }))}
                                            value={
                                                formData.country
                                                    ? {
                                                        value: formData.country,
                                                        label: formData.country,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    country: selected?.value || "",
                                                    state: "",
                                                    city: "",
                                                }));
                                            }}
                                            placeholder="Select Country"
                                            isSearchable
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            State <span className="text-red-500">*</span>
                                        </label>

                                        <Select
                                            options={stateList.map((item) => ({
                                                value: item.state,
                                                label: item.state,
                                            }))}
                                            value={
                                                formData.state
                                                    ? {
                                                        value: formData.state,
                                                        label: formData.state,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    state: selected?.value || "",
                                                    city: "",
                                                }));
                                            }}
                                            placeholder="Select State"
                                            isSearchable
                                            isDisabled={!formData.country}
                                        />
                                    </div>
                                </div>

                                {/* Row 8 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <Select
                                            options={cityList.map((city) => ({
                                                value: city,
                                                label: city,
                                            }))}
                                            value={
                                                formData.city
                                                    ? {
                                                        value: formData.city,
                                                        label: formData.city,
                                                    }
                                                    : null
                                            }
                                            onChange={(selected) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    city: selected?.value || "",
                                                }));
                                            }}
                                            placeholder="Select City"
                                            isSearchable
                                            isDisabled={!formData.state}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Zip Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            maxLength={6}
                                            required
                                            inputMode="numeric"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    pincode: value,
                                                }));
                                            }}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                    </div>
                                </div>

                                {/* Row 9 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-medium text-gray-700 mb-2">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            maxLength={20}
                                            required
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only characters and spaces
                                                if (/^[A-Za-z\s]*$/.test(value)) {
                                                    handleChange(e);
                                                }
                                            }}
                                            className="w-full h-11 px-3 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center mt-8">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`bg-yellow-500 text-white px-6 py-2 rounded ${loading
                                            ? "opacity-60 cursor-not-allowed"
                                            : "cursor-pointer"
                                            }`}
                                    >
                                        {loading ? "Submitting..." : "Submit Partner Application"}
                                    </button>
                                </div>

                                {showApprovalPopup && (
                                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 px-4">
                                        {/* Popup */}
                                        <div className="relative w-full max-w-[515px] rounded-2xl bg-white border border-gray-200 shadow-xl px-6 sm:px-10 py-8 sm:py-9 text-center">
                                            {/* Cross Button */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowApprovalPopup(false);
                                                    navigate("/reLogin");
                                                }}
                                                className="absolute top-3 right-4 text-[#FDB913] hover:text-gray-700 text-2xl font-bold leading-none transition-colors duration-200"
                                                aria-label="Close"
                                            >
                                                ×
                                            </button>

                                            {/* Clock Icon */}
                                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                                                <Clock3
                                                    size={30}
                                                    strokeWidth={2.5}
                                                    className="text-yellow-600"
                                                />
                                            </div>

                                            {/* Heading */}
                                            <h2 className="text-[22px] sm:text-[23px] font-bold text-[#071C39] mb-3">
                                                Waiting for approval
                                            </h2>

                                            {/* Description */}
                                            <p className="text-[15px] sm:text-[16px] leading-[1.35] text-gray-500 max-w-[440px] mx-auto">
                                                Your partner application has been submitted and is under
                                                review. An administrator will approve your account before you
                                                can access commissions, referral links, or other features.
                                            </p>

                                            {/* Bottom Description */}
                                            <p className="text-[13px] sm:text-[14px] leading-[1.35] text-gray-400 max-w-[430px] mx-auto mt-4">
                                                You will receive access once your application is approved. If you have
                                                questions, contact Payin support.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </form>
                            <div className="flex justify-center items-center gap-1">
                                <button
                                    type="button"

                                    className="text-gray-700 text-sm  cursor-pointer"
                                >
                                    Already Have an Account ?
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/reLogin")}
                                    className="text-[#3498db] text-sm cursor-pointer"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}