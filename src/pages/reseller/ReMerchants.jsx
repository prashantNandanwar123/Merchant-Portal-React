import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CalendarRange, Store } from "lucide-react";

import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import DataTable from "../../components/common/DataTable";
import DateRangeFilter from "../../components/common/DateRangeFilter";
import SearchBox from "../../components/common/SearchBox";
import StatusBadge from "../../components/common/StatusBadge";
import { inputCls } from "../../components/common/ui";
import { dash, getErrorMessage, todayISO, toApiDate, validateRange } from "../../utils/format";

// API rows are arrays: [merchantId, merchantName, companyName, status]
const COLUMNS = [
  { key: "sno", label: "S.No.", primary: true, render: (_r, i) => i + 1 },
  { key: "id", label: "Merchant ID", primary: true, render: (r) => <b>{dash(r[0])}</b> },
  { key: "name", label: "Merchant name", primary: true, render: (r) => dash(r[1]) },
  { key: "company", label: "Company name", primary: true, render: (r) => dash(r[2]) },
  { key: "status", label: "Status", primary: true, render: (r) => <StatusBadge status={r[3]} /> },
];

export default function ReMerchants() {
  const { user } = useAuth();
  const resellerId = user?.resellerId;

  // (The default dates used to be hard-coded to "2026-08-08".)
  const [fromDate, setFromDate] = useState(todayISO);
  const [toDate, setToDate] = useState(todayISO);
  const [applied, setApplied] = useState({ from: todayISO(), to: todayISO() });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    if (!resellerId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/reseller/merchant/${encodeURIComponent(resellerId)}`, {
        fromDate: toApiDate(applied.from),
        toDate: toApiDate(applied.to),
      });
      if (res?.respCode === 0) setRows(Array.isArray(res.respData) ? res.respData : []);
      else {
        setRows([]);
        toast.error(res?.respMsg || "Unable to fetch merchants");
      }
    } catch (error) {
      setRows([]);
      toast.error(getErrorMessage(error, "Unable to fetch merchants"));
    } finally {
      setLoading(false);
    }
  }, [resellerId, applied]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = () => {
    const problem = validateRange(fromDate, toDate);
    if (problem) return toast.error(problem);
    setApplied({ from: fromDate, to: toDate });
  };

  // Status options come from the data, so they always match the real values.
  const statuses = useMemo(() => [...new Set(rows.map((r) => r[3]).filter(Boolean))], [rows]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!status || r[3] === status) &&
        (!q || [r[0], r[1], r[2]].some((v) => String(v ?? "").toLowerCase().includes(q))),
    );
  }, [rows, search, status]);

  return (
    <>
      <PageHeader title="Merchants" subtitle="Merchants onboarded under your reseller account." />

      <Panel title="Filter by onboarding date" icon={CalendarRange}>
        <DateRangeFilter fromDate={fromDate} toDate={toDate} onFromChange={setFromDate} onToChange={setToDate} onSubmit={submit} loading={loading} />
      </Panel>

      <Panel
        title={`Merchants (${visible.length})`}
        icon={Store}
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <SearchBox value={search} onChange={setSearch} placeholder="Search merchant..." />
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status filter" className={`${inputCls} h-10 sm:w-40`}>
              <option value="">All status</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        }
      >
        <DataTable columns={COLUMNS} rows={visible} loading={loading} emptyText="No merchants found" rowKey={(r, i) => `${r[0]}-${i}`} />
      </Panel>
    </>
  );
}
