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
        <div className="p-8 bg-[#f5f6fa] min-h-screen">
            <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-2xl uppercase  text-gray-900 mb-6 font-bold">
                    API Keys
                </h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {/* Salt Key */}
                        <div className="mb-5">
                            <label className="block text-lg text-gray-800 font-normal mb-2">
                                Access Key
                            </label>

                            <div className="flex items-center border border-gray-300 rounded-md bg-[#f8f9fb] h-12 px-3">
                                <input
                                    type={showSaltKey ? "text" : "password"}
                                    readOnly
                                    value={apikeys?.saltKey || ""}
                                    className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                                />

                                {showSaltKey ? (
                                    <FaEye
                                        className="text-gray-500 cursor-pointer mr-4"
                                        onClick={() =>
                                            setShowSaltKey(false)
                                        }
                                    />
                                ) : (
                                    <FaEyeSlash
                                        className="text-gray-500 cursor-pointer mr-4"
                                        onClick={() =>
                                            setShowSaltKey(true)
                                        }
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() =>
                                        copyToClipboard(apikeys?.saltKey || "", "access")
                                    }
                                    className={`p-1.5 rounded-md transition ${copiedKey === "access"
                                        ? "text-green-600 bg-green-50"
                                        : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                        }`}
                                    title={copiedKey === "access" ? "Copied" : "Copy"}
                                >
                                    {copiedKey === "access" ? (
                                        <Check size={16} />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Secret Key */}
                        <div className="mb-5">
                            <label className="block text-lg text-gray-700 mb-2">
                                Secret Key
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-md bg-[#f8f9fb] h-12 px-3">
                                <input
                                    type={showSecretKey ? "text" : "password"}
                                    readOnly
                                    value={apikeys?.secretKey || ""}
                                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 font-normal"
                                />
                                {showSecretKey ? (
                                    <FaEye
                                        className="text-gray-500 cursor-pointer mr-4"
                                        onClick={() =>
                                            setShowSecretKey(false)
                                        }
                                    />
                                ) : (
                                    <FaEyeSlash
                                        className="text-gray-500 cursor-pointer mr-4"
                                        onClick={() =>
                                            setShowSecretKey(true)
                                        }
                                    />
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        copyToClipboard(apikeys?.secretKey || "", "secret")
                                    }
                                    className={`p-1.5 rounded-md transition ${copiedKey === "secret"
                                            ? "text-green-600 bg-green-50"
                                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                        }`}
                                    title={copiedKey === "secret" ? "Copied" : "Copy"}
                                >
                                    {copiedKey === "secret" ? (
                                        <Check size={16} />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Security Notes */}
                        <div className="border border-gray-200 rounded-md bg-[#f8f9fb] p-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">
                                Security Notes
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-2">
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