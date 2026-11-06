import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "../../components/auth/LoginForm";
import { linkBtn } from "../../components/common/ui";

export default function ReLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <LoginForm
      subtitle="Log in to your reseller account"
      idLabel="Reseller ID"
      idPlaceholder="Enter Reseller ID"
      onLogin={(resellerId, password) => axiosInstance.post("/reseller/auth/login", { resellerId, password })}
      onSuccess={(response, resellerId) => {
        login({ resellerId, ...response.respData }, "RESELLER");
        navigate("/reseller/reDashboard", { replace: true });
      }}
      onForgot={(resellerId) => navigate("/reForgot", { state: { resellerId } })}
      links={
        <>
          <button type="button" className={linkBtn} onClick={() => navigate("/reForgot")}>
            Forgot password?
          </button>
          <button type="button" className={linkBtn} onClick={() => navigate("/")}>
            Merchant login
          </button>
        </>
      }
      footer={
        <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
          <span className="h-px flex-1 bg-slate-200" />
          <span>Don&apos;t have an account?</span>
          <button type="button" className={linkBtn} onClick={() => navigate("/partner-onboarding")}>
            Register as partner
          </button>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      }
    />
  );
}
