import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

export default function IpWhitelist() {
    const [ip, setIp] = useState("");
    const [ipList, setIpList] = useState([]);
    const [showIpList, setShowIpList] = useState(false);

    useEffect(() => {
        fetchWhitelistIp();
    }, []);

    const fetchWhitelistIp = async () => {
        try {
            const response = await axiosInstance.post("/fetchWhitelistIp");

            if (response.respCode === 0) {
                setIpList([response.respData]);
            } else {
                setIpList([]);
            }
        } catch (error) {
            toast.error(error);
            console.error(error);
        }
    };

    const handleAddIp = async () => {
        if (!ip.trim()) {
            toast.error("Please enter IP Address");
            return;
        }

        try {
            const response = await axiosInstance.post(`/addIPWhitelist?ip=${ip}`);
            if (response.respCode === 0) {
                toast.success(response.respMsg);
                setShowIpList(true);
                setIp("");
                fetchWhitelistIp();
            } else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    const handleDeleteIp = async () => {
        try {
            const response = await axiosInstance.post("/deleteWhitelistIp");
            if (response.respCode === 0) {
                toast.success(response.respMsg);
                setIpList([]);
            } else {
                toast.error(response.respMsg);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="p-8 bg-[#f5f6fa] min-h-screen">
            <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="text-lg font-semibold mb-5 uppercase">
                    IP Whitelisting
                </h3>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={ip}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, "");
                            setIp(value);
                        }}
                        placeholder="Enter IP address (e.g. 192.168.1.1)"
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none"
                    />
                    <button
                        onClick={handleAddIp}
                        className="px-5 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                    >
                        Add IP
                    </button>
                </div>

                {showIpList && (
                    <div className="mt-5 space-y-3">
                        {ipList.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between border border-gray-200 rounded-md px-4 py-3"
                            >
                                <span>{item}</span>
                                <button
                                    onClick={handleDeleteIp}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}