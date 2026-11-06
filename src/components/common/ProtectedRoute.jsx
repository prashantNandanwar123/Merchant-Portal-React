import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { homeFor } from "../../utils/session";

// Requires a logged-in user of the given role. A merchant can no longer open reseller
// pages (and vice-versa) just by typing the URL – previously both shared one "isLogin" flag.
export default function ProtectedRoute({ role }) {
  const { isAuthenticated, role: current } = useAuth();

  if (!isAuthenticated) return <Navigate to={role === "RESELLER" ? "/reLogin" : "/"} replace />;
  if (role && current !== role) return <Navigate to={homeFor(current)} replace />;
  return <Outlet />;
}
