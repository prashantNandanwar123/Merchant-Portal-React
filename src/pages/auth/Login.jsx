import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "../../components/auth/LoginForm";
import { linkBtn } from "../../components/common/ui";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <LoginForm
      subtitle="Log in to your merchant account"
      idLabel="User ID"
      idPlaceholder="Enter User ID"
      onLogin={(userId, password) => axiosInstance.post("/auth/submitLogin", { userId, password })}
      onSuccess={(response, userId) => {
        // `userId` is kept in the saved user so pages can use the real logged-in id
        // (the payment-link page used to send a hard-coded "HELLOPE10001").
        login({ userId, ...response.respData }, "MERCHANT");
        navigate("/app/dashboard", { replace: true });
      }}
      onForgot={(userId) => navigate("/forgot", { state: { userId } })}
      links={
        <>
          <button type="button" className={linkBtn} onClick={() => navigate("/forgot")}>
            Forgot password?
          </button>
          <button type="button" className={linkBtn} onClick={() => navigate("/reLogin")}>
            Reseller login
          </button>
        </>
      }
    />
  );
}
