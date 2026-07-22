import {useEffect, useState} from "react";

import {useAuth} from "../auth/useAuth.jsx";

import "../styles/home.css";
import {useApi} from "../api/useApi.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewModal(
    {
        open, rating, setRating, comment, setComment,
        serviceId, setServiceId, services, setServices, stylistId, setStylistId, stylists, setStylists,
        appointmentId, setAppointmentId, appointments, setAppointments,

        onClose
    }
) {

    const api = useApi();
    const user = useAuth(s => s.user);

    const [message, setMessage] = useState("")

    useEffect(() => {
      api.request(`${API_URL}/salon/services/`)
        .then(res => { if (res.ok) setServices(res.data); });
    }, []);

    useEffect(() => {
      api.request(`${API_URL}/salon/stylists/`)
        .then(res => { if (res.ok) setStylists(res.data); });
    }, []);

    useEffect(() => {
      api.request(`${API_URL}/salon/appointments/`)
        .then(res => { if (res.ok) setAppointments(res.data); });
    }, []);

    if (!open) return null

    const submitReview = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!appointmentId) {
            setMessage("Please select an appointment.");
            return;
        }

        if (!stylistId) {
            setMessage("Please select a stylist.");
            return;
        }

        if (!serviceId) {
            setMessage("Please select a service.");
            return;
        }

        const res = await api.request(`${API_URL}/salon/reviews/upsert/`, {
            method: "POST",
            body: JSON.stringify({
                rating,
                comment,
                service: serviceId,
                stylist: stylistId,
                appointment: appointmentId,
                user: user.id
            })
        });

        if (res.ok) {
            setRating(5);
            setComment("");
            setServiceId("");
            setStylistId("");
            setAppointmentId("");
            setMessage("Thank you. Your feedback is valuable.");
        } else {
            setMessage("Could not save review.");
        }
    };

    return (
    <div className="modal-overlay" style={{overflowY: "auto"}}>
      <div className="modal-container">
        <h2>Leave a Review</h2>

        <p>{message}</p>

        <form className="modal-form" onSubmit={submitReview}>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(n => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  style={{
                    fontSize: "40px",
                    cursor: "pointer",
                    userSelect: "none",
                    color: rating >= n ? "#fbbf24" : "#d1d5db"   // ⭐ Fallback color
                  }}
                  className={
                    rating >= n
                      ? "text-amber-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <select
                className="booking-input"
                value={stylistId}
                onChange={e => setStylistId(e.target.value)}
            >
              <option value="">Select stylist</option>
              {stylists.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
                className="booking-input"
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
            >
              <option value="">Select service</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
                className="booking-input"
                value={appointmentId}
                onChange={e => setAppointmentId(e.target.value)}
            >
              <option value="">Select appointment date</option>
              {appointments.map(s => (
                <option key={s.id} value={s.id}>
                    {`${s.date.split("T")[0]} ${s.date.split("T")[1].slice(0, 5)}`}
                </option>
              ))}
            </select>

            <textarea
              className="booking-input"
              placeholder="Write your comments..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />

          <button type={"submit"} className="booking-submit">
            Submit Review
          </button>

          <button type="button" className="modal-close" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
    )
}
