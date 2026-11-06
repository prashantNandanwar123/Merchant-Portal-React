import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CalendarRange, ExternalLink, Link2, Plus } from "lucide-react";

import axiosInstance from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import DataTable from "../../components/common/DataTable";
import DateRangeFilter from "../../components/common/DateRangeFilter";
import SearchBox from "../../components/common/SearchBox";
import StatusBadge from "../../components/common/StatusBadge";
import { btnPrimary } from "../../components/common/ui";
import CreatePaymentLinkModal from "../../components/merchant/CreatePaymentLinkModal";
import { dash, getErrorMessage, matchesSearch, money, todayISO, toApiDate, validateRange } from "../../utils/format";

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "expired", label: "Expired" },
];
const searchKeys = ["orderId", "mid", "agentName", "orderStatus", "linkStatus"];

const COLUMNS = [
  { key: "sno", label: "S.No.", primary: true, render: (_r, i) => i + 1 },
  { key: "orderId", label: "Order ID", primary: true, render: (r) => <b>{dash(r.orderId)}</b> },
  { key: "agentName", label: "Agent", primary: true },
  { key: "txnAmount", label: "Amount", primary: true, render: (r) => `₹ ${money(r.txnAmount)}` },
  { key: "orderStatus", label: "Status", primary: true, render: (r) => <StatusBadge status={r.orderStatus} /> },
  { key: "linkStatus", label: "Link status", primary: true, render: (r) => <StatusBadge status={r.linkStatus} /> },
  { key: "mid", label: "MID" },
  { key: "mode", label: "Mode" },
  { key: "creation_Date", label: "Date" },
  {
    key: "url",
    label: "Link",
    action: true,
    render: (r) =>
      /^https?:\/\//i.test(r.url || "") ? (
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:underline"
        >
          Open <ExternalLink size={13} />
        </a>
      ) : (
        "-"
      ),
  },
].map((c) => ({ ...c, render: c.render ?? ((r) => dash(r[c.key])) }));

export default function PaymentLinks() {
  const [fromDate, setFromDate] = useState(todayISO);
  const [toDate, setToDate] = useState(todayISO);
  const [applied, setApplied] = useState({ from: todayISO(), to: todayISO() });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/fetchManualOrders", {
        fromDate: toApiDate(applied.from),
        toDate: toApiDate(applied.to),
      });
      setRows(Array.isArray(res?.respData) ? res.respData : []);
      if (res?.respCode !== undefined && res.respCode !== 0) {
        toast.error(res.respMsg || "Unable to load payment links", { toastId: "links-error" });
      }
    } catch (error) {
      setRows([]);
      toast.error(getErrorMessage(error, "Unable to load payment links"), { toastId: "links-error" });
    } finally {
      setLoading(false);
    }
  }, [applied]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = () => {
    const problem = validateRange(fromDate, toDate);
    if (problem) return toast.error(problem);
    setApplied({ from: fromDate, to: toDate });
  };

  const visible = useMemo(
    () =>
      rows.filter((r) => {
        const status = String(r.linkStatus || "").toLowerCase();
        // "Expire" tab used to compare against exactly "expired" – now any "expire*" status counts.
        const tabOk = tab === "all" || (tab === "active" ? status === "active" : status.startsWith("expire"));
        return tabOk && matchesSearch(r, searchKeys, search);
      }),
    [rows, tab, search],
  );

  return (
    <>
      <PageHeader
        title="Payment Links"
        subtitle="Generate secure payment links and share them with customers instantly."
        action={
          <button type="button" className={`${btnPrimary} w-full sm:w-auto`} onClick={() => setModalOpen(true)}>
            <Plus size={18} /> New payment link
          </button>
        }
      />

      <Panel title="Filter by date" icon={CalendarRange}>
        <DateRangeFilter fromDate={fromDate} toDate={toDate} onFromChange={setFromDate} onToChange={setToDate} onSubmit={submit} loading={loading} />
      </Panel>

      <Panel
        title={`Links (${visible.length})`}
        icon={Link2}
        action={<SearchBox value={search} onChange={setSearch} placeholder="Search agent / MID / order ID..." className="sm:w-80" />}
      >
        <div role="tablist" className="mb-4 inline-flex rounded-xl bg-slate-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                tab === t.key ? "bg-white text-neutral-900 shadow-sm" : "text-slate-500 hover:text-neutral-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <DataTable
          columns={COLUMNS}
          rows={visible}
          loading={loading}
          emptyText="No payment links found"
          rowKey={(r, i) => r.id ?? `${r.orderId}-${i}`}
        />
      </Panel>

      {modalOpen && (
        <CreatePaymentLinkModal
          onClose={() => setModalOpen(false)}
          onCreated={load} // (the old close handler called an undefined setShowLinkPopup → ReferenceError)
        />
      )}
    </>
  );
}
