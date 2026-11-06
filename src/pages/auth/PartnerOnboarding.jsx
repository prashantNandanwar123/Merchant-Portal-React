import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Clock3, Store } from "lucide-react";

import axiosInstance from "../../api/axios";
import statecity from "../../data/statecity.json";
import Field from "../../components/common/Field";
import Modal, { ModalBody, ModalFooter } from "../../components/common/Modal";
import { btnPrimary, inputCls } from "../../components/common/ui";
import { getErrorMessage, randomDigits } from "../../utils/format";

const INITIAL = {
  firstName: "", lastName: "", email: "", mobile: "", aadharNo: "", panNo: "", gstNo: "",
  country: "", address: "", city: "", state: "", pincode: "", companyName: "",
};

const required = (v) => String(v).trim() !== "";

// One rule per field: [test, message]. (Before, only `required` + maxLength were enforced.)
const RULES = {
  firstName: [[required, "First name is required"]],
  lastName: [[required, "Last name is required"]],
  email: [[(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address"]],
  mobile: [[(v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit mobile number"]],
  aadharNo: [[(v) => /^\d{12}$/.test(v), "Aadhaar number must be 12 digits"]],
  panNo: [[(v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v), "Enter a valid PAN number"]],
  gstNo: [[(v) => /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(v), "Enter a valid 15-character GSTIN"]],
  companyName: [[required, "Company name is required"]],
  country: [[required, "Select a country"]],
  state: [[required, "Select a state"]],
  city: [[required, "Select a city"]],
  address: [[required, "Address is required"]],
};

const pincodeError = (country, v) => {
  if (country === "USA") return /^\d{5}(-\d{4})?$/.test(v) ? "" : "Enter a valid ZIP code";
  return /^\d{6}$/.test(v) ? "" : "Enter a valid 6-digit pincode";
};

const CLEAN = {
  mobile: (v) => v.replace(/\D/g, "").slice(0, 10),
  aadharNo: (v) => v.replace(/\D/g, "").slice(0, 12),
  panNo: (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10),
  gstNo: (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15),
  pincode: (v) => v.replace(/[^\d-]/g, "").slice(0, 10),
};

export default function PartnerOnboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const lock = useRef(false);

  const states = useMemo(() => statecity.find((c) => c.country === form.country)?.states ?? [], [form.country]);
  const cities = useMemo(() => states.find((s) => s.state === form.state)?.cities ?? [], [states, form.state]);

  const set = (name, raw) => {
    const value = CLEAN[name] ? CLEAN[name](raw) : raw;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Changing country / state clears the dependent selects.
      if (name === "country") { next.state = ""; next.city = ""; }
      if (name === "state") next.city = "";
      return next;
    });
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = () => {
    const found = {};
    Object.entries(RULES).forEach(([name, rules]) => {
      const failed = rules.find(([test]) => !test(form[name]));
      if (failed) found[name] = failed[1];
    });
    const pin = pincodeError(form.country, form.pincode);
    if (pin) found.pincode = pin;
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (lock.current) return;
    if (!validate()) return toast.error("Please correct the highlighted fields");

    lock.current = true;
    setLoading(true);

    try {
      const res = await axiosInstance.post("/reseller/auth/signup", {
        requestId: `REQ${Date.now()}${randomDigits(3)}`,
        ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])),
      });

      if (res?.success === true) {
        toast.success(res.message || "Registration submitted");
        setDone(true);
      } else if (res?.success === false) {
        toast.error(res.message || "Registration failed");
      } else if (res?.respData && typeof res.respData === "object") {
        // Field-level validation messages from the server.
        Object.values(res.respData).forEach((msg) => toast.error(String(msg)));
      } else {
        toast.error(res?.respMsg || res?.message || "Registration failed");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to submit the registration"));
    } finally {
      lock.current = false;
      setLoading(false);
    }
  };

  // Compact text-field helper
  const text = (name, label, props = {}) => (
    <Field label={label} required error={errors[name]} className={props.className}>
      <input
        className={inputCls}
        value={form[name]}
        onChange={(e) => set(name, e.target.value)}
        disabled={loading}
        {...props.input}
        placeholder={props.placeholder}
        maxLength={props.maxLength}
      />
    </Field>
  );

  const select = (name, label, options, placeholder, disabled = false) => (
    <Field label={label} required error={errors[name]}>
      <select className={inputCls} value={form[name]} onChange={(e) => set(name, e.target.value)} disabled={loading || disabled}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );

  const Title = ({ children }) => (
    <h2 className="mb-4 mt-8 border-b border-slate-200 pb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">{children}</h2>
  );
  const grid = "grid grid-cols-1 gap-4 sm:grid-cols-2";

  return (
    <div className="w-full max-w-3xl rounded-3xl border border-slate-200/70 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-9">
      <div className="mb-2 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-brand-soft"><Store size={22} /></span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">Partner onboarding</h1>
          <p className="text-sm text-slate-500">Register as a reseller and earn commission on your merchants&apos; transactions.</p>
        </div>
      </div>

      {/* (The old page blocked right-click, F12 and Ctrl+U/Shift+I/J/C. That doesn't protect anything and
          only hurt keyboard and accessibility users, so it was removed.) */}
      <form onSubmit={submit} noValidate>
        <Title>Personal information</Title>
        <div className={grid}>
          {text("firstName", "First name", { maxLength: 25, placeholder: "First name" })}
          {text("lastName", "Last name", { maxLength: 25, placeholder: "Last name" })}
          {text("email", "Email", { placeholder: "name@example.com", input: { type: "email", autoComplete: "email" } })}
          {text("mobile", "Mobile number", { placeholder: "10-digit mobile number", input: { type: "tel", inputMode: "numeric", autoComplete: "tel" } })}
        </div>

        <Title>Business &amp; KYC</Title>
        <div className={grid}>
          {text("companyName", "Company name", { maxLength: 60, placeholder: "Company name", className: "sm:col-span-2" })}
          {text("aadharNo", "Aadhaar number", { placeholder: "12-digit Aadhaar", input: { inputMode: "numeric" } })}
          {text("panNo", "PAN number", { placeholder: "ABCDE1234F" })}
          {text("gstNo", "GSTIN", { placeholder: "Eg. 27AAPFU0939F1ZV", className: "sm:col-span-2" })}
        </div>

        <Title>Address</Title>
        <div className={grid}>
          {select("country", "Country", statecity.map((c) => c.country), "Select country")}
          {select("state", "State", states.map((s) => s.state), "Select state", !form.country)}
          {select("city", "City", cities, "Select city", !form.state)}
          <Field label={form.country === "USA" ? "ZIP code" : "Pincode"} required error={errors.pincode}>
            <input
              className={inputCls}
              value={form.pincode}
              onChange={(e) => set("pincode", e.target.value)}
              inputMode="numeric"
              placeholder={form.country === "USA" ? "ZIP code" : "6-digit pincode"}
              disabled={loading}
            />
          </Field>
          {text("address", "Address", { maxLength: 120, placeholder: "Street address", className: "sm:col-span-2" })}
        </div>

        <button type="submit" disabled={loading} className={`${btnPrimary} mt-8 h-12 w-full text-base`}>
          {loading ? "Submitting..." : "Submit registration"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already a partner?{" "}
        <Link to="/reLogin" className="font-bold text-neutral-900 underline decoration-brand decoration-2 underline-offset-4">Log in</Link>
      </p>

      {done && (
        <Modal title="Waiting for approval" icon={Clock3} onClose={() => navigate("/reLogin")} maxWidth="max-w-md">
          <ModalBody>
            <p className="text-sm leading-6 text-slate-600">
              Your registration was submitted and is under review. An administrator will approve your account
              before you can log in. After approval, merchants you bring will be assigned to your account and you
              earn commission on their transactions.
            </p>
          </ModalBody>
          <ModalFooter>
            <button type="button" className={`${btnPrimary} sm:w-40`} onClick={() => navigate("/reLogin")}>Go to login</button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
