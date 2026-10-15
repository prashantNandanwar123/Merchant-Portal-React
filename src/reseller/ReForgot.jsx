import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import OtpVerify from "../pages/OtpVerify";
import axiosInstance from "../api/axios";
import { FaEye, FaEyeSlash, FaShieldAlt, FaBolt, FaChartBar } from "react-icons/fa";
import logo from "../assets/img-1.jpeg";
import img2 from "../assets/img-2.jpeg";


export default function ForgotPassword() {
    const navigate = useNavigate();
    const [resellerId, setresellerId] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [timer, setTimer] = useState(120); // 15 minutes = 900 sec

    // Timer Logic
    useEffect(() => {
        let interval;
        if (otpSent && timer) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");

    // OTP Change Handler
    const handleOtpChange = (e) => {
        const value = e.target.value;
        // Sirf numbers allow
        if (!/^\d*$/.test(value)) {
            return;
        }
        setOtp(value);
        if (value.length > 0 && value.length < 6) {
            setOtpError("OTP should be 6 digits");
        } else {
            setOtpError("");
        }
    };

    //----- sendForgotPasswordOtp APi CAll ----
    const sendOtp = async (e) => {
        e.preventDefault();
        if (!resellerId) {
            toast.error("Please enter resellerId");
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance.post("/reseller/sendForgotPasswordOtp",
                {
                    resellerId,
                }
            );
            if (response?.respCode === 0) {
                toast.success(response.respMsg);
                setTimer(120); // restart 15 min timer
                setOtpSent(true);
                // OTP field show hoga
            } else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    //----- verifyForgotPasswordOtp APi CAll ----
    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }
        try {
            setLoading(true);
            const response = await axiosInstance.post(
                "/reseller/verifyForgotPasswordOtp",
                {
                    resellerId,
                    otp,
                }
            );
            if (response?.respCode === 0) {
                toast.success(response.respMsg);

                setOtpVerified(true);
                setOtpSent(false);
                // OTP field show hoga

            } else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    //---- password validation---
    const passwordValidation = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isPasswordValid =
        passwordValidation.length &&
        passwordValidation.uppercase &&
        passwordValidation.lowercase &&
        passwordValidation.number &&
        passwordValidation.special;

    const passwordMatched =
        password &&
        confirmPassword &&
        password === confirmPassword;

    //----- HandlePAssword-----
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (
            !passwordValidation.length ||
            !passwordValidation.uppercase ||
            !passwordValidation.lowercase ||
            !passwordValidation.number ||
            !passwordValidation.special
        ) {
            toast.error(
                "Password must contain 8+ characters, uppercase, lowercase, number and special character"
            );
            return;
        }
        if (!resellerId || !password || !confirmPassword) {
            toast("Please fill all fields", {
                icon: "⚠️",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post("/reseller/submitForgotPassword", {
                resellerId,
                password,
                confPassword: confirmPassword,
            });

            if (response?.respCode === 0) {
                toast.success(response?.respMsg);
                setTimeout(() => {
                    navigate("/reLogin");
                }, 1000);
            } else {
                toast.error(response?.respMsg);
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const req = <span className="text-red-500">*</span>;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 overflow-auto login-bg">            <div
            className="
                w-full
                max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-xl
                bg-white
                rounded-xl
                shadow-xl
                flex
                flex-col
                md:flex-row
                ">
      

            {/* ================= RIGHT SIDE ================= */}
            <div className="flex-1 relative bg-cover bg-right bg-no-repeat md:rounded-r-2xl p-5">
                <div className="px-3 md:px-10 lg:px-12 py-3 md:py-2 flex flex-col">
                    <div className="flex justify-center mb-3">
                        <img
                            src="/logo.avif"
                            alt="Logo"
                            className="h-16 md:h-10 object-contain"
                        />
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-4 cursor-default">
                        <h2 className="text-2xl md:text-xl font-medium text-black">
                            Reset Password
                        </h2>
                        <p className="text-gray-500 mt-1 text-lg md:text-xs">
                            Reset your account password securely
                        </p>
                    </div>

                    <form className="space-y-3 flex-1">
                        {/* USER ID */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 text-gray-600 text-sm">
                                Reseller Id {req}
                            </label>
                            <input
                                type="text"
                                value={resellerId}
                                maxLength={20}
                                onChange={(e) => setresellerId(e.target.value)}
                                className="w-full h-10 md:h-10 px-4 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#fec931]"
                            />

                            {otpSent && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">
                                    ✓
                                </span>
                            )}
                        </div>

                        {/* SEND OTP */}
                        {!otpSent && !otpVerified && (
                            <button
                                type="button"
                                onClick={sendOtp}
                                disabled={loading}
                                className="w-full h-14 md:h-10 bg-[#fec931] cursor-pointer text-black rounded-xl text-lg font-normal transition"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        )}

                        {/* OTP */}
                        {otpSent && (
                            <div className="relative mt-5">
                                <label className="absolute -top-3 left-4 bg-white px-2 text-gray-600 text-sm">
                                    OTP {req}
                                </label>

                                <input
                                    type="text"
                                    value={otp}
                                    maxLength={6}
                                    disabled={!otpSent}
                                    onChange={handleOtpChange}
                                    className={`w-full h-14 md:h-10 px-4 border rounded-xl bg-white focus:outline-none focus:border-[#fec931] ${otpError
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        }`}
                                />

                                {otpVerified && (
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">
                                        ✓
                                    </span>
                                )}

                                {otpError && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {otpError}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-sm md:text-xs text-gray-600">
                                        Your OTP will expire in{" "}
                                        <span className="font-semibold text-red-500">
                                            {minutes}:{seconds}
                                        </span>
                                    </p>

                                    <button
                                        type="button"
                                        onClick={sendOtp}
                                        disabled={timer > 0}
                                        className={`text-sm md:text-xs font-medium ${timer > 0
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-orange-500 hover:text-orange-600"
                                            }`}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* VERIFY OTP */}
                        {otpSent && !otpVerified && (
                            <button
                                type="button"
                                onClick={verifyOtp}
                                disabled={loading}
                                className="w-full h-10 bg-[#fec931] cursor-pointer text-black rounded-xl text-lg font-normal transition">                            
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        )}

                        {/* PASSWORDS */}

                        {otpVerified && (
                            <>
                                {/* NEW PASSWORD */}
                                <div className="relative mt-5">
                                    <label className="absolute -top-3 left-4 bg-white px-2 text-gray-600 text-sm">
                                        New Password
                                    </label>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full h-14 md:h-10 px-4 pr-20 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#fec931]"
                                        style={{
                                            backgroundColor: "#fff",
                                            WebkitBoxShadow:
                                                "0 0 0 1000px white inset",
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500">
                                    
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>

                                    {password.length > 0 && (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">
                                            ✓
                                        </span>
                                    )}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div className="relative">
                                    <label className="absolute -top-3 left-4 bg-white px-2 text-gray-600 text-sm">
                                        Confirm Password {req}
                                    </label>

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="w-full h-10 px-4 pr-20 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#fec931]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>

                                    {confirmPassword &&
                                        password === confirmPassword && (
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-xl font-bold">
                                                ✓
                                            </span>
                                        )}
                                </div>

                                {/* RESET PASSWORD */}
                                <button
                                    type="button"
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                    className="w-full cursor-pointer h-14 md:h-10 bg-[#fec931] text-black rounded-xl text-lg font-normal transition"
                                >
                                    {loading
                                        ? "Processing..."
                                        : "Reset Password"}
                                </button>
                            </>
                        )}

                        {/* BACK TO LOGIN */}
                        <button
                            type="button"
                            onClick={() => navigate("/reLogin")}
                            className="w-full h-14 md:h-10 border cursor-pointer border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                        >
                            Back to Login
                        </button>

                        <div className="mt-1 p-4 rounded-lg bg-yellow-50 cursor-default">
                            <p className="text-xs font-semibold text-orange-700 mb-0.5">
                                Note :
                            </p>
                            <ul className="text-xs text-gray-600 space-y-0.5 leading-4">
                                <li>• Password must contain at least 8 characters</li>
                                <li>• Include at least one uppercase letter</li>
                                <li>• Include at least one lowercase letter</li>
                                <li>• Include at least one number</li>
                                <li>• Include at least one special character</li>
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
}