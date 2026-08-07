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
            <div className="min-h-[calc(100vh-64px)] bg-[#f5f6fa] p-4 sm:p-6 lg:p-8 xl:p-5 overflow-y-auto">
                <div className="max-w-5xl xl:max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 xl:p-5">
                    <h3 className="text-xl sm:text-2xl xl:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 xl:mb-4 uppercase">
                        Payin Webhook Details
                    </h3>

                    {/* Webhook URL Box */}
                    <div className="border border-gray-200 rounded-lg p-4 xl:p-3 mb-6 xl:mb-4 bg-gray-50">
                        {/* <p className="text-xs text-gray-500 mb-2">
                Active Webhook URL
            </p> */}

                        <p className="text-sm xl:text-xs text-gray-900 break-all leading-6 xl:leading-5">
                            {webhookUrl || "No webhook URL configured"}
                        </p>
                    </div>

                    {/* Guidelines */}
                    <div className="border border-gray-200 rounded-lg p-5 xl:p-4 bg-white">
                        <h4 className="text-lg xl:text-base font-medium text-gray-800 mb-4 xl:mb-3">
                            Webhook Guidelines
                        </h4>

                        <ul className="list-disc pl-5 xl:pl-4 space-y-2 xl:space-y-1.5 text-sm xl:text-xs text-gray-700 leading-6 xl:leading-5">
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