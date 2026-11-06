import { useLocation } from "react-router-dom";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

export default function ReForgot() {
  const { state } = useLocation();
  return (
    <ForgotPasswordForm
      idField="resellerId"
      idLabel="Reseller ID"
      initialId={state?.resellerId || ""}
      backTo="/reLogin"
      endpoints={{
        send: "/reseller/sendForgotPasswordOtp",
        verify: "/reseller/verifyForgotPasswordOtp",
        reset: "/reseller/submitForgotPassword",
      }}
    />
  );
}
