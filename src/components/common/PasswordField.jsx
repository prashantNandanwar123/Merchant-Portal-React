import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import Field from "./Field";
import { inputCls } from "./ui";

export default function PasswordField({ label = "Password", error, hint, className = "", icon = true, ...inputProps }) {
  const [show, setShow] = useState(false);

  return (
    <Field label={label} error={error} hint={hint} className={className}>
      <div className="relative">
        {icon && (
          <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          {...inputProps}
          type={show ? "text" : "password"}
          className={`${inputCls} ${icon ? "pl-10" : ""} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-black"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </Field>
  );
}
