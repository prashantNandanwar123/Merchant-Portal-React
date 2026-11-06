// Shared helpers: dates, money, errors, ids and CSV export.

const pad = (n) => String(n).padStart(2, "0");

// Date -> yyyy-MM-dd in LOCAL time (value format of <input type="date">).
export const toInputDate = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayISO = () => toInputDate(new Date());

// yyyy-MM-dd -> dd/MM/yyyy (the format the backend expects).
export const toApiDate = (iso) => {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
};

// Validates a from/to range. Returns an error message or "" when valid.
export const validateRange = (from, to) => {
  if (!from || !to) return "Please select both dates";
  if (from > to) return "From date cannot be after To date";
  return "";
};

export const money = (value, minimumFractionDigits = 2) => {
  const n = Number(value);
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-IN", {
    minimumFractionDigits,
    maximumFractionDigits: 2,
  });
};

// Always returns a STRING, so it is safe to pass to toast / render.
// Understands: our axios interceptor errors (Error with .message), plain strings,
// API bodies ({ respMsg } / { message }) and raw axios errors.
export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (typeof error === "string" && error.trim()) return error;

  const body = error?.response?.data ?? error?.data;
  const fromBody =
    (typeof body === "string" && body.trim()) ||
    (typeof body?.respMsg === "string" && body.respMsg) ||
    (typeof body?.message === "string" && body.message);
  if (fromBody) return fromBody;

  if (typeof error?.respMsg === "string" && error.respMsg) return error.respMsg;
  if (error?.code === "ECONNABORTED") return "Request timed out. Please try again.";
  if (error?.message === "Network Error") {
    return "Unable to reach the server. Check your connection and try again.";
  }
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  return fallback;
};

// Cryptographically-random digit string (better than Math.random for reference ids).
export const randomDigits = (length) => {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b % 10).join("");
};

export const timestamp = (full = true) => {
  const d = new Date();
  const year = full ? d.getFullYear() : String(d.getFullYear()).slice(-2);
  return `${year}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
};

// Escapes a CSV cell and neutralises spreadsheet formula injection (=, +, -, @).
const csvCell = (value) => {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text) && !/^-?\d+(\.\d+)?$/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
};

export const downloadCsv = (filename, headers, rows) => {
  const csv = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  // UTF-8 BOM so Excel shows special characters correctly.
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Parses backend date strings: "yyyy/MM/dd HH:mm:ss" or "dd/MM/yyyy HH:mm:ss" (time optional).
// Returns a timestamp (0 when it can't be parsed) so it can be used for sorting.
export const parseBackendDate = (value) => {
  if (!value) return 0;
  const [datePart, timePart = "0:0:0"] = String(value).trim().split(/[ T]/);
  const seg = datePart.split(/[/-]/).map(Number);
  if (seg.length !== 3 || seg.some(Number.isNaN)) return 0;

  const [a, b, c] = seg;
  const [year, month, day] = String(datePart.split(/[/-]/)[0]).length === 4 ? [a, b, c] : [c, b, a];
  const [h = 0, m = 0, s = 0] = timePart.split(":").map(Number);
  const t = new Date(year, month - 1, day, h, m, s).getTime();
  return Number.isNaN(t) ? 0 : t;
};

// Case-insensitive "does any of these fields contain the keyword" (safe for numbers / null).
export const matchesSearch = (row, keys, keyword) => {
  const q = String(keyword ?? "").trim().toLowerCase();
  if (!q) return true;
  return keys.some((k) => String(row[k] ?? "").toLowerCase().includes(q));
};

export const dash = (v) => (v === null || v === undefined || v === "" ? "-" : v);

// Backend sends amounts in paise for merchant reports. Returns "₹ 1,234.50".
export const inrFromPaise = (paise) => `₹ ${money((Number(paise) || 0) / 100)}`;

// Masks all but the last 4 characters (Aadhaar / PAN / account numbers).
export const maskId = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return text.length <= 4 ? text : `${"X".repeat(text.length - 4)}${text.slice(-4)}`;
};

// yyyy-MM-dd for "N days before today" (local time).
export const daysAgoISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - Number(days));
  return toInputDate(d);
};

// Triggers a browser download for a Blob. Returns false (and does nothing) when the
// server answered with a JSON error body instead of a file.
export const saveBlob = async (blob, filename) => {
  if (!(blob instanceof Blob) || blob.size === 0) throw new Error("The server returned an empty file");
  if (blob.type.includes("json") || blob.type.includes("text")) {
    let message = "Unable to export the report";
    try {
      const parsed = JSON.parse(await blob.text());
      message = parsed?.respMsg || parsed?.message || message;
    } catch { /* not JSON – keep default */ }
    throw new Error(message);
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
