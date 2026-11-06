const tones = {
  green: { chip: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" },
  yellow: { chip: "bg-amber-100 text-amber-700", bar: "bg-brand" },
  blue: { chip: "bg-sky-100 text-sky-700", bar: "bg-sky-500" },
  red: { chip: "bg-red-100 text-red-700", bar: "bg-red-500" },
  slate: { chip: "bg-slate-100 text-slate-700", bar: "bg-slate-500" },
};

export default function StatCard({ label, value, icon: Icon, tone = "yellow", hint }) {
  const t = tones[tone] ?? tones.yellow;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <span className={`absolute inset-x-0 top-0 h-1 ${t.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
            {label}
          </p>
          <strong className="mt-2 block break-words text-xl font-bold text-slate-900 sm:text-2xl">
            {value}
          </strong>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl sm:size-11 ${t.chip}`}>
          <Icon size={21} />
        </span>
      </div>
      {hint && <p className="mt-3 text-xs text-slate-400">{hint}</p>}
    </article>
  );
}
