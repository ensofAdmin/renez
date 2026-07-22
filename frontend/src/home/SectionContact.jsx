// src/home/SectionContact.jsx
import { useEffect, useRef, useState } from "react"
import {useApi} from "../api/useApi.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function SectionContact() {
  const api = useApi()

  const bgRef = useRef(null)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  })

  // Parallax background
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.2
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${offset}px) scale(1.1)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleChange = e => {

    const { name, value } = e.target;

    // Limit message to 200 characters
    if (name === "message" && value.length > 200) return;

    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message
      }
      await api.request(`${API_URL}/salon/guest-contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": ""   // ⭐ override JWT header
        },
        body: JSON.stringify(payload)
      });

      alert("Your request has been sent!");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: ""
      });

    } catch (error) {
      alert(`Something went wrong: ${String(error)}`);
    }
  };


  return (
    <section id="section3" className="section section-contact">
      <div ref={bgRef} className="section-bg"/>

      <div className="contact-vertical-label">
        <span>We're in Dammam</span>
      </div>

      <div className="contact-card">
        <h2 className="contact-title">Contact Renez</h2>

        <p className="contact-subtitle">
          Request more information or ask about available services.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message (max 200 characters)"
            value={form.message}
            onChange={handleChange}
            maxLength={200}
            className="contact-message"
            rows={4}
          />

          <button type="submit" className="contact-submit">
            Submit
          </button>
        </form>

        <p className="contact-phone">
          Contact Renez directly: <strong>+966‑059‑746-0185</strong>
        </p>
      </div>
    </section>
  )
}
