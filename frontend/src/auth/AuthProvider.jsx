// src/auth/AuthProvider.jsx
import { useEffect } from "react";
import { useAuth } from "./useAuth";

export default function AuthProvider({ children }) {
  const login = useAuth((s) => s.login);
  const logout = useAuth((s) => s.logout);

  useEffect(() => {
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");
    const savedUser = localStorage.getItem("user");

    // Prevent crashes from "undefined" or invalid JSON
    const safeParse = (value) => {
      if (!value || value === "undefined" || value === "null") return null;
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    };

    const parsedUser = safeParse(savedUser);

    if (savedAccess && savedRefresh) {
      login(savedAccess, savedRefresh, parsedUser);
    } else {
      logout();
    }
  }, []);

  return children;
}
