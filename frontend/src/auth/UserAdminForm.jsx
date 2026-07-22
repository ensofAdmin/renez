import {useEffect, useState} from "react";

import { useApi } from "../api/useApi.jsx";
import { useAuth } from "../auth/useAuth.jsx";

import "../styles/home.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function UserAdminForm () {
    const api = useApi();
    const accessToken = useAuth(state => state.access);

    const [error, setError] = useState("");
    const [form, setForm] = useState({
        first_name: "", last_name: "", email: "", is_superuser: false, is_staff: false, role: ""
    });
    const [users, setUsers] = useState([]);

    const handleChange = (key, value) => {
      setForm(prev => {
        const updated = { ...prev, [key]: value };

        if (key === "email") {
          const existingUser = users.find(
            u => u.email.toLowerCase() === value.toLowerCase()
          );
          if (existingUser) {
            return {
              ...updated,
              first_name: existingUser.first_name ?? "",
              last_name: existingUser.last_name ?? "",
              is_superuser: existingUser.is_superuser,
              is_staff: existingUser.is_staff,
              role: existingUser.role ?? "",
            };
          }
        }

        return updated;
      });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        const existingUser = users.find(s => s.email.toLowerCase() === form.email.toLowerCase());

        if (!existingUser) {
          setError("The user details are not in the database");
          return;
        }

        const res = await api.request(`${API_URL}/users/${existingUser.id}/role/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(form),
        });

        if (!res.ok) {
          setError(res.data?.detail || "Failed to create service.");
          return;
        }

        setForm({ first_name: "", last_name: "", email: "", is_superuser: false, is_staff: false, role: "" });
        await loadUsers();
    };

    const loadUsers = () => {

        api.request(`${import.meta.env.VITE_API_URL}/users/all/`)
          .then(res => {
            if (res.ok) setUsers(res.data);
          });
    };

    useEffect(loadUsers, []);

    return (
      <div className="dashboard-grid">
        <div className="booking-card">
          <h2 className="booking-title">Manage Users</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form className="booking-form" onSubmit={handleSubmit}>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email ?? ""}
              onChange={e => handleChange("email", e.target.value)}
              className="booking-input"
            />

            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={form.first_name ?? ""}
              onChange={e => handleChange("first_name", e.target.value)}
              className="booking-input"
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name ?? ""}
              onChange={e => handleChange("last_name", e.target.value)}
              className="booking-input"
            />

            <select
              name="is_superuser"
              value={String(form.is_superuser)}
              onChange={e => handleChange("is_superuser", e.target.value === "true")}
            >
              <option value="">Select status</option>
              <option value="true">Superuser</option>
              <option value="false">Not a superuser</option>
            </select>

            <select
              name="is_staff"
              value={String(form.is_staff)}
              onChange={e => handleChange("is_staff", e.target.value === "true")}
            >
              <option value="">Select status</option>
              <option value="true">Staff</option>
              <option value="false">Not a staff</option>
            </select>

            <input
              type="text"
              name="role"
              placeholder="Role"
              value={form.role ?? ""}
              onChange={e => handleChange("role", e.target.value)}
              className="booking-input"
            />

            <button type="submit" className="booking-submit">
              Update User
            </button>
          </form>
        </div>
      </div>
  );
};