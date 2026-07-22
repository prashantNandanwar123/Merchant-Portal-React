import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";

export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();

    const userName = location.state?.userName;

    const [otp, setOtp] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userName) {
            navigate("/reset-password");
        }
    }, [userName, navigate]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!otp) {
            toast.warning("Please enter OTP");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post(
                "/verifyForgotPasswordOtp",
                {
                    userName,
                    otp,
                }
            );

            if (response.respCode === 0) {
                console.log("STEP 1");
                toast.success(response.respMsg);
                console.log("STEP 2");
                setOtpVerified(true);
            } else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            console.log("STEP 3");
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Password Validaton
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

    // Reset Password Api

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
        if (!userName || !password || !confirmPassword) {
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

            const response = await axiosInstance.post("/auth/resetPassword", {
                userName,
                password,
                confPassword: confirmPassword,
            });

            if (response?.respCode === 0) {
                console.log("rest password Message--->>>", response?.respMsg);
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


    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <img
                        src="/logo1.avif"
                        alt="Logo"
                        className="h-14 mx-auto mb-4"
                    />
                    <h2 className="text-3xl font-bold text-gray-800">
                        Verify OTP
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Enter the OTP sent to your account
                    </p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={userName || ""}
                            readOnly
                            className="
                            w-full
                            border
                            border-gray-300
                            rounded-xl
                            px-4
                            py-3
                            bg-gray-100
                            "
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            OTP
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="
                            w-full
                            border
                            border-gray-300
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:ring-2
                            focus:ring-orange-500
                            focus:border-orange-500
                            "
                        />
                    </div>

                    {otpVerified && (
                        <>
                            {/* New Password */}
                            <div>
                                <label className="block mb-2">
                                    New Password
                                </label>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border rounded-xl px-4 py-3"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border rounded-xl px-4 py-3"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleResetPassword}
                                className="w-full bg-green-600 text-white py-3 rounded-xl"
                            >
                                Reset Password
                            </button>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                                w-full
                                bg-orange-500
                                hover:bg-orange-600
                                text-white
                                py-3
                                rounded-xl
                                font-semibold
                                transition
                                disabled:opacity-60
                                "
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="
                        w-full
                        border
                        border-gray-300
                        hover:bg-gray-100
                        text-gray-700
                        py-3
                        rounded-xl
                        font-medium
                        "
                    >
                        Back
                    </button>
                </form>
            </div>
        </div>
    );
}