// Tiny non-React session helper (used by the axios interceptor and AuthContext).
// The real session is the server cookie; this only remembers who is logged in so the
// UI can show the right pages. Roles: "MERCHANT" | "RESELLER".

const USER_KEY = "user";
const FLAG_KEY = "isLogin";

export const readSession = () => {
  try {
    if (localStorage.getItem(FLAG_KEY) !== "true") return null;
    const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    if (!user || typeof user !== "object") return null;
    // Sessions saved by older versions have no role – derive it.
    return { ...user, role: user.role || (user.resellerId ? "RESELLER" : "MERCHANT") };
  } catch {
    return null;
  }
};

export const writeSession = (user) => {
  localStorage.setItem(FLAG_KEY, "true");
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(FLAG_KEY);
  localStorage.removeItem(USER_KEY);
};

export const loginPathFor = (role) => (role === "RESELLER" ? "/reLogin" : "/");

export const homeFor = (role) => (role === "RESELLER" ? "/reseller/reDashboard" : "/app/dashboard");
