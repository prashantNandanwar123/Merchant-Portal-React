import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check, Copy, Eye, EyeOff, Key, RefreshCw, TriangleAlert } from "lucide-react";

import axiosInstance from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import Loader from "../../components/common/Loader";
import { alertCls, btnOutline, inputCls, labelCls } from "../../components/common/ui";
import { getErrorMessage } from "../../utils/format";

function KeyRow({ label, value }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy"); // (copy errors used to be swallowed silently)
    }
  };

  const iconBtn = "grid size-9 shrink-0 place-items-center rounded-md text-slate-500 transition hover:bg-slate-200 hover:text-slate-900";

  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 pl-3 pr-1.5">
        <input
          type={show ? "text" : "password"}
          readOnly
          value={value || ""}
          aria-label={label}
          className={`${inputCls} h-11 min-w-0 flex-1 border-0 bg-transparent px-0 font-mono text-[13px] shadow-none focus:ring-0`}
        />
        <button type="button" className={iconBtn} onClick={() => setShow((v) => !v)} aria-label={show ? `Hide ${label}` : `Show ${label}`}>
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
        <button type="button" className={`${iconBtn} ${copied ? "text-emerald-600" : ""}`} onClick={copy} disabled={!value} aria-label={`Copy ${label}`}>
          {copied ? <Check size={17} /> : <Copy size={17} />}
        </button>
      </div>
    </div>
  );
}

export default function ApiKeys() {
  const [keys, setKeys] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosInstance.post("/fetchApiKeys");
      if (res?.respCode === 0 && Array.isArray(res.respData)) {
        setKeys({ access: res.respData[0], secret: res.respData[1] });
      } else {
        // (the old code read `response.resMsg` – a typo – so the real message was never shown)
        setError(res?.respMsg || "Unable to fetch API keys");
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to fetch API keys"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageHeader title="API Keys" subtitle="Use these credentials to integrate HelloPe with your application." />

      <Panel title="Credentials" icon={Key} className="max-w-3xl">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className={`${alertCls.danger} flex flex-wrap items-center justify-between gap-3`}>
            <span>{error}</span>
            <button type="button" className={`${btnOutline} h-9`} onClick={load}><RefreshCw size={15} /> Retry</button>
          </div>
        ) : (
          <div className="space-y-5">
            <KeyRow label="Access key" value={keys?.access} />
            <KeyRow label="Secret key" value={keys?.secret} />

            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" />
              <ul className="space-y-1">
                <li>Keep your access key confidential.</li>
                <li>Never expose the secret key in front-end code or public repositories.</li>
              </ul>
            </div>
          </div>
        )}
      </Panel>
    </>
  );
}
