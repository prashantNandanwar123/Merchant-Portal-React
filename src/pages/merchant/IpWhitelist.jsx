import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";

import axiosInstance from "../../api/axios";
import PageHeader from "../../components/common/PageHeader";
import Panel from "../../components/common/Panel";
import Field from "../../components/common/Field";
import Loader from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { btnPrimary, inputCls } from "../../components/common/ui";
import { getErrorMessage } from "../../utils/format";

const IPV4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

export default function IpWhitelist() {
  const [ip, setIp] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/fetchWhitelistIp");
      const value = res?.respCode === 0 ? res.respData : null;
      // Bug fix: an empty respData used to become [null] and the saved IP was hidden until you
      // added a new one (the list was behind a `showIpList` flag that started as false).
      setList(Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []);
    } catch (error) {
      setList([]);
      toast.error(getErrorMessage(error, "Unable to fetch whitelisted IP"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (adding) return;

    const value = ip.trim();
    if (!value) return toast.error("Please enter an IP address");
    if (!IPV4.test(value)) return toast.error("Enter a valid IPv4 address, e.g. 192.168.1.1");

    try {
      setAdding(true);
      const res = await axiosInstance.post("/addIPWhitelist", null, { params: { ip: value } });
      if (res?.respCode === 0) {
        toast.success(res.respMsg || "IP added");
        setIp("");
        load();
      } else toast.error(res?.respMsg || "Unable to add IP");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to add IP"));
    } finally {
      setAdding(false);
    }
  };

  const remove = async () => {
    try {
      setDeleting(true);
      const res = await axiosInstance.post("/deleteWhitelistIp");
      if (res?.respCode === 0) {
        toast.success(res.respMsg || "IP removed");
        setList([]);
        setConfirmDelete(false);
      } else toast.error(res?.respMsg || "Unable to remove IP");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to remove IP"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="IP Whitelisting" subtitle="Only requests from your whitelisted IP are accepted by the API." />

      <Panel title="Whitelist an IP" icon={ShieldCheck} className="max-w-3xl">
        <form onSubmit={add} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="IP address" className="flex-1">
            <input
              className={inputCls}
              value={ip}
              inputMode="decimal"
              placeholder="e.g. 192.168.1.1"
              disabled={adding}
              onChange={(e) => setIp(e.target.value.replace(/[^0-9.]/g, ""))}
            />
          </Field>
          <button type="submit" className={`${btnPrimary} w-full sm:w-auto`} disabled={adding}>
            <Plus size={17} /> {adding ? "Adding..." : "Add IP"}
          </button>
        </form>

        <div className="mt-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Whitelisted</h3>
          {loading ? (
            <Loader />
          ) : list.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-slate-500">
              No IP address is whitelisted yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {list.map((item) => (
                <li key={item} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <span className="font-mono text-sm font-semibold text-slate-800">{item}</span>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    aria-label={`Remove ${item}`}
                    className="grid size-9 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>

      {confirmDelete && (
        <ConfirmDialog
          title="Remove whitelisted IP?"
          message="API requests from this IP address will be rejected until you add it again."
          confirmLabel="Remove"
          danger
          busy={deleting}
          onConfirm={remove}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
