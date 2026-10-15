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
import logo from "../assets/logo.avif";
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
    const [resellerId, setresellerId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            const response = await axiosInstance.post("/reseller/auth/login", {
                resellerId: resellerId,
                password: password,
            });

            if (response.respCode === 0) {
                localStorage.setItem("isLogin", "true");
                localStorage.setItem("user", JSON.stringify(response.respData));
                toast.success(response.respMsg);
                setTimeout(() => {
                    navigate("/reseller/reDashboard");
                }, 100);

            } else if (response.respCode === 3) {
                toast.success(response.respMsg);
                setTimeout(() => {
                    navigate("/reForgot");
                }, 100);
            }
            else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            toast.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 py-8 overflow-y-auto login-bg">
            <div className="w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto">

                {/* ---------------- RIGHT SIDE ---------------- */}
                <div className="flex-1 relative bg-cover bg-right bg-no-repeat md:rounded-r-2xl p-5">
                    <div className="relative z-10 flex justify-center items-center min-h-full py-6 xl:py-2 md:px-2 lg:px-8">
                        <div className="w-full max-w-md">
                            {/* Mobile Logo */}
                            <div className="md:hidden flex justify-center mb-8">
                                <img
                                    src="/logo.avif"
                                    className="h-12 xl:h-11"
                                    alt=""
                                />
                            </div>
                            <img
                                src={logo}
                                alt="HelloPe Logo"
                                className="hidden md:block h-16 md:h-18 lg:h-20 xl:h-16 object-contain mx-auto"
                                style={{ marginLeft: "auto", marginRight: "auto" }}
                            />
                            <h2 className="text-2xl font-bold text-[#071C39] text-center cursor-default">
                                Welcome Back!
                            </h2>
                            <p className="mb-2 xl:mb-3 md:pb-2 text-sm text-gray-500 text-center cursor-default">
                                Login to your Reseller Account
                            </p>

                            {/* FORM START */}
                            <form onSubmit={handleSubmit} className="space-y-4 xl:space-y-2">
                                <div>
                                    <label className="block text-sm font-normal text-gray-900 mb-2">
                                        Reseller Id
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            value={resellerId}
                                            placeholder="Enter Reseller Id"
                                            required
                                            onChange={(e) =>
                                                setresellerId(e.target.value)}                                            
                                            className="w-full h-10 rounded-xl border border-gray-300 bg-white pl-12 pr-4 outline-none focus:border-[#FDB913] transition"
                                            style={{
                                                WebkitBoxShadow:
                                                    "0 0 0 1000px white inset",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <label className="block text-sm font-normal text-gray-900 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <RiLockPasswordLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            placeholder="Enter Password"
                                            required
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="w-full  h-10 rounded-xl border border-gray-300 bg-white pl-12 pr-12 outline-none focus:border-[#FDB913] transition"
                                            style={{
                                                WebkitBoxShadow:
                                                    "0 0 0 1000px white inset",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FDB913]">
                                        
                                            {showPassword ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* LOGIN BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full h-10 rounded-xl text-[#071C39] font-normal text-lg transition flex items-center justify-center gap-3 shadow-md
                                              ${loading
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-[#fec931] cursor-pointer"
                                        }`}
                                >
                                    <TbLogin2 />
                                    {loading ? "Logging In..." : "Log In"}
                                </button>

                                <div className="flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/reForgot")}
                                        className="text-[#3498db] text-sm hover:underline cursor-pointer"
                                    >
                                        Forgot Password?
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate("/")}
                                        className="text-[#3498db] text-sm hover:underline cursor-pointer"
                                    >
                                        Became a Merchant
                                    </button>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-2 pt-2 cursor-default">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-sm text-gray-500">
                                        Don't have an account?
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/partner-onboarding")}
                                        className="text-[#3498db] text-sm hover:underline cursor-pointer"
                                    >
                                        Register as Partner
                                    </button>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>

                                {/* Need Help */}
                                <div className="p-2">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#F3F9FF] flex items-center justify-center flex-shrink-0">
                                            <MdOutlineHeadsetMic
                                                size={25}
                                                className="text-[#2980b9] text-lg"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#071C39] cursor-default">
                                                Need Help?
                                            </h4>
                                            <p className="text-xs text-gray-700 md:mt-1 cursor-default">
                                                Contact Us at
                                                <span className="text-[#3498db] font-medium mt-2 cursor-pointer">
                                                    {" "}
                                                    support@helloPe.co.in
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="border-t border-gray-200 cursor-default">
                                    <p className="flex items-center justify-center gap-2 md:pt-2 text-sm text-gray-400 font-normal">
                                        <GrShieldSecurity className="text-xs" />
                                        <span>
                                            Your security is our Priority
                                        </span>
                                    </p>
                                    <p className="text-center md:text-xs text-gray-400 mt-1 font-normal">
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