import { Link } from "react-router-dom"

import { useApi } from "../api/useApi"
import {useAuth} from "../auth/useAuth.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function LogoutButton() {

  const api = useApi()

  const handleLogout = async () => {
    try {
      await api.request(`${API_URL}/users/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${useAuth.getState().accessToken}`
        }
      });
    } catch (err) {
      console.log("Backend logout failed, clearing frontend anyway");
    }

    // Clear frontend tokens
    useAuth.getState().setAuth({
      user: null,
      accessToken: null,
      refreshToken: null
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refresh");
    localStorage.removeItem("access");

    // Reload the page so RTK Query re-checks /users/me/
    window.location.reload();
  };

  return (
    <Link style={{ color: "white", textDecoration: "none" }} onClick={handleLogout}>
      Logout
    </Link>
  );
}

export default LogoutButton;
