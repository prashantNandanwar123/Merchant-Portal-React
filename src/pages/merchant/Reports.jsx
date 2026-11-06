import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Download, FileText } from "lucide-react";

import axiosInstance from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import DataTable from "../../components/common/DataTable";
import DateRangeFilter from "../../components/common/DateRangeFilter";
import SearchBox from "../../components/common/SearchBox";
import StatusBadge from "../../components/common/StatusBadge";
import { btnOutline, inputCls } from "../../components/common/ui";
import {
  dash, getErrorMessage, inrFromPaise, saveBlob, todayISO, toApiDate, validateRange,
} from "../../utils/format";

// The report API returns each row as an array – these are the positions.
const COLUMNS = [
  { key: "sno", label: "S.No.", primary: true, render: (_r, i) => i + 1 },
  { key: "txnRef", label: "Transaction Ref No.", primary: true, render: (r) => dash(r[0]) },
  { key: "date", label: "Date & Time", primary: true, render: (r) => dash(r[2]) },
  { key: "amount", label: "Txn Amount", primary: true, render: (r) => inrFromPaise(r[4]) },
  { key: "status", label: "Status", primary: true, render: (r) => <StatusBadge status={r[5]} /> },
  { key: "total", label: "Total Txn Amount", primary: true, render: (r) => <b className="text-emerald-700">{inrFromPaise(r[14])}</b> },
  { key: "order", label: "Order No.", render: (r) => dash(r[1]) },
  { key: "type", label: "Payment Type", render: (r) => dash(r[3]) },
  { key: "msf", label: "MSF Fee", render: (r) => r[10] ?? 0 },
  { key: "msfGst", label: "MSF GST Fee", render: (r) => r[11] ?? 0 },
  { key: "conv", label: "Conv Fee", render: (r) => r[12] ?? 0 },
  { key: "convGst", label: "Conv GST Fee", render: (r) => r[13] ?? 0 },
  { key: "name", label: "Customer Name", render: (r) => dash(r[6]) },
  { key: "mobile", label: "Mobile No.", render: (r) => dash(r[7]) },
  { key: "email", label: "Email", render: (r) => dash(r[8]) },
  { key: "utr", label: "UTR No.", render: (r) => dash(r[9]) },
];

export default function Reports() {
  // Inputs being edited vs. the range that was actually searched. Paging always uses the
  // searched range (before, changing a date then clicking "Next" used the half-edited dates).
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
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      // Bug fix: Search used to call fetchReport() with a stale `page` AND set page 0,
      // so it could fire twice / request the wrong page.
      const res = await axiosInstance.post(
        "/meTxnReport",
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
  }, [applied, page, size]);

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
    const problem = validateRange(applied.from, applied.to);
    if (problem) return toast.error(problem);

    try {
      setExporting(true);
      const blob = await axiosInstance.post(
        "/dwnMeTxnReport",
        { fromDate: toApiDate(applied.from), toDate: toApiDate(applied.to) },
        { responseType: "blob", timeout: 90000 },
      );
      // A JSON error body is no longer saved as a broken .xlsx
      await saveBlob(blob, `Merchant_Transaction_Report_${applied.from}_to_${applied.to}.xlsx`);
      toast.success("Report downloaded");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to export the report"));
    } finally {
      setExporting(false);
    }
  };

  // Search / status only filter the rows of the current page (the API pages on the server).
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (row) =>
        (!status || row[5] === status) &&
        (!q || row.some((cell) => String(cell ?? "").toLowerCase().includes(q))),
    );
  }, [rows, search, status]);

  return (
    <>
      <PageHeader
        title="Transaction Report"
        subtitle="View and analyse your transactions in detail."
        action={
          <button type="button" className={`${btnOutline} w-full sm:w-auto`} onClick={exportExcel} disabled={exporting}>
            <Download size={16} /> {exporting ? "Preparing..." : "Export Excel"}
          </button>
        }
      />

      <Panel>
        <DateRangeFilter fromDate={fromDate} toDate={toDate} onFromChange={setFromDate} onToChange={setToDate} onSubmit={submit} loading={loading} />
      </Panel>

      <Panel
        title={`Transactions (${totals.records})`}
        icon={FileText}
        action={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <SearchBox value={search} onChange={setSearch} placeholder="Search this page..." />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Status filter"
              className={`${inputCls} h-10 sm:w-40`}
            >
              <option value="">All status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        }
      >
        <DataTable
          columns={COLUMNS}
          rows={visible}
          loading={loading}
          emptyText="No transactions found. Try adjusting your filters or date range."
          rowKey={(r, i) => `${r[0]}-${i}`}
          serverPagination={{
            page,
            size,
            totalRecords: totals.records,
            totalPages: totals.pages,
            onPage: setPage,
            onSize: (n) => { setSize(n); setPage(0); },
          }}
        />
      </Panel>
    </>
  );
}
