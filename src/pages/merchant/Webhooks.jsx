import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Webhook } from "lucide-react";

import axiosInstance from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import DataTable from "../../components/common/DataTable";
import { getErrorMessage } from "../../utils/format";

const TYPE_STYLES = {
  PAYIN: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  ONRAMP: "bg-sky-50 text-sky-700 ring-sky-600/20",
  OFFRAMP: "bg-violet-50 text-violet-700 ring-violet-600/20",
};

// (The old badge classes were the literal text "gray-500", i.e. no styling at all.)
const COLUMNS = [
  { key: "sno", label: "No.", primary: true, render: (_r, i) => i + 1 },
  {
    key: "type",
    label: "Webhook type",
    primary: true,
    render: (r) => (
      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${TYPE_STYLES[r.type] || "bg-slate-100 text-slate-600 ring-slate-500/20"}`}>
        {r.type || "-"}
      </span>
    ),
  },
  {
    key: "url",
    label: "Webhook URL",
    primary: true,
    render: (r) => <span className="inline-block max-w-[60ch] whitespace-normal break-all">{r.url || "No webhook URL configured"}</span>,
  },
];

const guidelines = [
  "Use HTTPS callback URLs.",
  "Validate every webhook request (signature / source IP).",
  "Return HTTP 200 after processing.",
  "Keep webhook logs for auditing.",
  "Never expose internal endpoints.",
];

export default function Webhooks() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/fetchWebhookDetails");
      if (res?.respCode === 0) {
        // API rows are [url, type]
        setRows((res.respData || []).map(([url, type], i) => ({ id: i, url, type })));
      } else {
        setRows([]);
        toast.error(res?.respMsg || "Unable to fetch webhook details");
      }
    } catch (error) {
      setRows([]);
      toast.error(getErrorMessage(error, "Unable to fetch webhook details"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageHeader title="Webhooks" subtitle="Callback URLs configured for your account." />

      <Panel title="Webhook details" icon={Webhook}>
        <DataTable columns={COLUMNS} rows={rows} loading={loading} emptyText="No webhook details found" />
      </Panel>

      <Panel title="Webhook guidelines">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          {guidelines.map((g) => <li key={g}>{g}</li>)}
        </ul>
      </Panel>
    </>
  );
}
