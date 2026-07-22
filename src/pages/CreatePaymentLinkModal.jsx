import {
    X,
    Info,
    Mail,
    MessageCircle,
    Smartphone,
    QrCode,
    Copy,
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

    // Cpoy Function
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Link Copied");
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

    const ScanAndPay = () => (
        <div className="px-5 pb-4">
            <div className="border border-dashed rounded-lg py-4 flex flex-col items-center gap-2">
                <div className="px-5 pb-5 flex flex-col items-center">
                    <QRCode
                        value={paymentData?.url || "https://example.com"}
                        size={150}
                    />
                    <p className="mt-3 text-xs font-medium text-gray-700">
                        Scan & Pay
                    </p>
                    <p className="mt-1 text-[10px] text-gray-400 break-all text-center">
                        {paymentData?.url}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl w-[420px] shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b">
                    <h2 className="text-xl font-semibold">Create Payment Link</h2>
                    <button onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Order ID */}
                    <div>
                        <label className="text-sm font-medium">Order ID</label>
                        <input
                            value={paymentData.orderId || ""}
                            readOnly
                            className="w-full border rounded-lg px-3 py-3 mt-1 bg-gray-100"
                        />
                    </div>

                    {/* Mode */}
                    <div>
                        <label className="text-sm font-medium">Mode</label>
                        <input
                            value={paymentData.mode || ""}
                            readOnly
                            className="w-full border rounded-lg px-3 py-3 mt-1 bg-gray-100"
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
                            className="w-full border rounded-lg px-3 py-3 mt-1"
                            placeholder="Agent Name"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-5 border-t">
                    <button onClick={onClose} className="px-5 py-2 border rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={creating}
                        className="px-5 py-2 border border-blue-600 text-blue-600 rounded-lg"
                    >
                        {creating ? "Generating..." : "Generate Link"}
                    </button>

                    <button
                        onClick={handleGenerate}
                        disabled={creating}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Generate and Share
                    </button>
                </div>
            </div>

            {/* Second popup: Share Payment Link screen, shown once the link is ready */}
            {showLinkPopup && (
                <div
                    className="fixed inset-0 bg-black/40 flex justify-center items-center z-[60]"
                    onClick={() => setShowLinkPopup(false)}
                >
                    <div
                        className="bg-white rounded-xl w-[600px] max-w-[95vw] shadow-xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                            <h2 className="text-base font-semibold text-gray-900">
                                Share Payment Link
                            </h2>
                            <button
                                onClick={() => setShowLinkPopup(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex">
                            {/* Left column: order details */}
                            <div className="w-[200px] shrink-0 border-r px-3 py-3">
                                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                                    Customer Details
                                </h3>
                                <div className="space-y-1.5">
                                    {/* Order ID */}
                                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-2">
                                        <Info size={14} className="text-gray-500 shrink-0" />
                                        <span className="text-xs text-gray-800 truncate">
                                            {orderId || ""}
                                        </span>
                                    </div>

                                    {/* Agent Name */}
                                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-2">
                                        <Info size={14} className="text-gray-500 shrink-0" />
                                        <span className="text-xs text-gray-800 truncate">
                                            {agentName || ""}
                                        </span>
                                    </div>

                                    {/* Order Status */}
                                    <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-2">
                                        <Info size={14} className="text-gray-500 shrink-0" />
                                        <span className="text-xs text-gray-800 truncate">
                                            {orderStatus || ""}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="flex-1 min-w-0 m-3">
                                <div>
                                    <label className="text-xs font-medium">
                                        Payment Link
                                    </label>
                                    <div className="relative mt-1">
                                        <input
                                            value={paymentData?.url || ""}
                                            readOnly
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-9 bg-gray-100 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(paymentData?.url || "")}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                                            title="Copy Link"
                                        >
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className="p-4 flex justify-center"
                                    style={{
                                        backgroundImage:
                                            "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
                                        backgroundSize: "14px 14px",
                                    }}
                                >
                                    <div className="w-[230px] bg-white rounded-2xl shadow-md overflow-hidden">
                                        <div className="bg-[#FDC700] h-10 flex items-center justify-center">
                                            <span className="text-white text-xs font-medium">
                                                {companyName || "Your Business"}
                                            </span>
                                        </div>

                                        <div className="px-3 pt-3 pb-2 text-center">
                                            <p className="text-[10px] text-gray-500 mb-0.5">
                                                {companyName || "Your Business"} has requested a
                                                payment of:
                                            </p>
                                        </div>

                                        {/* Scan and Pay: QR code + link URL, shown for both templates */}
                                        <ScanAndPay />
                                        {expiresOn && (
                                            <p className="text-[9px] text-gray-400 text-center pb-2">
                                                Link expires on: {expiresOn}
                                            </p>
                                        )}
                                        <div className="px-3 pb-3 text-[10px] text-gray-500">
                                            <p>Regards,</p>
                                            <p>{companyName || "Your Business"}</p>
                                        </div>

                                        <div className="border-t px-3 py-2 text-center text-[8px] text-gray-400 tracking-wide">
                                            POWERED BY Hellope
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 px-4 py-3 border-t">
                            <button
                                onClick={() => setShowLinkPopup(false)}
                                className="px-4 py-1.5 border rounded-lg text-xs font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendShare}
                                className="px-5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium"
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