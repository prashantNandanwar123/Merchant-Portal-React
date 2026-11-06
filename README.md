# HelloPe Merchant Portal (Merchant + Reseller + Partner sign-up)

React 19 · Vite 8 · Tailwind CSS v4 · React Router 7 (HashRouter). Fully responsive (phone, tablet, desktop).

## Run locally
1. Node.js 20+
2. `cp .env.example .env` and set `VITE_API_PROXY_TARGET` (the backend that `/api` is proxied to in dev)
3. `npm install`
4. `npm run dev` → http://localhost:5173
5. `npm run lint` / `npm run build`

## Structure
```
src/
  api/axios.js                 axios client + interceptors
  utils/format.js, session.js  dates, money, errors, CSV/blob helpers · session helpers
  context/AuthContext.jsx      role-aware session (MERCHANT | RESELLER)
  components/common/           Field, Modal, ConfirmDialog, Panel, PageHeader, StatCard, StatusBadge, SearchBox,
                               DataTable (cards on phones, server or client pagination), DateRangeFilter,
                               PasswordField, ProfileView, ApiDocs, ProtectedRoute, ui.js
  components/layout/           AppShell (used by BOTH portals), Sidebar, UserMenu, AuthLayout, nav.js
  components/auth/             LoginForm, ForgotPasswordForm (shared by merchant + reseller)
  components/merchant/         DashboardChart, CreatePaymentLinkModal
  pages/auth|merchant|reseller
```

## Bugs fixed
| # | Where | Problem | Fix |
|---|-------|---------|-----|
| 1 | Payment links | Every link was created with a **hard-coded identity** (`"Rohit"`, `"Rohit Sharma"`, `"HELLOPE10001"`); an empty agent name silently became "Rohit" | Uses the logged-in merchant; agent name is required |
| 2 | Payment links | Closing the modal called an undefined `setShowLinkPopup` → ReferenceError; "Generate and Share" was identical to "Generate" (never shared) | Fixed; the two buttons now differ; success step with copy + WhatsApp |
| 3 | Crypto reports | URL was built as `?page = 0& size=10` (spaces) so paging never reached the backend; S.No. restarted on every page | Proper `params`; S.No. continues across pages |
| 4 | Auth / interceptor | A **wrong password (401)** showed "Session expired" and redirected; HTTP **429 wiped the session** without redirecting; errors rejected as strings/objects so `toast.error(error)` could crash React | Auth calls excluded from session-expiry handling; 429 keeps the session; always rejects with an `Error` (string message) |
| 5 | Roles | Merchant and reseller shared one `isLogin` flag → a merchant could open reseller pages and vice-versa | Role-based `ProtectedRoute`; logged-in users skip login screens |
| 6 | App.jsx | `React.lazy` pages with **no `<Suspense>`**; duplicate Forgot-password import; many unused imports | Suspense boundary + clean routes |
| 7 | Dashboard | Whole page replaced by "No Data Found" while loading / on error (filters vanished, no retry); clearing a date input threw `RangeError` (`toISOString` on Invalid Date); dates computed in UTC (off by one near midnight in IST); **fake hard-coded trends** ("↑ 11.8% vs last 7 days"); hard-coded "SuperUser" | Local-date handling, retry banner, real greeting, fake trends removed |
| 8 | Reports | Search button used a stale page (double/wrong request); paging used half-edited dates; JSON error saved as a corrupt `.xlsx` | Single "applied range" source of truth; export validates the response |
| 9 | Toasts | Some files used `react-hot-toast` with no `<Toaster/>` mounted → their errors were never visible | One toast system (react-toastify) |
| 10 | Navbar | Page titles looked up `/app/paymentlinks` but the link was `/app/PaymentLinks` (title fell back to "Dashboard"); unguarded `JSON.parse` | Titles generated from the nav config |
| 11 | Sidebar | Active menu not derived from the URL (always "Dashboard" after refresh); Payment Links never highlighted (NavLink object passed as key); crypto/settings chevrons swapped | URL-driven, auto-expanding groups |
| 12 | Logout | Session only cleared when the server returned `respCode 0` | Always clears locally |
| 13 | Forgot password | User ID stayed editable after OTP verification (OTP for one account could be submitted for another ID); "15 minutes" comment vs 2-minute timer | ID locked; "Use a different ID" restarts; one shared component for merchant + reseller |
| 14 | IP whitelist | Saved IP hidden until you added a new one; `[null]` list when empty; no IP validation; delete without confirm | Shown on load, IPv4 validation, confirm dialog |
| 15 | API keys | `response.resMsg` typo hid the real error | Fixed + retry state |
| 16 | Webhooks | Badge classes were the literal text `gray-500` (unstyled) | Real badge styles |
| 17 | Reseller | Merchants page default dates hard-coded to `2026-08-08`; dashboard crashed on null `respData`; profile `toast.error(error)` crash | Today's date, guarded, string errors |
| 18 | Partner sign-up | Right-click / F12 / Ctrl+U blocking (hurts accessibility, protects nothing); no PAN/GSTIN/Aadhaar/mobile format checks; 20-char company name limit | Removed; full validation; country-aware pincode |
| 19 | Config | Dev proxy hard-coded to a private IP; dead files (`dummy.jsx`, `dummy2.jsx`, a JSP `index.html`, `OtpVerify`, `ReportsCrypto .jsx`); 6 MB of unused images; unused dependencies (`react-icons`, `react-hot-toast`, `react-datepicker`, `react-select`, `react-qr-code`) | Env-driven proxy, files/assets/deps removed |

## UI / responsive upgrade
- One design system across both portals (HelloPe navy + yellow): shared `AppShell`, slide-in drawer on phones, collapsible on desktop.
- The old layout shrank text to 11 px on screens ≥ 1280 px (`xl:text-[11px]`) and used fixed `h-screen` scroll areas; replaced with fluid sizing and normal page scroll (`100dvh`).
- Tables become cards on phones; server-side pagination with page-size selector for the transaction reports.
- Excel library is loaded on demand.

## Things to know
- The dark/light **sidebar toggle** and the static "Congratulations" **notification bell** were cosmetic and are removed.
- Reports' search / status filters apply to the **current page** (the API paginates on the server); this is shown in the placeholder text.
- Crypto "Export" exports the visible page. The merchant/reseller exports use the server-side file endpoints.
- Please verify on the backend: authorization per role/ownership, rate limiting, and that the signup endpoint returns a consistent response shape (`success/message` vs `respCode/respMsg`).
