import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaRegCopy } from "react-icons/fa";
import { Copy, Check } from "lucide-react";

export default function ApiKeys() {
    const [apikeys, setApiKeys] = useState({});
    const [loading, setLoading] = useState(true);

    const [showSaltKey, setShowSaltKey] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);


    const copyToClipboard = async (text, keyName) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(keyName);
            setTimeout(() => {
                setCopiedKey(null);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const fetchApiKeys = async () => {
        try {
            const response = await axiosInstance.post("/fetchApiKeys");
            if (response.respCode === 0) {
                setApiKeys({
                    saltKey: response.respData[0],
                    secretKey: response.respData[1],
                });
            } else {
                toast.error(response.resMsg);
            }
        }
        catch (error) {
            toast.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchApiKeys();
    }, [])

    return (
        <div className="p-4 sm:p-6 lg:p-8 xl:p-5 bg-[#f5f6fa] min-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="max-w-5xl xl:max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 xl:p-5">
                <h2 className="text-xl sm:text-2xl xl:text-xl uppercase text-gray-900 mb-4 sm:mb-6 xl:mb-4 font-bold">
                    API Keys
                </h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {/* Salt Key */}
                        <div className="mb-5 xl:mb-4">
                            <label className="block text-base sm:text-lg xl:text-base text-gray-800 font-normal mb-2 xl:mb-1.5">
                                Access Key
                            </label>

                            <div className="flex items-center border border-gray-300 rounded-md bg-[#f8f9fb] h-12 xl:h-10 px-3 xl:px-2.5 gap-2 xl:gap-1.5">
                                <input
                                    type={showSaltKey ? "text" : "password"}
                                    readOnly
                                    value={apikeys?.saltKey || ""}
                                    className="flex-1 min-w-0 bg-transparent outline-none text-xs sm:text-sm xl:text-xs text-gray-700 truncate"
                                />

                                {showSaltKey ? (
                                    <FaEye
                                        className="text-gray-500 cursor-pointer mr-4 xl:mr-2 xl:w-4 xl:h-4"
                                        onClick={() => setShowSaltKey(false)}
                                    />
                                ) : (
                                    <FaEyeSlash
                                        className="text-gray-500 cursor-pointer mr-4 xl:mr-2 xl:w-4 xl:h-4"
                                        onClick={() => setShowSaltKey(true)}
                                    />
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        copyToClipboard(apikeys?.saltKey || "", "access")
                                    }
                                    className={`p-1.5 xl:p-1 rounded-md transition ${copiedKey === "access"
                                            ? "text-green-600 bg-green-50"
                                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                        }`}
                                    title={copiedKey === "access" ? "Copied" : "Copy"}
                                >
                                    {copiedKey === "access" ? (
                                        <Check size={16} className="xl:w-4 xl:h-4" />
                                    ) : (
                                        <Copy size={16} className="xl:w-4 xl:h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Secret Key */}
                        <div className="mb-5 xl:mb-4">
                            <label className="block text-base sm:text-lg xl:text-base text-gray-700 mb-2 xl:mb-1.5">
                                Secret Key
                            </label>

                            <div className="flex items-center border border-gray-300 rounded-md bg-[#f8f9fb] h-12 xl:h-10 px-3 xl:px-2.5 gap-2 xl:gap-1.5">
                                <input
                                    type={showSecretKey ? "text" : "password"}
                                    readOnly
                                    value={apikeys?.secretKey || ""}
                                    className="flex-1 min-w-0 bg-transparent outline-none text-xs sm:text-sm xl:text-xs text-gray-700 font-normal truncate"
                                />

                                {showSecretKey ? (
                                    <FaEye
                                        className="text-gray-500 cursor-pointer mr-4 xl:mr-2 xl:w-4 xl:h-4"
                                        onClick={() => setShowSecretKey(false)}
                                    />
                                ) : (
                                    <FaEyeSlash
                                        className="text-gray-500 cursor-pointer mr-4 xl:mr-2 xl:w-4 xl:h-4"
                                        onClick={() => setShowSecretKey(true)}
                                    />
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        copyToClipboard(apikeys?.secretKey || "", "secret")
                                    }
                                    className={`p-1.5 xl:p-1 rounded-md transition ${copiedKey === "secret"
                                            ? "text-green-600 bg-green-50"
                                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                        }`}
                                    title={copiedKey === "secret" ? "Copied" : "Copy"}
                                >
                                    {copiedKey === "secret" ? (
                                        <Check size={16} className="xl:w-4 xl:h-4" />
                                    ) : (
                                        <Copy size={16} className="xl:w-4 xl:h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Security Notes */}
                        <div className="border border-gray-200 rounded-md bg-[#f8f9fb] p-4 xl:p-3">
                            <h3 className="text-lg xl:text-base font-medium text-gray-800 mb-3 xl:mb-2">
                                Security Notes
                            </h3>

                            <ul className="text-sm xl:text-xs text-gray-600 space-y-2 xl:space-y-1.5">
                                <li>
                                    • Keep your Salt Key confidential.
                                </li>
                                <li>
                                    • Do not expose Secret Key in frontend
                                    code.
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}