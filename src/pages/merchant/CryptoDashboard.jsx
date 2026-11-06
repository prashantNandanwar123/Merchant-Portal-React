import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArrowDownToLine, CalendarRange, Check, Clock3, TrendingUp } from "lucide-react";

import axiosInstance from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import StatCard from "../../components/common/StatCard";
import DateRangeFilter from "../../components/common/DateRangeFilter";
import { getErrorMessage, money, todayISO, toApiDate, validateRange } from "../../utils/format";

const TABS = [
  { key: "ONRAMP", label: "OnRamp", url: "/meOnRampDashboard", heading: "OnRamp transactions", help: "Monitor fiat to crypto transactions", noun: "Orders", icons: [Check, Clock3, TrendingUp] },
  { key: "OFFRAMP", label: "OffRamp", url: "/meOffRampDashboard", heading: "OffRamp transactions", help: "Monitor crypto to fiat transactions", noun: "Payout", icons: [Check, Clock3, ArrowDownToLine] },
];

const rupee = (v) => `₹${money(v)}`;

export default function CryptoDashboard() {
  const [tab, setTab] = useState("ONRAMP");
  const [fromDate, setFromDate] = useState(todayISO);
  const [toDate, setToDate] = useState(todayISO);
  const [applied, setApplied] = useState({ from: todayISO(), to: todayISO() });
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const current = TABS.find((t) => t.key === tab);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(current.url, {
        fromDate: toApiDate(applied.from),
        toDate: toApiDate(applied.to),
      });
      setData(res?.respCode === 0 ? res.respData || {} : {});
      if (res?.respCode !== 0) toast.error(res?.respMsg || "Unable to load dashboard", { toastId: "crypto-dash" });
    } catch (error) {
      setData({});
      toast.error(getErrorMessage(error, "Unable to load dashboard"), { toastId: "crypto-dash" });
    } finally {
      setLoading(false);
    }
  }, [current, applied]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = () => {
    const problem = validateRange(fromDate, toDate);
    if (problem) return toast.error(problem);
    setApplied({ from: fromDate, to: toDate });
  };

  const [Ok, Wait, Total] = current.icons;
  // (The pending card used to be red on OnRamp and "failed" red on OffRamp.)
  const cards = [
    { label: `Success ${current.noun}`, count: data.success_count, amount: data.success_amount, icon: Ok, tone: "green" },
    { label: `Pending ${current.noun}`, count: data.pending_count, amount: data.pending_amount, icon: Wait, tone: "yellow" },
    { label: `Total ${current.noun}`, count: data.total_count, amount: data.total_amount, icon: Total, tone: "slate" },
  ];

  return (
    <>
      <PageHeader title="Crypto Order Dashboard" subtitle="Real-time overview of your crypto transactions and performance." />

      <Panel title="Filter by date" icon={CalendarRange}>
        <DateRangeFilter fromDate={fromDate} toDate={toDate} onFromChange={setFromDate} onToChange={setToDate} onSubmit={submit} loading={loading} />
      </Panel>

      <div role="tablist" className="mb-5 inline-flex rounded-xl bg-slate-200/70 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              tab === t.key ? "bg-white text-neutral-900 shadow-sm" : "text-slate-500 hover:text-neutral-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">{current.heading}</h2>
        <p className="text-sm text-slate-500">{current.help}</p>
      </div>

      {/* (was a fixed 3-column grid – cramped on phones) */}
      <div className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
        {cards.map((c) => (
          <StatCard key={c.label} label={c.label} value={c.count ?? 0} icon={c.icon} tone={c.tone} hint={`Transaction amount: ${rupee(c.amount)}`} />
        ))}
      </div>
    </>
  );
}
