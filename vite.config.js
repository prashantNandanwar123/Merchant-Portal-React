import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The dev-server proxy target comes from .env (VITE_API_PROXY_TARGET) instead of a
// hard-coded private IP address.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://192.168.29.144:8091",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
