import "../styles/home.css"
import { useState } from "react"

const API_URL = import.meta.env.VITE_API_URL;

export default function RegistrationModal({ open, onClose }) {
  if (!open) return null

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: ""
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const res = await fetch(`${API_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (res.ok) {
      alert("Registration successful!")
      onClose()
    } else {
      alert("Registration failed: " + JSON.stringify(data))
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Create Account</h2>

        <form className="modal-form" onSubmit={handleSubmit}>

          <div className="floating-group">
            <input
                type="text"
                id="first_name"
                placeholder=" "
                value={form.first_name}
                onChange={handleChange}
                required
            />
            <label htmlFor="first_name">First Name</label>
          </div>

          <div className="floating-group">
            <input
                type="text"
                id="last_name"
                placeholder=" "
                value={form.last_name}
                onChange={handleChange}
            />
            <label htmlFor="last_name">Last Name</label>
          </div>

          <div className="floating-group">
            <input
                id="email"
                type="email"
                placeholder=" "
                value={form.email}
                onChange={handleChange}
                required
            />
            <label htmlFor="email">Email</label>
          </div>

          <div className="floating-group">
            <input
                type="text"
                id="username"
                placeholder=" "
                value={form.username}
                onChange={handleChange}
                required
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="floating-group">
            <input
                type="password"
                id="password"
                placeholder=" "
                value={form.password}
                onChange={handleChange}
                required
            />
            <label htmlFor="password">Password</label>
          </div>

          <button type="submit" className="modal-submit">
            Register
          </button>

          <button type="button" className="modal-close" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  )
}
