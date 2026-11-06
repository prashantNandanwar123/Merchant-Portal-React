import { useLocation } from "react-router-dom";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  const { state } = useLocation();
  return (
    <ForgotPasswordForm
      idField="userId"
      idLabel="User ID"
      initialId={state?.userId || ""}
      backTo="/"
      endpoints={{
        send: "/sendForgotPasswordOtp",
        verify: "/verifyForgotPasswordOtp",
        reset: "/submitForgotPassword",
      }}
    />
  );
}
