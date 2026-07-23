import { useAuth } from "../auth/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest(url, options = {}) {
  // Always read fresh values
  const auth = useAuth.getState();
  let access = auth.access;
  let refresh = auth.refresh;

  // Build headers (Authorization ALWAYS last)
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    ...(access ? { Authorization: `Bearer ${access}` } : {})
  };

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: "include"
  });

  // If expired → refresh
  if (res.status === 401 && refresh) {
    const refreshRes = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh })
    });

    const refreshText = await refreshRes.text();
    let refreshData = null;

    try {
      refreshData = JSON.parse(refreshText);
    } catch {}

    if (!refreshRes.ok || !refreshData?.access) {
      console.warn("Refresh failed, keeping user logged in.");
      return { ok: false, status: 401, data: null };
    }

    // ⭐ Update local + global access token
    access = refreshData.access;
    auth.setAuth({ access, refresh });
    localStorage.setItem("access", access);

    // Retry original request with NEW token
    const retryHeaders = {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`
    };

    res = await fetch(url, {
      ...options,
      headers: retryHeaders,
      credentials: "include"
    });
  }

  // Safe JSON parsing
  const text = await res.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { ok: res.ok, status: res.status, data };
}

export function useApi() {
  return { request: apiRequest };
}
