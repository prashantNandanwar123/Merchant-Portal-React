import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

export default function Webhooks() {
    const [webhooks, setWebhooks] = useState([]);

    useEffect(() => {
        fetchWebhookDetails();
    }, []);

    const fetchWebhookDetails = async () => {
        try {
            const response = await axiosInstance.post("/fetchWebhookDetails");
            if (response.respCode === 0) {
                setWebhooks(response.respData || []);
            } else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            toast.error("Unable to fetch webhook details");
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f5f6fa] p-4 sm:p-6 lg:p-8 xl:p-5 overflow-y-auto">
            <div className="max-w-5xl xl:max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 xl:p-5">
                <h3 className="text-xl sm:text-2xl xl:text-xl font-semibold text-gray-800 mb-5">
                    Webhook Details
                </h3>

                {/* Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            {/* Table Header */}
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-4 font-semibold text-gray-700 w-20">No.</th>
                                    <th className="px-5 py-4 font-semibold text-gray-700">Webhook Type</th>
                                    <th className="px-5 py-4 font-semibold text-gray-700">Webhook URL</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {webhooks.length > 0 ? ( //ternary operator
                                    webhooks.map((webhook, index) => {
                                        const webhookUrl = webhook[0];
                                        const webhookType = webhook[1];
                                        return (
                                            <tr key={index}
                                                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition">
                                                <td className="px-5 py-4 text-gray-500">
                                                    {index + 1}
                                                </td>
                                                {/* Type */}
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                                            ${webhookType === "PAYIN"
                                                                ? "gray-500"
                                                                : webhookType === "ONRAMP"
                                                                    ? "gray-500"
                                                                    : webhookType === "OFFRAMP"
                                                                        ? "gray-500"
                                                                        : "gray-500"
                                                            }`}
                                                    >
                                                        {webhookType}
                                                    </span>
                                                </td>

                                                {/* URL */}
                                                <td className="px-5 py-4">
                                                    <p className="text-gray-700 break-all">
                                                        {webhookUrl || "No webhook URL configured"}
                                                    </p>
                                                </td>
                                            </tr>
                                        );
                                    })

                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-5 py-8 text-center text-gray-500">
                                            No webhook details found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Guidelines */}
                <div className="border border-gray-200 rounded-xl p-5 mt-6 bg-white">
                    <h4 className="text-lg xl:text-base font-medium text-gray-800 mb-4">
                        Webhook Guidelines
                    </h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm xl:text-xs text-gray-700">
                        <li>Use HTTPS callback URLs.</li>
                        <li>Validate webhook requests.</li>
                        <li>Return HTTP 200 after processing.</li>
                        <li>Maintain webhook logs for auditing.</li>
                        <li>Avoid exposing internal endpoints.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}