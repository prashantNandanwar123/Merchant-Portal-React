import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import Loader from "./Loader";

/**
 * Responsive data table.
 *  - md and up : classic table, horizontally scrollable, sticky header.
 *  - below md  : one card per row (no sideways scrolling on phones).
 *
 * Pagination:
 *  - client-side (default): pass all rows, `pageSize` rows are shown per page.
 *  - server-side: pass `serverPagination={{ page, size, totalRecords, totalPages, onPage, onSize }}`
 *    (page is 0-based, like the backend). `rows` is then just the current page.
 *
 * columns: [{ key, label, render?(row, absoluteIndex), primary?, action?, sticky? }]
 */
function MobileCard({ row, index, columns }) {
  const [open, setOpen] = useState(false);
  const cell = (col) => (col.render ? col.render(row, index) : (row[col.key] ?? "-"));
  const primary = columns.filter((c) => c.primary && !c.action);
  const secondary = columns.filter((c) => !c.primary && !c.action);
  const actions = columns.filter((c) => c.action);

  const Item = ({ col }) => (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{col.label}</dt>
      <dd className="mt-0.5 break-words text-[13px] font-medium text-slate-800">{cell(col)}</dd>
    </div>
  );

  return (
    <li className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {primary.map((col) => <Item key={col.key} col={col} />)}
      </dl>

      {open && secondary.length > 0 && (
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-dashed border-slate-200 pt-3">
          {secondary.map((col) => <Item key={col.key} col={col} />)}
        </dl>
      )}

      {(secondary.length > 0 || actions.length > 0) && (
        <div className="mt-3 flex items-center justify-between gap-3">
          {secondary.length > 0 ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-black"
            >
              {open ? "Show less" : "Show more"}
              <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          ) : <span />}
          {actions.map((col) => <span key={col.key}>{cell(col)}</span>)}
        </div>
      )}
    </li>
  );
}

const pageBtn =
  "grid size-9 place-items-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";

export default function DataTable({
  columns,
  rows,
  loading = false,
  emptyText = "No records found",
  pageSize = 10,
  rowKey,
  serverPagination = null,
}) {
  const [clientPage, setClientPage] = useState(1);

  // Client mode: back to the first page whenever the data set changes.
  useEffect(() => setClientPage(1), [rows]);

  if (loading) return <Loader />;

  if (!rows.length) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-slate-500">
        <Inbox size={30} className="text-slate-300" />
        <p>{emptyText}</p>
      </div>
    );
  }

  // ----- work out which rows are visible and what the footer shows
  let visible, offset, from, to, total, pageNo, pageCount, goPrev, goNext, canPrev, canNext, sizeControl = null;

  if (serverPagination) {
    const { page, size, totalRecords, totalPages, onPage, onSize } = serverPagination;
    visible = rows;
    offset = page * size;
    total = totalRecords || rows.length;
    from = offset + 1;
    to = Math.min(offset + size, total);
    pageNo = page + 1;
    pageCount = Math.max(1, totalPages || 1);
    canPrev = page > 0;
    canNext = page + 1 < pageCount;
    goPrev = () => onPage(page - 1);
    goNext = () => onPage(page + 1);
    if (onSize) {
      sizeControl = (
        <label className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
          Rows
          <select
            value={size}
            onChange={(e) => onSize(Number(e.target.value))}
            className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm outline-none focus:border-neutral-900 focus:ring-4 focus:ring-brand/30"
          >
            {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      );
    }
  } else {
    pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    const current = Math.min(clientPage, pageCount);
    offset = (current - 1) * pageSize;
    visible = rows.slice(offset, offset + pageSize);
    total = rows.length;
    from = offset + 1;
    to = Math.min(offset + pageSize, total);
    pageNo = current;
    canPrev = current > 1;
    canNext = current < pageCount;
    goPrev = () => setClientPage(current - 1);
    goNext = () => setClientPage(current + 1);
  }

  const keyOf = (row, i) => (rowKey ? rowKey(row, offset + i) : (row.id ?? offset + i));

  return (
    <>
      <ul className="space-y-3 md:hidden">
        {visible.map((row, i) => (
          <MobileCard key={keyOf(row, i)} row={row} index={offset + i} columns={columns} />
        ))}
      </ul>

      <div className="hidden max-h-[70vh] overflow-auto rounded-xl border border-slate-200 md:block">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`sticky top-0 z-10 whitespace-nowrap bg-slate-100 px-3.5 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 ${
                    col.sticky ? "right-0 z-20 text-center" : ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={keyOf(row, i)} className="group even:bg-slate-50/60 hover:bg-brand-soft/60">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`whitespace-nowrap border-t border-slate-100 px-3.5 py-2.5 align-middle ${
                      col.sticky
                        ? "sticky right-0 bg-white text-center shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.15)] group-hover:bg-brand-soft"
                        : ""
                    }`}
                  >
                    {col.render ? col.render(row, offset + i) : (row[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-xs text-slate-500 sm:text-sm">
          Showing <b>{from}</b>–<b>{to}</b> of <b>{total}</b>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {sizeControl}
          <div className="flex items-center gap-2">
            <button type="button" disabled={!canPrev} onClick={goPrev} aria-label="Previous page" className={pageBtn}>
              <ChevronLeft size={17} />
            </button>
            <span className="min-w-24 text-center text-sm font-medium text-slate-700">
              Page {pageNo} / {pageCount}
            </span>
            <button type="button" disabled={!canNext} onClick={goNext} aria-label="Next page" className={pageBtn}>
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
