import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import axiosInstance from "../../api/axios";
import Loader from "../../components/common/Loader";
import ProfileView from "../../components/common/ProfileView";
import { alertCls } from "../../components/common/ui";
import { getErrorMessage } from "../../utils/format";

const sections = [
  { title: "Account information", fields: [
    { label: "User ID", key: "userId" }, { label: "Username", key: "userName" }, { label: "Merchant ID", key: "mid" },
  ] },
  { title: "Business information", fields: [
    { label: "Legal name", key: "legalName" }, { label: "DBA name", key: "dbaName" },
    { label: "Business type", key: "businessType" }, { label: "Category", key: "category" },
    { label: "Website", key: "websiteUrl", link: true },
  ] },
  { title: "Contact information", fields: [
    { label: "Contact person", key: "contactPersonName" }, { label: "Primary email", key: "primaryEmail" },
    { label: "Secondary email", key: "secondaryEmail" }, { label: "Contact mobile", key: "contactMobile" },
  ] },
  { title: "Address details", fields: [
    { label: "Address 1", key: "address1" }, { label: "Address 2", key: "address2" }, { label: "City", key: "city" },
    { label: "State", key: "state" }, { label: "Country", key: "country" }, { label: "Pincode", key: "pincode" },
  ] },
  { title: "KYC details", fields: [
    { label: "PAN number", key: "panNo", mask: true }, { label: "GST number", key: "gstNo" },
    { label: "Aadhaar number", key: "aadhaarNo", mask: true },
  ] },
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.post("/auth/meProfile");
        if (res?.respCode === 0 && res.respData) setProfile(res.respData);
        else setError(res?.respMsg || "Unable to load profile");
      } catch (err) {
        const message = getErrorMessage(err, "Unable to load profile");
        setError(message);
        toast.error(message, { toastId: "profile-error" }); // (react-hot-toast had no <Toaster/>, so errors were invisible)
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader label="Loading profile..." />;
  if (error || !profile) return <div className={alertCls.danger}>{error || "Profile not available"}</div>;

  return (
    <ProfileView
      name={profile.legalName}
      subtitle={profile.mid ? `Merchant ID: ${profile.mid}` : ""}
      status={profile.status === "A" ? "Active" : "Inactive"}
      sections={sections}
      data={profile}
    />
  );
}
