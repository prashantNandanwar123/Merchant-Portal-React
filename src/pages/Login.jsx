import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { FiUser } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { GrShieldSecurity } from "react-icons/gr";
import { TbLogin2 } from "react-icons/tb";
import { UserRound } from "lucide-react";
import { RiUserShared2Line } from "react-icons/ri";
import { MdOutlineHeadsetMic } from "react-icons/md";
import logo from "../assets/img-1.jpeg";
import img2 from "../assets/img-2.jpeg";
import bgImg from "../assets/img.png";
import mobileBg from "../assets/img3.png";
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

export default function Login() {

    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/submitLogin", {
                userId: userId,
                password: password,
            });

            if (response.respCode === 0) {
                localStorage.setItem("isLogin", "true");
                localStorage.setItem("user", JSON.stringify(response.respData));
                toast.success(response.respMsg);
                setTimeout(() => {
                    navigate("/app/dashboard");
                }, 1000);

            } else if (response.respCode === 3) {
                toast.success(response.respMsg);
                setTimeout(() => {
                    navigate("/forgot");
                }, 1000);
            }
            else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div
            className="login-bg min-h-screen w-full bg-cover bg-no-repeat flex items-center justify-center p-4 lg:p-8">
            <div
                className="
                w-full
                max-w-5xl
                min-h-[650px]
                lg:min-h-[750px]
                xl:min-h-[820px]
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-2xl
                flex
                flex-col
                lg:flex-row
                "
            >
                {/* ================= LEFT SIDE ================= */}
                <div className="hidden lg:flex lg:w-[35%] bg-[#040F25] text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-cover bg-center opacity-20" />
                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                        {/* Logo */}
                        <div className="px-10">
                            <img
                                src={logo}
                                alt="img"
                                className="h-20 object-contain"
                                style={{ marginLeft: "-18px" }}
                            />
                            <h1 className="text-[20px] leading-[30px] font-medium">
                                Manage your
                                <br />
                                business payments
                                <br />
                                <span className="text-[#FFB504]">effortlessly</span>
                            </h1>
                            <p className="text-gray-300 mt-2 leading-5 text-[13px] font-normal">
                                Secure platform for merchants with
                                lightning-fast settlements and
                                powerful dashboard.
                            </p>

                            {/* Features */}
                            <div className="space-y-8 mt-4">
                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <FaShieldAlt className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">
                                            Secure Transactions
                                        </h3>
                                        <p className="text-gray-300 text-sm mt-1">
                                            Bank level encrypted
                                            <br />
                                            payment infrastructure.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <FaBolt className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">
                                            Fast Settlement
                                        </h3>
                                        <p className="text-gray-300 text-sm mt-1">
                                            Receive your payments
                                            <br />
                                            quickly and securely.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <FaChartBar className="text-yellow-400 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">
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
                        <div className="flex justify-center">
                            <img
                                src={img2}
                                alt=""
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="flex-1 relative bg-cover bg-right bg-no-repeat px-6 sm:px-8 md:px-10 lg:px-12 py-8">
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" />
                    <div className="relative z-10 flex justify-center items-center min-h-full py-6 lg:px-6">                        <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center lg:mb-8">
                            <img
                                src="/logo.avif"
                                className="h-14"
                                alt=""
                            />
                        </div>
                        {/* Heading */}
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#071C39] text-center lg:text-left">
                            Welcome Back!
                        </h2>
                        <p className="mb-7 text-base text-gray-500 text-center lg:text-left ">
                            Login to your Merchant Account
                        </p>
                        {/* FORM START */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {/* Part-2*/}
                            <div>
                                <label className="block text-sm font-semibold text-gray-500 mb-2">
                                    USER ID
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        value={userId}
                                        required
                                        onChange={(e) => setUserId(e.target.value)}
                                        className="w-full h-12 rounded-xl border border-gray-300 bg-white pl-12 pr-4 outline-none focus:border-[#FDB913] transition"
                                        style={{
                                            WebkitBoxShadow: "0 0 0 1000px white inset",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-500 mb-2">
                                    PASSWORD
                                </label>
                                <div className="relative">
                                    <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 rounded-xl border border-gray-300 bg-white pl-12 pr-12 outline-none focus:border-[#FDB913] transition"
                                        style={{
                                            WebkitBoxShadow: "0 0 0 1000px white inset",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FDB913]"
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="accent-[#FDB913] w-4 h-4"
                                    />
                                    Remember me
                                </label>
                                <button
                                    type="button"
                                    onClick={() => navigate("/forgot")}
                                    className="text-[#3498db] text-sm hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                className="w-full h-12 rounded-xl bg-[#FDB913] hover:bg-[#f3aa00] text-[#071C39] font-semibold text-lg transition flex items-center justify-center gap-3 shadow-md"
                            >
                                <TbLogin2 />
                                Log In
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-sm text-gray-500">
                                    New to HelloPe?
                                </span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {/* Become Reseller */}
                            {/* <button
                                type="button"
                                className="w-full h-12 rounded-xl border border-[#f6b93b] text-[#f6b93b] hover:bg-[#FFF8E7] font-semibold flex items-center justify-center gap-3 transition"
                            >
                                <RiUserShared2Line
                                    size={18}
                                    className="text-[#f6b93b]"
                                />
                                Become a Reseller
                            </button> */}

                            {/* Need Help */}
                            <div className="p-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#F3F9FF] flex items-center justify-center flex-shrink-0">
                                        <MdOutlineHeadsetMic
                                            size={25}
                                            className="text-[#2980b9] text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#071C39]">
                                            Need Help?
                                        </h4>
                                        <p className="text-sm text-gray-700 mt-1">
                                            Contact Us at<span className="text-[#3498db] font-medium mt-2"> support@hellope.co.in</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="flex items-center justify-center gap-2 text-sm text-gray-400 font-semibold">
                                    <GrShieldSecurity className="text-base" />
                                    <span>Your security is our Priority</span>
                                </p>
                                <p className="text-center text-xs text-gray-400 mt-1 font-semibold">
                                    © 2026 HelloPe Financial Services Pvt. Ltd. All Rights Reserved.
                                </p>
                            </div>
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );

}