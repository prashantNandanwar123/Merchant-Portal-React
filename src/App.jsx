import { lazy, Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import CryptoReports from "./components/CryptoReports";
import CryptoDashboard from "./components/CryptoDashboard";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Layout = lazy(() => import("./pages/Layout"));
const Reports = lazy(() => import("./components/Reports"));

const ApiDocs = lazy(() => import("./components/ApiDocs"));
const Forgot = lazy(() => import("./pages/ForgotPassword"));
const PaymentLinks = lazy(() => import("./pages/PaymentLinks"));

//Reseller
const ReLogin = lazy(() => import("./reseller/ReLogin"))
const ReForgot = lazy(() => import("./reseller/ReForgot"))
const ReLayout = lazy(() => import("./reseller/ReLayout"));
const ReDashboard = lazy(() => import("./reseller/ReDashboard"))
const ReReport = lazy(() => import("./reseller/ReReport"))
const ReProfile = lazy(() => import("./reseller/ReProfile"))
const PartnerOnboarding = lazy(() => import("./partner/PartnerOnboarding"))
const ReMerchants = lazy(() => import("./reseller/ReMerchants"))


{/* Settings Dropdown import */ }
import Profile from "./pages/Profile";
import ApiKeys from "./pages/ApiKeys";
import Webhooks from "./pages/Webhooks";
import IpWishlist from "./pages/IpWhitelist";
import ForgotPassword from "./pages/ForgotPassword";
import ReApidocs from "./reseller/ReApidocs";


function ProtectedRoute({ children }) {
  const isLogin = localStorage.getItem("isLogin");
  if (isLogin !== "true") {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      {/*  ToastContainer is OUTSIDE <Routes> */}
      <ToastContainer
        position="top-right"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        transition={Slide}
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}
            className="ml-2 text-2xl font-bold text-gray-600 hover:text-black">
            ×
          </button>
        )}
        toastClassName={(context) =>
          `relative flex p-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-white text-black shadow-none
             ${context?.type === "success"
            ? "border-green-500"
            : context?.type === "error"
              ? "border-red-500"
              : "border-blue-500"
          }`
        }
      />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={< ForgotPassword />} />
        <Route path="/reLogin" element={<ReLogin />} />
        <Route path="/reForgot" element={<ReForgot />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="PaymentLinks" element={<PaymentLinks />} />
          <Route path="reports" element={<Reports />} />  
          <Route path="crypto-reports" element={<CryptoReports />}/> 
          <Route path="crypto-dashboard" element={<CryptoDashboard />}/>       
          <Route path="apidoc" element={<ApiDocs />} />

          {/* SETTINGS PAGES - ADD HERE */}
          <Route path="profile" element={<Profile />} />
          <Route path="webhooks" element={<Webhooks />} />
          <Route path="api-keys" element={<ApiKeys />} />
          <Route path="ip-Whishlist" element={<IpWishlist />} />
        </Route>

        {/* Reseller App */}
        <Route
          path="/reseller"
          element={
            <ProtectedRoute>
              <ReLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ReDashboard />} />
          <Route path="reDashboard" element={<ReDashboard />} />
          <Route path="reReport" element={<ReReport />} />
          <Route path="reProfile" element={<ReProfile />} />
          <Route path="merchants" element={<ReMerchants />} />
          <Route path="api-docs" element={<ReApidocs />} />

        </Route>
        <Route
          path="/partner-onboarding"
          element={<PartnerOnboarding />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
