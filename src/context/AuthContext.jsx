import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, readSession, writeSession } from "../utils/session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const login = useCallback((userData, role) => {
    const next = { ...userData, role };
    writeSession(next);
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // Keep every open tab in sync (log out in one tab → all tabs log out).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === null || e.key === "user" || e.key === "isLogin") setUser(readSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // The axios interceptor can clear the session behind React's back – re-sync on route change.
  useEffect(() => {
    const onHash = () => setUser((prev) => (prev && !readSession() ? null : prev));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      isAuthenticated: Boolean(user),
      isMerchant: user?.role === "MERCHANT",
      isReseller: user?.role === "RESELLER",
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
