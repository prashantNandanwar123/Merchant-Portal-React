import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CalendarRange, CheckCircle2, Clock3, Receipt, XCircle } from "lucide-react";

import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import StatCard from "../../components/common/StatCard";
import DateRangeFilter from "../../components/common/DateRangeFilter";
import { alertCls } from "../../components/common/ui";
import DashboardChart from "../../components/merchant/DashboardChart";
import { daysAgoISO, getErrorMessage, inrFromPaise, todayISO, toApiDate, validateRange } from "../../utils/format";

const EMPTY = {};

export default function Dashboard() {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState(todayISO);
  const [toDate, setToDate] = useState(todayISO);
  const [quick, setQuick] = useState("");
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (from, to) => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.post("/mrchntDashboard", {
        fromDate: toApiDate(from),
        toDate: toApiDate(to),
      });
      if (res?.respCode === 0 && res.respData) {
        setData(res.respData);
      } else {
        setData(EMPTY);
        setError(res?.respMsg || "Unable to load dashboard data.");
      }
    } catch (err) {
      setData(EMPTY);
      setError(getErrorMessage(err, "Unable to load dashboard data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const today = todayISO();
    load(today, today);
  }, [load]);

  const search = () => {
    const problem = validateRange(fromDate, toDate);
    if (problem) return toast.error(problem);
    load(fromDate, toDate);
  };

  // Quick filter applies immediately.
  const applyQuick = (value) => {
    setQuick(value);
    if (!value) return;
    const from = daysAgoISO(value);
    const to = todayISO();
    setFromDate(from);
    setToDate(to);
    load(from, to);
  };

  // (Fake "↑ 11.8% vs last 7 days" trend lines that were hard-coded in the old cards are gone –
  //  they showed made-up numbers to merchants.)
  const cards = [
    { label: "Successful", value: data.success_count ?? 0, hint: `Amount: ${inrFromPaise(data.success_amount)}`, icon: CheckCircle2, tone: "green" },
    { label: "Pending", value: data.pending_count ?? 0, hint: `Amount: ${inrFromPaise(data.pending_amount)}`, icon: Clock3, tone: "yellow" },
    { label: "Failed", value: data.failed_count ?? 0, hint: `Amount: ${inrFromPaise(data.failed_amount)}`, icon: XCircle, tone: "red" },
    { label: "Total transactions", value: data.total_count ?? 0, hint: `Amount: ${inrFromPaise(data.total_amount)}`, icon: Receipt, tone: "slate" },
  ];

  const name = user?.merchant_Name || "there";

  return (
    <>
      <PageHeader title={`Welcome back, ${name}`} subtitle="Your real-time overview of transactions and performance." />

      <Panel title="Filter by date" icon={CalendarRange}>
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromChange={(v) => { setFromDate(v); setQuick(""); }}
          onToChange={(v) => { setToDate(v); setQuick(""); }}
          onSubmit={search}
          loading={loading}
        >
          <select
            value={quick}
            onChange={(e) => applyQuick(e.target.value)}
            aria-label="Quick filter"
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-neutral-900 focus:ring-4 focus:ring-brand/30"
          >
            <option value="">Quick filter</option>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="21">Last 21 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </DateRangeFilter>
      </Panel>

      {error && (
        <div className={`${alertCls.danger} mb-5 flex flex-wrap items-center justify-between gap-3`}>
          <span>{error}</span>
          <button type="button" className="font-semibold underline" onClick={search}>Retry</button>
        </div>
      )}

      <div className={`mb-5 grid grid-cols-1 gap-3 transition-opacity min-[460px]:grid-cols-2 sm:gap-5 xl:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
        {cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      <DashboardChart />
    </>
  );
}
