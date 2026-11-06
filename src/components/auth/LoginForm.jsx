import { useRef, useState } from "react";
import { LogIn, Headset, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "react-toastify";

import Field from "../common/Field";
import PasswordField from "../common/PasswordField";
import { btnPrimary, inputCls } from "../common/ui";
import { getErrorMessage } from "../../utils/format";

// Shared card for the merchant and the reseller login.
//  onLogin(id, password) -> API response ({ respCode, respMsg, respData })
//  onSuccess(response) / onForgot(response) are called depending on respCode (0 / 3).
export default function LoginForm({
  title = "Welcome back!",
  subtitle,
  idLabel,
  idPlaceholder,
  onLogin,
  onSuccess,
  onForgot,
  links,
  footer,
}) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const lock = useRef(false); // blocks double submits before React re-renders

  const submit = async (e) => {
    e.preventDefault();
    if (lock.current) return;

    if (!id.trim() || !password) return toast.error(`Please enter ${idLabel} and password`);

    lock.current = true;
    setLoading(true);

    try {
      const response = await onLogin(id.trim(), password);

      if (response?.respCode === 0) {
        toast.success(response.respMsg || "Login successful");
        onSuccess(response, id.trim());
        return; // component unmounts after navigation
      }
      if (response?.respCode === 3) {
        toast.info(response.respMsg || "Please reset your password");
        onForgot(id.trim());
        return;
      }
      toast.error(response?.respMsg || "Login failed");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to login. Please try again."));
    }

    lock.current = false;
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
      <h1 className="text-center text-2xl font-extrabold tracking-tight text-neutral-900">{title}</h1>
      <p className="mb-7 mt-2 text-center text-sm text-slate-500">{subtitle}</p>

      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label={idLabel}>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              className={`${inputCls} pl-10`}
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder={idPlaceholder}
              autoComplete="username"
              disabled={loading}
            />
          </div>
        </Field>

        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
          disabled={loading}
        />

        <button type="submit" disabled={loading} className={`${btnPrimary} h-12 w-full text-base`}>
          <LogIn size={18} />
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
        {links}
      </div>

      {footer}

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700">
          <Headset size={20} />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900">Need help?</h2>
          <p className="break-words text-xs text-slate-600">
            Contact us at{" "}
            <a href="mailto:support@hellope.co.in" className="font-medium text-sky-700 hover:underline">
              support@hellope.co.in
            </a>
          </p>
        </div>
      </div>

      <p className="mt-5 flex items-center justify-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
        <ShieldCheck size={14} /> Your security is our priority
      </p>
      <p className="mt-1 text-center text-[11px] text-slate-400">
        © {new Date().getFullYear()} HelloPe Financial Services Pvt. Ltd. All rights reserved.
      </p>
    </div>
  );
}
