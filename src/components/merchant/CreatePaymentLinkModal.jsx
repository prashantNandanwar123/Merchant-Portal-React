import { useRef, useState } from "react";
import { Check, Copy, Link2, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";

import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Modal, { ModalBody, ModalFooter } from "../common/Modal";
import Field from "../common/Field";
import StatusBadge from "../common/StatusBadge";
import { btnAccent, btnPrimary, btnSecondary, inputCls } from "../common/ui";
import { getErrorMessage, randomDigits } from "../../utils/format";

const shareOnWhatsApp = (link, agentName) => {
  const who = agentName ? ` ${agentName}` : "";
  const text = `Hello${who}, please complete your payment using this link: ${link}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
};

export default function CreatePaymentLinkModal({ onClose, onCreated }) {
  const { user } = useAuth();

  const [orderId] = useState(() => `ORD${Date.now()}${randomDigits(3)}`);
  const [agentName, setAgentName] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // API respData once created
  const [copied, setCopied] = useState(false);
  const lock = useRef(false);

  // action: "generate" | "share"
  const generate = async (action) => {
    if (lock.current) return;

    const agent = agentName.trim();
    // (An empty agent name used to silently become the hard-coded name "Rohit".)
    if (!agent) return toast.error("Please enter the agent name");

    lock.current = true;
    setBusy(true);

    try {
      // (createdBy / createdByUserId used to be hard-coded to "Rohit Sharma" / "HELLOPE10001"
      //  for every merchant. They now come from the logged-in user.)
      const res = await axiosInstance.post("/createManualOrder", {
        orderId,
        mode: "PAYIN",
        agentName: agent,
        createdBy: user?.merchant_Name || "",
        createdByUserId: user?.userId || "",
      });

      if (res?.respCode !== undefined && res.respCode !== 0) {
        toast.error(res.respMsg || "Unable to create payment link");
        return;
      }

      const data = { ...(res?.respData || {}), agentName: res?.respData?.agentName || agent };
      toast.success(res?.respMsg || "Payment link created");
      setResult(data);
      onCreated?.();

      if (action === "share" && data.url) shareOnWhatsApp(data.url, data.agentName);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create payment link"));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result?.url || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy the link");
    }
  };

  // ----- step 2: link created
  if (result) {
    return (
      <Modal title="Share payment link" subtitle="Your link is ready" icon={Link2} onClose={onClose} maxWidth="max-w-lg">
        <ModalBody>
          <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50 text-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-slate-500">Order ID</dt>
              <dd className="truncate font-semibold text-slate-800">{result.orderId || orderId}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-slate-500">Agent</dt>
              <dd className="font-semibold text-slate-800">{result.agentName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-slate-500">Order status</dt>
              <dd><StatusBadge status={result.orderStatus || result.status || "Created"} /></dd>
            </div>
          </dl>

          <Field label="Payment link" className="mt-4">
            <div className="flex gap-2">
              <input className={inputCls} value={result.url || ""} readOnly onFocus={(e) => e.target.select()} />
              <button
                type="button"
                onClick={copy}
                disabled={!result.url}
                aria-label="Copy link"
                className="grid size-11 shrink-0 place-items-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
              </button>
            </div>
          </Field>
        </ModalBody>
        <ModalFooter>
          <button type="button" className={`${btnSecondary} sm:w-32`} onClick={onClose}>Close</button>
          <button
            type="button"
            className={`${btnPrimary} sm:w-40`}
            disabled={!result.url}
            onClick={() => shareOnWhatsApp(result.url, result.agentName)}
          >
            <MessageCircle size={17} /> Share
          </button>
        </ModalFooter>
      </Modal>
    );
  }

  // ----- step 1: form
  return (
    <Modal title="Create payment link" icon={Link2} onClose={onClose} closeDisabled={busy} maxWidth="max-w-md">
      <ModalBody>
        <div className="space-y-4">
          <Field label="Order ID"><input className={inputCls} value={orderId} readOnly tabIndex={-1} /></Field>
          <Field label="Mode"><input className={inputCls} value="PAYIN" readOnly tabIndex={-1} /></Field>
          <Field label="Agent name" required hint="Letters and spaces only">
            <input
              className={inputCls}
              value={agentName}
              maxLength={40}
              placeholder="Enter agent name"
              disabled={busy}
              onChange={(e) => /^[A-Za-z\s]*$/.test(e.target.value) && setAgentName(e.target.value)}
              autoFocus
            />
          </Field>
        </div>
      </ModalBody>
      <ModalFooter>
        <button type="button" className={`${btnSecondary} sm:w-28`} onClick={onClose} disabled={busy}>Cancel</button>
        {/* (Both buttons used to run the same handler – "Generate and Share" never shared.) */}
        <button type="button" className={`${btnAccent} sm:w-40`} onClick={() => generate("generate")} disabled={busy}>
          {busy ? "Generating..." : "Generate link"}
        </button>
        <button type="button" className={`${btnPrimary} sm:w-48`} onClick={() => generate("share")} disabled={busy}>
          <MessageCircle size={17} /> Generate &amp; share
        </button>
      </ModalFooter>
    </Modal>
  );
}
