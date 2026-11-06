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
import { btnOutline } from "../../components/common/ui";
import { dash, getErrorMessage, todayISO, toApiDate, validateRange } from "../../utils/format";

const col = (key, label, primary = false) => ({ key, label, primary });

const REPORTS = {
  ONRAMP: {
    label: "OnRamp",
    url: "/meOnRampTxnReport",
    columns: [
      col("merchantOrderId", "Merchant Order ID", true), col("orderId", "Order ID", true),
      col("buyTokenSymbol", "Buy Token Symbol"), col("chainId", "Chain ID"),
      col("fiatAmount", "Fiat Amount", true), col("transactionFee", "Transaction Fee"), col("tdsFee", "TDS Fee"),
      col("fiatCurrency", "Currency"), col("paymentMode", "Payment Mode"), col("receiverAddress", "Receiver Address"),
      col("utr", "UTR"), col("createdAt", "Created At", true), col("responseAt", "Response At"), col("status", "Status", true),
    ],
  },
  OFFRAMP: {
    label: "OffRamp",
    url: "/meOffRampTxnReport",
    columns: [
      col("merchantOrderId", "Merchant Order ID", true), col("orderId", "Order ID", true),
      col("sellTokenSymbol", "Sell Token Symbol"), col("sellTokenAddress", "Sell Token Address"),
      col("sellTokenAmount", "Sell Token Amount"), col("transactionFee", "Transaction Fee"), col("tdsFee", "TDS Fee"),
      col("senderWalletAddress", "Sender Wallet Address"), col("chainId", "Chain ID"),
      col("fiatAmount", "Fiat Amount", true), col("fiatCurrency", "Currency"), col("paymentMode", "Payment Mode"),
      col("bankAccountNumber", "Account Number"), col("bankIfsc", "IFSC"),
      col("createdAt", "Created At", true), col("responseAt", "Response At"), col("status", "Status", true), col("utr", "UTR"),
    ],
  },
};

export default function CryptoReports() {
  const [tab, setTab] = useState("ONRAMP");
  const [fromDate, setFromDate] = useState(todayISO);
  const [toDate, setToDate] = useState(todayISO);
  const [applied, setApplied] = useState({ from: todayISO(), to: todayISO() });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({ pages: 0, records: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const report = REPORTS[tab];

  const load = useCallback(async () => {
    try {
      setLoading(true);
      // Bug fix: the URL was built as `?page = 0& size=10` (spaces inside the query string),
      // so the backend never received valid page / size parameters. `params` encodes it properly.
      const res = await axiosInstance.post(
        report.url,
        { fromDate: toApiDate(applied.from), toDate: toApiDate(applied.to) },
        { params: { page, size } },
      );

      if (res?.respCode === 0) {
        setRows(Array.isArray(res.data) ? res.data : []);
        setTotals({ pages: res.totalPages || 0, records: res.totalRecords || 0 });
      } else {
        setRows([]);
        setTotals({ pages: 0, records: 0 });
        toast.error(res?.respMsg || "Unable to fetch report", { toastId: "crypto-report" });
      }
    } catch (error) {
      setRows([]);
      setTotals({ pages: 0, records: 0 });
      toast.error(getErrorMessage(error, "Unable to fetch report"), { toastId: "crypto-report" });
    } finally {
      setLoading(false);
    }
  }, [report, applied, page, size]);

  useEffect(() => {
    load();
  }, [load]);

  const switchTab = (key) => {
    if (key === tab) return;
    setTab(key);
    setPage(0);
    setRows([]);
    setSearch("");
  };

  const submit = () => {
    const problem = validateRange(fromDate, toDate);
    if (problem) return toast.error(problem); // (was a blocking alert())
    setPage(0);
    setApplied({ from: fromDate, to: toDate });
  };

  const columns = useMemo(
    () => [
      { key: "sno", label: "S.No.", primary: true, render: (_r, i) => i + 1 }, // continues across pages
      ...report.columns.map((c) => ({
        ...c,
        render: c.key === "status" ? (r) => <StatusBadge status={r.status} /> : (r) => dash(r[c.key]),
      })),
    ],
    [report],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [rows, search]);

  const exportExcel = async () => {
    if (!visible.length) return toast.warning("No data available for export");
    try {
      // Loaded on demand so the spreadsheet library isn't part of the first page load.
      const XLSX = await import("xlsx");
      const data = visible.map((item, i) => {
        const row = { "S.No.": totals.records ? page * size + i + 1 : i + 1 };
        report.columns.forEach((c) => { row[c.label] = item[c.key] ?? ""; });
        return row;
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, report.label);
      XLSX.writeFile(wb, `${report.label}_Crypto_Transaction_Report_${applied.from}_to_${applied.to}.xlsx`);
    } catch {
      toast.error("Unable to export the report");
    }
  };

  return (
    <>
      <PageHeader
        title="Crypto Transaction Report"
        subtitle="Monitor crypto transaction records, status and payment details."
        action={
          <button type="button" className={`${btnOutline} w-full sm:w-auto`} onClick={exportExcel} disabled={!visible.length}>
            <Download size={16} /> Export this page
          </button>
        }
      />

      <div role="tablist" className="mb-5 inline-flex rounded-xl bg-slate-200/70 p-1">
        {Object.entries(REPORTS).map(([key, r]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => switchTab(key)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${
              tab === key ? "bg-white text-neutral-900 shadow-sm" : "text-slate-500 hover:text-neutral-900"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <Panel>
        <DateRangeFilter fromDate={fromDate} toDate={toDate} onFromChange={setFromDate} onToChange={setToDate} onSubmit={submit} loading={loading} />
      </Panel>

      <Panel
        title={`${report.label} transactions (${totals.records})`}
        icon={FileText}
        action={<SearchBox value={search} onChange={setSearch} placeholder="Search this page..." />}
      >
        <DataTable
          columns={columns}
          rows={visible}
          loading={loading}
          emptyText="No crypto transactions found for this period."
          rowKey={(r, i) => `${r.orderId ?? r.merchantOrderId ?? "row"}-${i}`}
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
