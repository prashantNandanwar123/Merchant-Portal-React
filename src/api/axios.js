import axios from "axios";
import { toast } from "react-toastify";
import { clearSession, loginPathFor, readSession } from "../utils/session";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 20000,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

// Endpoints where a 401/403 means "wrong credentials / not allowed", NOT "session expired".
// (Bug fix: a wrong password used to show "Session expired" and bounce the user.)
const AUTH_URL = /(login|submitLogin|forgot|otp|signup|resetPassword)/i;

const messageFrom = (error) => {
  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  return data?.respMsg || data?.message || null;
};

// Always rejects with an Error whose .message is a plain string, so
// toast.error(getErrorMessage(err)) can never receive an object.
const fail = (error, message, extra = {}) =>
  Promise.reject(
    Object.assign(new Error(message), {
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
      ...extra,
    }),
  );

const endSession = (message) => {
  const role = readSession()?.role;
  clearSession();
  toast.error(message, { toastId: "session-ended" });
  // HashRouter: change the hash instead of reloading the whole page.
  window.location.hash = `#${loginPathFor(role)}`;
};

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const isAuthCall = AUTH_URL.test(error.config?.url || "");
    const serverMessage = messageFrom(error);

    if (status === 401 && !isAuthCall) {
      endSession("Session expired. Please log in again.");
      return fail(error, "Session expired");
    }
    if (status === 403 && !isAuthCall) {
      endSession(serverMessage || "Access denied. Please log in again.");
      return fail(error, "Access denied");
    }
    // Bug fix: HTTP 429 (rate limit) used to wipe the saved session without redirecting.
    if (status === 429) {
      return fail(error, serverMessage || "Too many requests. Please try again later.");
    }
    if (error.code === "ECONNABORTED") {
      return fail(error, "Request timed out. Please try again.");
    }
    if (!error.response) {
      return fail(error, "Unable to reach the server. Check your connection and try again.");
    }
    return fail(error, serverMessage || error.message || "Something went wrong");
  },
);

export default axiosInstance;
