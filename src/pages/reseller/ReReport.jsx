import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Download, FileText } from "lucide-react";

import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import DataTable from "../../components/common/DataTable";
import DateRangeFilter from "../../components/common/DateRangeFilter";
import SearchBox from "../../components/common/SearchBox";
import StatusBadge from "../../components/common/StatusBadge";
import { btnOutline } from "../../components/common/ui";
import { dash, getErrorMessage, inrFromPaise, matchesSearch, saveBlob, todayISO, toApiDate, validateRange } from "../../utils/format";

const searchKeys = ["mid", "meTrnRefNo", "paymentType", "txnDate", "respMessage"];

const COLUMNS = [
  { key: "sno", label: "S.No.", primary: true, render: (_r, i) => i + 1 },
  { key: "mid", label: "Merchant ID", primary: true },
  { key: "meTrnRefNo", label: "Transaction ID", primary: true },
  { key: "txnDate", label: "Txn date", primary: true },
  { key: "totalAmount", label: "Amount", primary: true, render: (r) => inrFromPaise(r.totalAmount) },
  { key: "respMessage", label: "Status", primary: true, render: (r) => <StatusBadge status={String(r.respMessage || "").toUpperCase() || "-"} /> },
  { key: "paymentType", label: "Transaction type" },
  { key: "reCommission", label: "RP commission" },
  { key: "msfFee", label: "Merchant charge" },
  { key: "msfGstFee", label: "GST amt" },
].map((c) => ({ ...c, render: c.render ?? ((r) => dash(r[c.key])) }));

export default function ReReport() {
  const { user } = useAuth();
  const resellerId = user?.resellerId;

  const [fromDate, setFromDate] = useState(todayISO);
  const [toDate, setToDate] = useState(todayISO);
  const [applied, setApplied] = useState({ from: todayISO(), to: todayISO() });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({ pages: 0, records: 0 });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!resellerId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/reseller/trans/${encodeURIComponent(resellerId)}`,
        { fromDate: toApiDate(applied.from), toDate: toApiDate(applied.to) },
        { params: { page, size } },
      );
      if (res?.respCode === 0) {
        setRows(Array.isArray(res.data) ? res.data : []);
        setTotals({ pages: res.totalPages || 0, records: res.totalRecords || 0 });
      } else {
        setRows([]);
        setTotals({ pages: 0, records: 0 });
        toast.error(res?.respMsg || "Unable to fetch report");
      }
    } catch (error) {
      setRows([]);
      setTotals({ pages: 0, records: 0 });
      toast.error(getErrorMessage(error, "Unable to fetch report"));
    } finally {
      setLoading(false);
    }
  }, [resellerId, applied, page, size]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = () => {
    const problem = validateRange(fromDate, toDate);
    if (problem) return toast.error(problem);
    setPage(0);
    setApplied({ from: fromDate, to: toDate });
  };

  const exportExcel = async () => {
    try {
      setExporting(true);
      const blob = await axiosInstance.post(
        `/reseller/dwnReTxnReport/${encodeURIComponent(resellerId)}`,
        { fromDate: toApiDate(applied.from), toDate: toApiDate(applied.to) },
        { responseType: "blob", timeout: 90000 },
      );
      await saveBlob(blob, `Reseller_Transaction_Report_${applied.from}_to_${applied.to}.xlsx`);
      toast.success("Report downloaded");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to export the report"));
    } finally {
      setExporting(false);
    }
  };

  const visible = useMemo(() => rows.filter((r) => matchesSearch(r, searchKeys, search)), [rows, search]);

  return (
    <>
      <PageHeader
        title="Reseller Transaction Report"
        subtitle="Payin transactions of your merchants."
        action={
          <button type="button" className={`${btnOutline} w-full sm:w-auto`} onClick={exportExcel} disabled={exporting}>
            <Download size={16} /> {exporting ? "Preparing..." : "Export Excel"}
          </button>
        }
      />

      <Panel>
        <DateRangeFilter fromDate={fromDate} toDate={toDate} onFromChange={setFromDate} onToChange={setToDate} onSubmit={submit} loading={loading} />
      </Panel>

      <Panel title={`Payin transactions (${totals.records})`} icon={FileText} action={<SearchBox value={search} onChange={setSearch} placeholder="Search this page..." />}>
        <DataTable
          columns={COLUMNS}
          rows={visible}
          loading={loading}
          emptyText="No transactions found for the selected dates."
          rowKey={(r, i) => `${r.txnId ?? r.meTrnRefNo ?? "row"}-${i}`}
          serverPagination={{
            page, size, totalRecords: totals.records, totalPages: totals.pages,
            onPage: setPage, onSize: (n) => { setSize(n); setPage(0); },
          }}
        />
      </Panel>
    </>
  );
}
