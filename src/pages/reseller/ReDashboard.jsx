import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CalendarRange, CheckCircle2, Clock3, Receipt, XCircle } from "lucide-react";

import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import DateRangeFilter from "../../components/common/DateRangeFilter";
import { alertCls } from "../../components/common/ui";
import { getErrorMessage, money, todayISO, toApiDate, validateRange } from "../../utils/format";

const TONES = {
  green: "bg-emerald-500", yellow: "bg-brand", red: "bg-red-500", slate: "bg-slate-500",
};
const CHIPS = {
  green: "bg-emerald-100 text-emerald-700", yellow: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700", slate: "bg-slate-100 text-slate-700",
};

export default function ReDashboard() {
  const { user } = useAuth();
  const resellerId = user?.resellerId;

  const [fromDate, setFromDate] = useState(todayISO);
  const [toDate, setToDate] = useState(todayISO);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    async (from, to) => {
      if (!resellerId) return;
      try {
        setLoading(true);
        setError("");
        const res = await axiosInstance.post(`/reseller/Dashboard/${encodeURIComponent(resellerId)}`, {
          fromDate: toApiDate(from),
          toDate: toApiDate(to),
        });
        if (res?.respCode === 0 && res.respData) setData(res.respData);
        else {
          // (a null respData used to crash the percentage helper)
          setData({});
          setError(res?.respMsg || "Unable to load dashboard");
        }
      } catch (err) {
        setData({});
        setError(getErrorMessage(err, "Unable to load dashboard"));
      } finally {
        setLoading(false);
      }
    },
    [resellerId],
  );

  useEffect(() => {
    const today = todayISO();
    load(today, today);
  }, [load]);

  const search = () => {
    const problem = validateRange(fromDate, toDate);
    if (problem) return toast.error(problem);
    load(fromDate, toDate);
  };

  const total = Number(data.total_count) || 0;
  const share = (count) => (total ? `${(((Number(count) || 0) / total) * 100).toFixed(1)}%` : "0%");

  const cards = [
    { key: "success", label: "Successful", icon: CheckCircle2, tone: "green" },
    { key: "pending", label: "Pending", icon: Clock3, tone: "yellow" },
    { key: "failed", label: "Failed", icon: XCircle, tone: "red" },
    { key: "total", label: "Total", icon: Receipt, tone: "slate" },
  ];

  return (
    <>
      <PageHeader title="Reseller Dashboard" subtitle="Overview of your merchants' payin transactions and commission." />

      <Panel title="Filter by date" icon={CalendarRange}>
        <DateRangeFilter fromDate={fromDate} toDate={toDate} onFromChange={setFromDate} onToChange={setToDate} onSubmit={search} loading={loading} />
      </Panel>

      {error && (
        <div className={`${alertCls.danger} mb-5 flex flex-wrap items-center justify-between gap-3`}>
          <span>{error}</span>
          <button type="button" className="font-semibold underline" onClick={search}>Retry</button>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-4 transition-opacity min-[560px]:grid-cols-2 xl:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
        {cards.map(({ key, label, icon: Icon, tone }) => (
          <article key={key} className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className={`absolute inset-x-0 top-0 h-1 ${TONES[tone]}`} />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                <strong className="mt-2 block text-2xl font-bold text-slate-900">{data[`${key}_count`] ?? 0}</strong>
                <p className="text-xs text-slate-400">transactions · {share(data[`${key}_count`])}</p>
              </div>
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${CHIPS[tone]}`}><Icon size={21} /></span>
            </div>
            <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Amount</dt>
                <dd className="font-semibold text-slate-800">₹ {money(data[`${key}_amount`])}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Commission</dt>
                <dd className="font-semibold text-emerald-700">₹ {money(data[`${key}_recommission`])}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
