import axios from "axios";
import { toast } from "react-toastify";


const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// ---------------- REQUEST INTERCEPTOR ----------------
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- RESPONSE INTERCEPTOR ----------------
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    if (status === 429) {
      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
      return Promise.reject(
        "Too many requests. Please try again later."
      );
    }
    if (status === 403) {
      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
      toast.error("Access Denied");
      setTimeout(() => {
        window.location.href = "/";
      }, 200);
      return Promise.reject(error);
    }
    if (status === 401) {
      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
      toast.error("Session expired. Please Login Again.");
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return Promise.reject(error);
    }
    return Promise.reject(
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Something went wrong"
    );
  }
);

export default axiosInstance;