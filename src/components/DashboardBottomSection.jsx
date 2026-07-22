import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-hot-toast";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import {
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Clock,
    XCircle,
    ShieldCheck,
    Wallet2,
    RefreshCcw,
    ShieldAlert,
} from "lucide-react";


const statusConfig = {
    success: {
        label: "Successful",
        icon: CheckCircle2,
        text: "text-green-600",
        bg: "bg-green-50",
    },
    pending: {
        label: "Pending",
        icon: Clock,
        text: "text-yellow-600",
        bg: "bg-yellow-50",
    },
    failed: {
        label: "Failed",
        icon: XCircle,
        text: "text-red-600",
        bg: "bg-red-50",
    },
};

function StatPill({ icon: Icon, iconBg, iconColor, label, value, change, positive }) {
    return (
        <div className="flex items-start gap-3">
            <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
            >
                <Icon size={18} className={iconColor} />
            </div>
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{value}</p>
                <span
                    className={`text-xs font-semibold ${positive ? "text-green-600" : "text-red-500"
                        }`}
                >
                    {positive ? "↑" : "↓"} {change}
                </span>
            </div>
        </div>
    );
}

// Indian numbering system ke units, hamesha yahi se dynamically pick honge
// (koi if/else hardcoded threshold check nahi — magnitude se auto calculate)
const INDIAN_UNITS = [
    { value: 1e7, symbol: "Cr" },
    { value: 1e5, symbol: "L" },
    { value: 1e3, symbol: "K" },
    { value: 1, symbol: "" },
];

// Kisi bhi number ke liye uska magnitude (power of 10) nikaalta hai
const getMagnitude = (value) => {
    if (!value || value <= 0) return 1;
    return Math.pow(10, Math.floor(Math.log10(value)));
};

