import axios from "axios";
import { useAuthStore } from "../auth/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(config => {
  const access = useAuthStore.getState().access;
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;

    // If expired token → try refresh
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const { refreshTokens } = useAuthStore.getState();
      const newAccess = await refreshTokens();

      if (!newAccess) {
        const { logout } = useAuthStore.getState();
        logout();
        window.location.href = "/login";
        return;
      }

      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    }

    return Promise.reject(error);
  }
);

export default api;
