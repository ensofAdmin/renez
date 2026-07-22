import { useEffect } from "react";

import { useApi } from "../api/useApi.jsx";
import { useAuth } from "../auth/useAuth.jsx";

import "../styles/home.css"

const API_URL = import.meta.env.VITE_API_URL;

export default function ServicesForm(
    {
      setModalData, form, setForm, error, setError, services, loadServices, setConfirmDelete
    }) {
  const api = useApi();
  const accessToken = useAuth(state => state.access);

  useEffect(() => {
    if (!accessToken) return;
    loadServices();
  }, [accessToken]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    // Check for duplicate service name
    const existing = services.find(
      s => s.name.toLowerCase() === form.name.toLowerCase()
    );

    if (existing) {
      setModalData(existing);
      return;
    }

    const res = await api.request(`${API_URL}/salon/services/`, {
      method: "POST",
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

    setForm({ name: "", duration: "", price: "" });
    await loadServices();
  };

  if (!Array.isArray(services)) {
    return <div>Loading services...</div>;
  }

  return (
      <div className="dashboard-grid">
        <div className="booking-card">
          <h2 className="booking-title">Manage Services</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form className="booking-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Service Name"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              className="booking-input"
              required
            />

            <input
              type="number"
              name="duration"
              placeholder="Duration (hours)"
              value={form.duration}
              onChange={e => handleChange("duration", e.target.value)}
              className="booking-input"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price (SAR)"
              value={form.price}
              onChange={e => handleChange("price", e.target.value)}
              className="booking-input"
              required
            />

            <button type="submit" className="booking-submit">
              Save Service
            </button>
          </form>

          <h3 style={{ marginTop: "30px" }}>Available Services</h3>

          {!Array.isArray(services) || services.length === 0 ? (
            <p>No services found.</p>
          ) : (
            <ul className="services-list">
              {Array.isArray(services) && services.map(s => (
                <li key={s.id} className="service-item">
                  <span className="service-text">
                    {s.name} — {s.duration} mins — {s.price} SAR
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => setConfirmDelete({ open: true, service: s })}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
  );
}
