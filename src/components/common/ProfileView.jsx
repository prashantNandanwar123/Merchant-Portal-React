import { UserRound } from "lucide-react";
import Panel from "./Panel";
import StatusBadge from "./StatusBadge";
import { dash, maskId } from "../../utils/format";

// Read-only profile page: header card + titled sections of label/value pairs.
// sections: [{ title, fields: [{ label, key, mask?, link? }] }]
export default function ProfileView({ name, subtitle, status, sections, data }) {
  const initials = String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const render = ({ key, mask, link }) => {
    const raw = data?.[key];
    if (raw === null || raw === undefined || raw === "") return "-";
    // Sensitive IDs show only the last 4 characters (they were shown in full before).
    if (mask) return maskId(raw);
    if (link && /^https?:\/\//i.test(String(raw))) {
      return (
        <a href={raw} target="_blank" rel="noopener noreferrer" className="text-sky-700 hover:underline">
          {raw}
        </a>
      );
    }
    return dash(raw);
  };

  return (
    <>
      <section className="mb-5 flex flex-col gap-4 rounded-2xl bg-sidebar p-5 text-white shadow-lg sm:flex-row sm:items-center sm:p-6">
        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-brand text-xl font-extrabold text-neutral-900">
          {initials || <UserRound size={28} />}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold sm:text-2xl">{name || "-"}</h2>
          {subtitle && <p className="mt-1 break-words text-sm text-slate-300">{subtitle}</p>}
        </div>
        {status && <StatusBadge status={status} />}
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {sections.map((section) => (
          <Panel key={section.title} title={section.title} className="!mb-0">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {section.fields.map((f) => (
                <div key={f.label} className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{f.label}</dt>
                  <dd className="mt-0.5 break-words text-sm font-semibold text-slate-800">{render(f)}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        ))}
      </div>
    </>
  );
}
