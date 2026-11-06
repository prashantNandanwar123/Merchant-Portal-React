import { useCallback, useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LineChart } from "lucide-react";

import axiosInstance from "../../api/axios";
import Panel from "../common/Panel";
import Loader from "../common/Loader";
import { toast } from "react-toastify";
import { daysAgoISO, getErrorMessage, todayISO, toApiDate } from "../../utils/format";

const MAX_POINTS = 10;
const compact = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });
const rupee = (v) => `₹${compact.format(Number(v) || 0)}`;

// Squeezes any number of points into at most MAX_POINTS by summing equal chunks.
const prepare = (labels = [], values = []) => {
  if (values.length <= MAX_POINTS) {
    return labels.map((day, i) => ({ day, volume: Number(values[i]) || 0 }));
  }
  const chunk = Math.ceil(values.length / MAX_POINTS);
  const out = [];
  for (let i = 0; i < values.length; i += chunk) {
    const sum = values.slice(i, i + chunk).reduce((t, v) => t + (Number(v) || 0), 0);
    out.push({ day: labels[i], volume: Number(sum.toFixed(2)) });
  }
  return out;
};

export default function DashboardChart() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (period) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/fetchGraphDetails", {
        fromDate: toApiDate(daysAgoISO(period - 1)),
        toDate: toApiDate(todayISO()),
      });
      if (res?.respCode === 0 && res.respData) {
        setData(prepare(res.respData.labels, res.respData.values));
      } else {
        setData([]);
        toast.error(res?.respMsg || "Unable to load chart data", { toastId: "chart-error" });
      }
    } catch (error) {
      setData([]);
      // (this file used react-hot-toast, which had no <Toaster/> mounted – errors were never shown)
      toast.error(getErrorMessage(error, "Unable to load chart data"), { toastId: "chart-error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  return (
    <Panel
      title="Transaction Overview"
      icon={LineChart}
      action={
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          aria-label="Chart period"
          className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-neutral-900 focus:ring-4 focus:ring-brand/30"
        >
          <option value={7}>Last 7 days</option>
          <option value={15}>Last 15 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      }
    >
      {loading ? (
        <Loader />
      ) : data.length === 0 ? (
        <p className="py-16 text-center text-slate-500">No transaction volume for this period.</p>
      ) : (
        <div className="h-64 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fec931" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#fec931" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} minTickGap={16} />
              <YAxis tickFormatter={rupee} axisLine={false} tickLine={false} width={56} tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip
                formatter={(v) => [rupee(v), "Volume"]}
                cursor={{ stroke: "#fec931", strokeDasharray: "5 5" }}
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,.12)", fontSize: 13 }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#e5b500"
                strokeWidth={2.5}
                fill="url(#volumeFill)"
                dot={{ r: 3, fill: "#17252a", stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#17252a", stroke: "#fff", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}
