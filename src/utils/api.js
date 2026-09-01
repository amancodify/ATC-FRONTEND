/**
 * Global axios setup for the multi-tenant API.
 * ────────────────────────────────────────────
 * 1. Attaches the JWT as an Authorization header on every request
 *    (cookies alone are unreliable cross-origin with SameSite=Lax).
 * 2. Auto-logout on expired/invalid sessions (401) or suspended company
 *    (403), except on admin pages (handled locally) and AI endpoints
 *    (403 there just means the feature is not enabled).
 */
import axios from "axios";
import cookie from "js-cookie";
import { logout } from "./auth";

axios.interceptors.request.use((config) => {
  const token = cookie.get("_rtok");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response && error.response.status;
    const url = (error.config && error.config.url) || "";
    const path = window.location.pathname || "";
    const onAdminPages = path.startsWith("/admin");
    const onAuthPages = path.startsWith("/login") || path.startsWith("/admin/login");

    if (cookie.get("_rtok") && !onAdminPages && !onAuthPages) {
      const isSessionInvalid = status === 401;
      const isSuspended = status === 403 && !url.includes("/ai");
      if (isSessionInvalid || isSuspended) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
