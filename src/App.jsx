import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthLayout from "./components/layout/AuthLayout";
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { homeFor } from "./utils/session";
import Loader from "./components/common/Loader";
import ApiDocs from "./components/common/ApiDocs";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import ReLogin from "./pages/auth/ReLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ReForgot from "./pages/auth/ReForgot";

// Heavy / rarely-first pages are code-split. (React.lazy needs a <Suspense> boundary –
// the old App.jsx imported Suspense but never rendered one.)
const PartnerOnboarding = lazy(() => import("./pages/auth/PartnerOnboarding"));
const Dashboard = lazy(() => import("./pages/merchant/Dashboard"));
const PaymentLinks = lazy(() => import("./pages/merchant/PaymentLinks"));
const Reports = lazy(() => import("./pages/merchant/Reports"));
const CryptoDashboard = lazy(() => import("./pages/merchant/CryptoDashboard"));
const CryptoReports = lazy(() => import("./pages/merchant/CryptoReports"));
const ApiKeys = lazy(() => import("./pages/merchant/ApiKeys"));
const Webhooks = lazy(() => import("./pages/merchant/Webhooks"));
const IpWhitelist = lazy(() => import("./pages/merchant/IpWhitelist"));
const Profile = lazy(() => import("./pages/merchant/Profile"));
const ReDashboard = lazy(() => import("./pages/reseller/ReDashboard"));
const ReMerchants = lazy(() => import("./pages/reseller/ReMerchants"));
const ReReport = lazy(() => import("./pages/reseller/ReReport"));
const ReProfile = lazy(() => import("./pages/reseller/ReProfile"));

// Logged-in users never see the login screens again.
function PublicOnly() {
  const { isAuthenticated, role } = useAuth();
  return isAuthenticated ? <Navigate to={homeFor(role)} replace /> : <AuthLayout />;
}

export default function App() {
  return (
    <>
      <Suspense fallback={<div className="grid min-h-dvh place-items-center"><Loader /></div>}>
        <Routes>
          <Route element={<PublicOnly />}>
            <Route path="/" element={<Login />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reLogin" element={<ReLogin />} />
            <Route path="/reForgot" element={<ReForgot />} />
            <Route path="/partner-onboarding" element={<PartnerOnboarding />} />
          </Route>

          {/* Merchant portal */}
          <Route element={<ProtectedRoute role="MERCHANT" />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="paymentlinks" element={<PaymentLinks />} />
              <Route path="reports" element={<Reports />} />
              <Route path="crypto-dashboard" element={<CryptoDashboard />} />
              <Route path="crypto-reports" element={<CryptoReports />} />
              <Route path="api-keys" element={<ApiKeys />} />
              <Route path="webhooks" element={<Webhooks />} />
              <Route path="ip-Whishlist" element={<IpWhitelist />} />
              <Route path="profile" element={<Profile />} />
              <Route path="apidoc" element={<ApiDocs />} />
            </Route>
          </Route>

          {/* Reseller portal */}
          <Route element={<ProtectedRoute role="RESELLER" />}>
            <Route path="/reseller" element={<AppShell />}>
              <Route index element={<Navigate to="reDashboard" replace />} />
              <Route path="reDashboard" element={<ReDashboard />} />
              <Route path="merchants" element={<ReMerchants />} />
              <Route path="reReport" element={<ReReport />} />
              <Route path="reProfile" element={<ReProfile />} />
              <Route path="api-docs" element={<ApiDocs />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop limit={3} theme="colored" />
    </>
  );
}
