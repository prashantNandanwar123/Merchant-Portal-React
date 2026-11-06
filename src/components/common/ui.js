// Shared Tailwind class strings so every screen looks the same.

export const labelCls = "mb-1.5 block text-[13px] font-semibold text-slate-700";

export const inputCls =
  "block h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-900 focus:ring-4 focus:ring-brand/30 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70 read-only:bg-slate-50 read-only:text-slate-600";

export const fileInputCls =
  "block h-11 w-full overflow-hidden rounded-lg border border-slate-300 bg-white text-sm text-slate-700 shadow-xs transition hover:border-slate-400 file:mr-3 file:h-11 file:cursor-pointer file:border-0 file:bg-brand file:px-4 file:text-sm file:font-semibold file:text-neutral-900 hover:file:bg-brand-dark";

const btnBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

export const btnPrimary = `${btnBase} bg-brand text-neutral-900 shadow-sm hover:bg-brand-dark`;
export const btnAccent = `${btnBase} bg-neutral-900 text-white shadow-sm hover:bg-neutral-700`;
export const btnSecondary = `${btnBase} bg-slate-200 text-slate-800 hover:bg-slate-300`;
export const btnOutline = `${btnBase} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50`;
export const btnSuccess = `${btnBase} bg-emerald-600 text-white shadow-sm hover:bg-emerald-700`;

export const alertCls = {
  info: "rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800",
  success:
    "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800",
  danger:
    "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800",
};

// Text-style link button used on the auth screens.
export const linkBtn =
  "font-semibold text-sky-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2";