// "Nice" round number nikaalta hai (1, 2, 5, 10 ka multiple) - D3/Recharts jaisa standard algorithm
const getNiceNumber = (value, round) => {
    const exponent = Math.floor(Math.log10(value));
    const fraction = value / Math.pow(10, exponent);
    let niceFraction;

    if (round) {
        if (fraction < 1.5) niceFraction = 1;
        else if (fraction < 3) niceFraction = 2;
        else if (fraction < 7) niceFraction = 5;
        else niceFraction = 10;
    } else {
        if (fraction <= 1) niceFraction = 1;
        else if (fraction <= 2) niceFraction = 2;
        else if (fraction <= 5) niceFraction = 5;
        else niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
};

export default function DashboardBottomSection() {

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterDays, setFilterDays] = useState(7);

    const fetchGraphDetails = async () => {
        try {
            setLoading(true);
            const payload = getDateRange(filterDays);
            const response = await axiosInstance.post("/fetchGraphDetails",
                payload
            );
            console.log(response);
            if (response.respCode === 0) {
                const apiData = response.respData;
                const formattedData = prepareChartData(
                    apiData.labels,
                    apiData.values
                );
                setChartData(formattedData);
            }
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGraphDetails();
    }, [filterDays]);

    const totalVolume = chartData.reduce(
        (sum, item) => sum + item.volume,
        0
    );

    // Date generator function
    const getDateRange = (days) => {
        const today = new Date();
        const toDate = today.toLocaleDateString("en-GB").replaceAll("/", "/");
        const from = new Date();
        from.setDate(today.getDate() - (days - 1));
        const fromDate = from.toLocaleDateString("en-GB");
        return {
            fromDate,
            toDate,
        };
    };

    // Raw data (chahe 7 ho ya 1000+) ko hamesha max 10 points me convert karta hai
    const prepareChartData = (labels, values) => {
        const totalPoints = 10;

        // 1000 transactions > 10, isliye ye if wala part skip hoga
        if (values.length <= totalPoints) {
            return labels.map((label, index) => ({
                day: label,
                volume: values[index]
            }));
        }

        // chunkSize = Math.ceil(1000 / 10) = 100
        const chunkSize = Math.ceil(values.length / totalPoints);

        const result = [];

        // Loop 10 baar chalega (i = 0, 100, 200, ..., 900)
        for (let i = 0; i < values.length; i += chunkSize) {

            // Har baar 100 transactions ka chunk uthega
            const valueChunk = values.slice(i, i + chunkSize);

            // Un 100 transactions ka SUM (total volume) nikalega
            const totalVolume = valueChunk.reduce((sum, value) => sum + value, 0);

            result.push({
                day: labels[i],           // us chunk ka pehla label
                volume: Number(totalVolume.toFixed(2))
            });
        }

        return result;  // exactly 10 rows return honge
    };
    // Y-axis ke liye nice rounded ticks - poori tarah formula-driven, koi hardcoded range check nahi
    const getYAxisTicks = () => {

        if (!chartData.length) return [];

        const maxValue = Math.max(
            ...chartData.map(item => item.volume)
        );

        if (maxValue <= 0) {
            return [0];
        }

        const tickCount = 10;
        const niceMax = getNiceNumber(maxValue, false);
        const niceStep = getNiceNumber(niceMax / tickCount, true);

        return Array.from(
            { length: tickCount + 1 },
            (_, i) => Math.round(niceStep * i)
        );

    };

    // Value ko uske magnitude ke hisaab se dynamically sahi unit (₹ / K / L / Cr) me format karta hai
    // INDIAN_UNITS list se match karta hai, koi manual if(value >= 100000) type hardcoding nahi
    const formatCurrency = (value) => {

        if (value === 0) return "₹0";

        const unit = INDIAN_UNITS.find((u) => Math.abs(value) >= u.value);

        if (!unit || unit.symbol === "") {
            return `₹${value}`;
        }

        return `₹${(value / unit.value).toFixed(1)}${unit.symbol}`;
    };

    return (
        <div className="mt-4">
            {/* ================= TRANSACTION OVERVIEW ================= */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 my-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className="text-2xl font-semibold text-gray-900 sm:mb-5">
                        Transaction Overview
                    </h3>
                    <div className="flex items-center gap-2">
                        <select
                            value={filterDays}
                            onChange={(e) => setFilterDays(Number(e.target.value))}
                            className="h-8 px-2 rounded-lg border border-gray-200 text-xs text-gray-600 font-medium"
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={15}>Last 15 Days</option>
                            <option value={30}>Last 30 Days</option>
                        </select>
                    </div>
                </div>

                {/* Total Volume */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                </div>

                {/* Chart */}
                <div className="h-72 -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 15,
                                right: 20,
                                left: 10,
                                bottom: 10,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="volumeFill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0.25}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#3b82f6"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                stroke="#E5E7EB"
                                strokeDasharray="4 4"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#6B7280",
                                    fontSize: 12,
                                    fontWeight: 500
                                }}
                            />
                            <YAxis
                                ticks={getYAxisTicks()}
                                tickFormatter={(value) => formatCurrency(value)}
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: "#6B7280",
                                    fontSize: 12
                                }}
                            />
                            <Tooltip
                                formatter={(value) => [
                                    formatCurrency(value),
                                    "Volume"
                                ]}
                                cursor={{
                                    stroke: "#2563EB",
                                    strokeDasharray: "5 5"
                                }}
                                contentStyle={{
                                    borderRadius: "14px",
                                    border: "none",
                                    boxShadow: "0 10px 25px rgba(0,0,0,.12)",
                                    fontSize: "13px"
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="volume"
                                stroke="#2563EB"
                                strokeWidth={3}
                                fill="url(#volumeFill)"
                                dot={{
                                    r: 4,
                                    fill: "#2563EB",
                                    stroke: "#fff",
                                    strokeWidth: 2
                                }}
                                activeDot={{
                                    r: 7,
                                    fill: "#2563EB",
                                    stroke: "#fff",
                                    strokeWidth: 3
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <p className="text-center font-normal text-gray-500">
                        Days
                    </p>
                </div>
            </div>
        </div>
    );
}