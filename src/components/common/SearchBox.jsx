import { Search } from "lucide-react";
import { inputCls } from "./ui";

export default function SearchBox({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <div className={`relative w-full sm:w-72 ${className}`}>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        className={`${inputCls} h-10 pl-9`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
}
