import {
    X,
    Info,
    Mail,
    MessageCircle,
    Smartphone,
    QrCode,
    Copy,
    Check,
    Link as LinkIcon,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
export default function CreatePaymentLinkModal({
    isOpen,
    onClose,
    data,
    createPaymentLink,
}) {
    const [paymentData, setPaymentData] = useState(data); // Child Data Can update this State
    const [creating, setCreating] = useState(false);
    const [showLinkPopup, setShowLinkPopup] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState("mail");
    const [copied, setCopied] = useState(false);

    const handleCloseAll = () => {
        setShowLinkPopup(false);
        onClose();
    };

    // Copy Function
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
        catch {
            toast.error("Failed To Copy Link");
        }
    };

    useEffect(() => {
        setPaymentData(data);
    }, [data]);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        try {
            setCreating(true);
            const result = await createPaymentLink(paymentData);
            const responseData = result?.respData || result || {};
            const directLink = responseData?.url;

            // Update all API response data in popup
            setPaymentData((prev) => ({
                ...prev,
                ...responseData,
                agentName: responseData?.agentName || prev.agentName,
                paymentLink: directLink,
                url: directLink,
            }));
            if (directLink) {                
                setShowLinkPopup(true);
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setCreating(false);
        }
    };

    // Handle Share Function
    const handleSendShare = () => {
        const link = paymentData?.url || "";
        if (!link) {
            toast.error("Payment link not available");
            return;
        }
        const message = `Hello ${agentName}, please complete your payment using this link: ${link}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    const companyName = paymentData?.companyName || paymentData?.agentName || "";
    const expiresOn = paymentData?.expiresOn || "";
    const orderId = paymentData?.orderId || "";
    const agentName = paymentData?.agentName || "";
    const orderStatus = paymentData?.orderStatus || paymentData?.status || "";

    return (
        
        <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            {/* First popup: only render when second popup is NOT open */}
            {!showLinkPopup && (
                <div
                    className="bg-white rounded-xl w-full max-w-[420px] shadow-xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 border-b">
                        <h2 className="text-lg sm:text-xl font-semibold">Create Payment Link</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 sm:p-6 space-y-4">
                        {/* Order ID */}
                        <div>
                            <label className="text-sm font-medium">Order ID</label>
                            <input
                                value={paymentData.orderId || ""}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2.5 sm:py-3 mt-1 bg-gray-100 text-sm"
                            />
                        </div>

                        {/* Mode */}
                        <div>
                            <label className="text-sm font-medium">Mode</label>
                            <input
                                value={paymentData.mode || ""}
                                readOnly
                                className="w-full border rounded-lg px-3 py-2.5 sm:py-3 mt-1 bg-gray-100 text-sm"
                            />
                        </div>

                        {/* Agent Name */}
                        <div>
                            <label className="text-sm font-medium">
                                Agent Name
                            </label>
                            <input
                                type="text"
                                value={paymentData?.agentName || ""}
                                onChange={(e) =>
                                    setPaymentData((prev) => ({
                                        ...prev,
                                        agentName: e.target.value,
                                    }))
                                }
                                className="w-full border rounded-lg px-3 py-2.5 sm:py-3 mt-1 text-sm outline-none focus:border-blue-500"
                                placeholder="Agent Name"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 border-t">
                        <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 border rounded-lg text-sm font-medium">
                            Cancel
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={creating}
                            className="w-full sm:w-auto px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium"
                        >
                            {creating ? "Generating..." : "Generate Link"}
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={creating}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                        >
                            Generate and Share
                        </button>
                    </div>
                </div>
            )}

            {/* Second popup */}
            {showLinkPopup && (
                <div
                    className="fixed inset-0 bg-black/40 flex justify-center items-center z-[60] p-4"
                    onClick={handleCloseAll}
                >
                    <div
                        className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                            <h2 className="text-xl font-semibold text-gray-900 uppercase">
                                Share Payment Link
                            </h2>
                            <button
                                onClick={handleCloseAll}
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div>
                            {/* Customer Details */}
                            <div className="px-4 py-4 border-b border-gray-100">
                                <h3 className="text-base font-semibold text-gray-800 mb-3">
                                    Customer Details
                                </h3>
                                <div className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                                    {/* Order ID */}
                                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-500">
                                            Order ID
                                        </span>
                                        <span className="text-sm font-semibold text-gray-800 truncate max-w-[220px]">
                                            {orderId || "-"}
                                        </span>
                                    </div>
                                    {/* Agent Name */}
                                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
                                        <span className="text-sm font-medium text-gray-500">
                                            Agent Name
                                        </span>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {agentName || "-"}
                                        </span>
                                    </div>
                                    {/* Order Status */}
                                    <div className="flex items-center justify-between px-3 py-2.5">
                                        <span className="text-sm font-medium text-gray-500">
                                            Order Status
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                            {orderStatus || "-"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Link */}
                            <div className="px-4 py-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Link
                                </label>
                                <div className="relative">
                                    <input
                                        value={paymentData?.url || ""}
                                        readOnly
                                        className="w-full border border-gray-100 rounded-lg px-3 py-2.5 pr-10 text-sm bg-gray-50 text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard(paymentData?.url || "")
                                        }
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition ${copied
                                            ? "text-green-600 bg-green-50"
                                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                            }`}

                                        title={copied ? "Copied" : "Copy Link"}
                                    >
                                        {copied ? (
                                            <Check size={16} />
                                        ) : (
                                            <Copy size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 px-4 py-3 border-t">
                            <button
                                onClick={handleCloseAll}
                                className="px-4 py-2 border rounded-lg text-xs font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendShare}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium"
                            >
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}