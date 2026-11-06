import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Check, CircleCheck, Circle, MailCheck } from "lucide-react";

import Field from "../common/Field";
import PasswordField from "../common/PasswordField";
import { btnOutline, btnPrimary, inputCls } from "../common/ui";
import axiosInstance from "../../api/axios";
import { getErrorMessage } from "../../utils/format";

const OTP_SECONDS = 120;

const rules = (p) => [
  ["At least 8 characters", p.length >= 8],
  ["One uppercase letter", /[A-Z]/.test(p)],
  ["One lowercase letter", /[a-z]/.test(p)],
  ["One number", /[0-9]/.test(p)],
  ["One special character", /[^A-Za-z0-9]/.test(p)],
];

/**
 * 3-step reset: 1) ID + send OTP  2) verify OTP  3) new password.
 * Shared by the merchant ("userId") and reseller ("resellerId") screens.
 */
export default function ForgotPasswordForm({ idField, idLabel, endpoints, backTo, initialId = "" }) {
  const navigate = useNavigate();

  const [id, setId] = useState(initialId);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [step, setStep] = useState("id"); // id | otp | password
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const lock = useRef(false);

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const run = async (fn, fallback) => {
    if (lock.current) return;
    lock.current = true;
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      toast.error(getErrorMessage(error, fallback));
    } finally {
      lock.current = false;
      setLoading(false);
    }
  };

  const sendOtp = () =>
    run(async () => {
      if (!id.trim()) return toast.error(`Please enter ${idLabel}`);
      const res = await axiosInstance.post(endpoints.send, { [idField]: id.trim() });
      if (res?.respCode === 0) {
        toast.success(res.respMsg || "OTP sent");
        setOtp("");
        setTimer(OTP_SECONDS);
        setStep("otp");
      } else toast.error(res?.respMsg || "Unable to send OTP");
    }, "Unable to send OTP");

  const verifyOtp = () =>
    run(async () => {
      if (!/^\d{6}$/.test(otp)) return toast.error("Please enter the 6-digit OTP");
      const res = await axiosInstance.post(endpoints.verify, { [idField]: id.trim(), otp });
      if (res?.respCode === 0) {
        toast.success(res.respMsg || "OTP verified");
        setStep("password");
      } else toast.error(res?.respMsg || "Invalid OTP");
    }, "Unable to verify OTP");

  const resetPassword = () =>
    run(async () => {
      if (!rules(password).every(([, ok]) => ok)) {
        return toast.error("Password must meet all the rules below");
      }
      if (password !== confirm) return toast.error("Password and confirm password do not match");

      const res = await axiosInstance.post(endpoints.reset, {
        [idField]: id.trim(),
        password,
        confPassword: confirm,
      });
      if (res?.respCode === 0) {
        toast.success(res.respMsg || "Password updated");
        navigate(backTo, { replace: true });
      } else toast.error(res?.respMsg || "Unable to reset password");
    }, "Unable to reset password");

  // Start over (e.g. wrong ID). Previously the ID stayed editable after the OTP was
  // verified, so an OTP for one account could be submitted for another ID.
  const startOver = () => {
    setStep("id");
    setOtp("");
    setPassword("");
    setConfirm("");
    setTimer(0);
  };

  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(timer % 60).padStart(2, "0");
  const locked = step !== "id";

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9">
      <h1 className="text-center text-2xl font-extrabold tracking-tight text-neutral-900">Reset password</h1>
      <p className="mb-6 mt-2 text-center text-sm text-slate-500">Reset your account password securely</p>

      {/* progress */}
      <ol className="mb-6 flex items-center gap-2" aria-label="Progress">
        {["id", "otp", "password"].map((s, i) => {
          const done = ["id", "otp", "password"].indexOf(step) > i;
          const active = step === s;
          return (
            <li key={s} className={`h-1.5 flex-1 rounded-full ${done || active ? "bg-brand" : "bg-slate-200"}`} />
          );
        })}
      </ol>

      <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-4">
        <Field label={idLabel} required>
          <div className="relative">
            <input
              className={inputCls}
              value={id}
              maxLength={30}
              onChange={(e) => setId(e.target.value)}
              disabled={locked || loading}
              autoComplete="username"
            />
            {locked && <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600" />}
          </div>
        </Field>

        {step === "id" && (
          <button type="submit" onClick={sendOtp} disabled={loading} className={`${btnPrimary} w-full`}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {step === "otp" && (
          <>
            <div className="flex items-start gap-3 rounded-xl bg-sky-50 p-3 text-sm text-sky-800">
              <MailCheck size={18} className="mt-0.5 shrink-0" />
              <p>We&apos;ve sent a 6-digit OTP to your registered contact.</p>
            </div>

            <Field label="OTP" required hint={otp && otp.length < 6 ? "OTP should be 6 digits" : undefined}>
              <input
                className={`${inputCls} text-center text-lg tracking-[0.5em]`}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                disabled={loading}
                autoFocus
              />
            </Field>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                {timer > 0 ? (
                  <>Expires in <b className="text-red-500">{mm}:{ss}</b></>
                ) : (
                  <span className="text-red-500">OTP expired</span>
                )}
              </span>
              <button
                type="button"
                onClick={sendOtp}
                disabled={timer > 0 || loading}
                className="font-semibold text-sky-700 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
              >
                Resend OTP
              </button>
            </div>

            <button type="submit" onClick={verifyOtp} disabled={loading || timer === 0} className={`${btnPrimary} w-full`}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === "password" && (
          <>
            <PasswordField label="New password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" disabled={loading} />
            <PasswordField
              label="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
              error={confirm && password !== confirm ? "Passwords do not match" : ""}
            />

            <ul className="grid grid-cols-1 gap-1.5 rounded-xl bg-slate-50 p-3 text-xs sm:grid-cols-2">
              {rules(password).map(([label, ok]) => (
                <li key={label} className={`flex items-center gap-1.5 ${ok ? "text-emerald-700" : "text-slate-500"}`}>
                  {ok ? <CircleCheck size={14} /> : <Circle size={14} />} {label}
                </li>
              ))}
            </ul>

            <button type="submit" onClick={resetPassword} disabled={loading} className={`${btnPrimary} w-full`}>
              {loading ? "Saving..." : "Reset password"}
            </button>
          </>
        )}

        {locked && (
          <button type="button" onClick={startOver} disabled={loading} className="w-full text-center text-sm font-semibold text-sky-700 hover:underline">
            Use a different {idLabel}
          </button>
        )}

        <button type="button" onClick={() => navigate(backTo)} className={`${btnOutline} w-full`}>
          <ArrowLeft size={16} /> Back to login
        </button>
      </form>
    </div>
  );
}
