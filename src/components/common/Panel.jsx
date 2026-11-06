export default function Panel({
  title,
  icon: Icon,
  action,
  children,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section
      className={`mb-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5 sm:px-6">
          {title && (
            <h2 className="flex items-center gap-2 text-[15px] font-bold text-slate-900">
              {Icon && (
                <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-neutral-900">
                  <Icon size={17} />
                </span>
              )}
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      <div className={`p-4 sm:p-6 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
