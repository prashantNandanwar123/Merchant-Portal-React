import { Search } from "lucide-react";
import Field from "./Field";
import { btnPrimary, inputCls } from "./ui";
import { todayISO } from "../../utils/format";

// From / To date pickers + submit button (+ optional extra buttons).
export default function DateRangeFilter({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  onSubmit,
  loading = false,
  submitLabel = "Search",
  children,
}) {
  const today = todayISO();

  return (
    <form
      className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Field label="From Date">
        <input
          type="date"
          className={inputCls}
          value={fromDate}
          max={toDate || today}
          onChange={(e) => onFromChange(e.target.value)}
          required
        />
      </Field>

      <Field label="To Date">
        <input
          type="date"
          className={inputCls}
          value={toDate}
          min={fromDate || undefined}
          max={today}
          onChange={(e) => onToChange(e.target.value)}
          required
        />
      </Field>

      <div className="flex gap-3 sm:col-span-2 lg:col-span-1">
        <button
          type="submit"
          className={`${btnPrimary} flex-1 lg:min-w-36`}
          disabled={loading}
        >
          <Search size={16} />
          {loading ? "Searching..." : submitLabel}
        </button>
        {children}
      </div>
    </form>
  );
}
