export default function Loader({ label = "Loading..." }) {
  return (
    <div
      className="flex items-center justify-center gap-3 p-8 text-slate-500"
      role="status"
    >
      <span className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
