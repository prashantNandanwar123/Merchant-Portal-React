import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import axiosInstance from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import ProfileView from "../../components/common/ProfileView";
import { alertCls } from "../../components/common/ui";
import { getErrorMessage } from "../../utils/format";

const sections = [
  { title: "Personal information", fields: [
    { label: "First name", key: "firstName" }, { label: "Last name", key: "lastName" },
    { label: "Email", key: "email" }, { label: "Mobile", key: "mobile" }, { label: "Company name", key: "companyName" },
  ] },
  { title: "Address information", fields: [
    { label: "Country", key: "country" }, { label: "State", key: "state" }, { label: "City", key: "city" },
    { label: "Pincode", key: "pincode" }, { label: "Address", key: "address" },
  ] },
  { title: "KYC information", fields: [
    { label: "Aadhaar number", key: "aadharNo", mask: true }, { label: "PAN number", key: "panNo", mask: true },
    { label: "GST number", key: "gstNo" },
  ] },
  { title: "Bank information", fields: [
    { label: "Beneficiary account name", key: "reBeneficiaryAccountName" },
    { label: "Account number", key: "reBeneficiaryAccountNo", mask: true },
    { label: "Bank name", key: "reBeneficiaryBankName" }, { label: "Branch name", key: "reBeneficiaryBranchName" },
    { label: "IFSC code", key: "reIFSCCode" },
  ] },
  { title: "Settlement information", fields: [
    { label: "Settlement type", key: "rssSettlementType" }, { label: "Settlement cycle", key: "rssSettlementCycle" },
    { label: "Payment by", key: "rssPaymentBy" },
  ] },
];

export default function ReProfile() {
  const { user } = useAuth();
  const resellerId = user?.resellerId;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resellerId) return;
    (async () => {
      try {
        const res = await axiosInstance.post(`/reseller/profile/${encodeURIComponent(resellerId)}`);
        if (res?.respCode === 0 && res.respData) setProfile(res.respData);
        else setError(res?.respMsg || "Unable to load profile");
      } catch (err) {
        const message = getErrorMessage(err, "Unable to load profile"); // (toast.error(error) crashed with an object)
        setError(message);
        toast.error(message, { toastId: "re-profile-error" });
      } finally {
        setLoading(false);
      }
    })();
  }, [resellerId]);

  if (loading) return <Loader label="Loading profile..." />;
  if (error || !profile) return <div className={alertCls.danger}>{error || "Profile not available"}</div>;

  return (
    <ProfileView
      name={[profile.firstName, profile.lastName].filter(Boolean).join(" ")}
      subtitle={profile.companyName}
      status={profile.status}
      sections={sections}
      data={profile}
    />
  );
}
