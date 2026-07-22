import { useState, useEffect } from "react"
import axiosInstance from "../api/axios"
import { toast } from "react-toastify"

export default function Webhooks() {
    const [webhookUrl, setWebhookUrl] = useState("");
    useEffect(() => {
        fetchWebhookDetails();
    }, []);
    const fetchWebhookDetails = async () => {
        try {
            const response = await axiosInstance.post("/fetchWebhookDetails");
            if (response.respCode === 0) {
                setWebhookUrl(response.respData);
            } else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            toast.error(error);
        }
    }
    return (
        <>
            <div className="min-h-screen bg-[#f5f6fa]  p-6">
                <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 uppercase">
                        Payin Webhook Details
                    </h3>
                    {/* Webhook URL Box */}
                    <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
                        {/* <p className="text-xs text-gray-500 mb-2">
                            Active Webhook URL
                        </p> */}

                        <p className="text-sm text-gray-900 break-all">
                            {webhookUrl || "No webhook URL configured"}
                        </p>
                    </div>

                    {/* Guidelines */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-white">
                        <h4 className="text-lg font-medium text-gray-800 mb-4">
                            Webhook Guidelines
                        </h4>

                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                            <li>Use HTTPS callback URLs.</li>
                            <li>Validate webhook requests.</li>
                            <li>Return HTTP 200 after processing.</li>
                            <li>Maintain webhook logs for auditing.</li>
                            <li>Avoid exposing internal endpoints.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}