const styles = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  danger: "bg-red-50 text-red-700 ring-red-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
};
const dots = {
  success: "bg-emerald-500",
  danger: "bg-red-500",
  warning: "bg-amber-500",
};

const toneOf = (label) => {
  const key = label.toLowerCase();
  // Check "bad" words first: "Deactive" / "Inactive" also contain "active".
  if (/(fail|reject|declin|error|inactive|deactiv|block|expire)/.test(key)) return "danger";
  if (/(success|approved|active|verified|credited)/.test(key)) return "success";
  return "warning";
};

export default function StatusBadge({ status }) {
  const label = String(status ?? "").trim() || "Pending";
  const tone = toneOf(label);

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${styles[tone]}`}
    >
      <span className={`size-1.5 rounded-full ${dots[tone]}`} />
      {label}
    </span>
  );
}
