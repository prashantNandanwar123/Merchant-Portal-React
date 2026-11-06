import { labelCls } from "./ui";

// Label + control + hint/error. `className` is applied to the wrapper so
// callers can control grid spans, e.g. className="sm:col-span-2".
export default function Field({
  label,
  required,
  error,
  hint,
  className = "",
  children,
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className={labelCls}>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {hint && !error && (
        <small className="mt-1 block text-xs text-slate-500">{hint}</small>
      )}
      {error && (
        <small role="alert" className="mt-1 block text-xs font-medium text-red-600">
          {error}
        </small>
      )}
    </label>
  );
}
