import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import OtpVerify from "./OtpVerify";
import axiosInstance from "../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
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
        if (!userId) {
            toast.error("Please enter userId");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post("/sendForgotPasswordOtp",
                {
                    userId,
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
                "/verifyForgotPasswordOtp",
                {
                    userId,
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
        if (!userId || !password || !confirmPassword) {
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
            const response = await axiosInstance.post("/submitForgotPassword", {
                userId,
                password,
                confPassword: confirmPassword,
            });

            if (response?.respCode === 0) {
                toast.success(response?.respMsg);
                setTimeout(() => {
                    navigate("/");
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
        <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
            {/* Main Container */}
            <div className="lg:w-1/2 flex items-center justify-center  px-6 py-10">
                <div className="w-full max-w-md min-h-[700px] bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col">                        <div className="flex justify-center mb-8">
                    <img
                        src="/logo.avif"
                        alt="Logo"
                        className="h-16 object-contain"
                    />
                </div>

                    {/* Heading */}
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-medium text-black">
                            Reset Password
                        </h2>
                        <p className="text-gray-500 mt-1 text-lg">
                            Reset your account password securely
                        </p>
                    </div>

                    <form className="space-y-5 flex-1">
                        {/* USER ID */}
                        <div className="relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 text-gray-600 text-sm">
                                User ID {req}
                            </label>
                            <input
                                type="text"
                                value={userId}
                                maxLength={20}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full h-14 px-4 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-orange-500"
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
                                className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-medium transition"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        )}

                        {/* OTP */}
                        {otpSent && (
                            <div className="relative">
                                <label className="absolute -top-3 left-4 bg-white px-2 text-gray-600 text-sm">
                                    OTP {req}
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    maxLength={6}
                                    disabled={!otpSent}
                                    onChange={handleOtpChange}
                                    className={`w-full h-14 px-4 border rounded-xl bg-white focus:outline-none focus:border-orange-500 ${otpError ? "border-red-500" : "border-gray-300"
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
                                    <p className="text-sm text-gray-600">
                                        Your OTP will expire in{" "}
                                        <span className="font-semibold text-red-500">
                                            {minutes}:{seconds}
                                        </span>
                                    </p>

                                    <button
                                        type="button"
                                        onClick={sendOtp}
                                        disabled={timer > 0}
                                        className={`text-sm font-medium ${timer > 0
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
                                className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-medium transition"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        )}

                        {/* PASSWORDS */}
                        {otpVerified && (
                            <>
                                {/* NEW PASSWORD */}
                                <div className="relative">
                                    <label className="absolute -top-3 left-4 bg-white px-2 text-gray-600 text-sm">
                                        New Password
                                    </label>

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-14 px-4 pr-20 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-orange-500"
                                        style={{
                                            backgroundColor: "#fff",
                                            WebkitBoxShadow: "0 0 0 1000px white inset",
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full h-14 px-4 pr-20 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-orange-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
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
                                    onClick={() => setShowPassword(!showPassword)}
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                    className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-medium transition"

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
                            onClick={() => navigate("/")}
                            className="w-full h-14 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                        >
                            Back to Login
                        </button>
                        <div className="mt-3 p-3 rounded-xl bg-yellow-50">
                            <p className="text-xs font-semibold text-orange-700 mb-1">
                                Note:
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1">
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
    );
}