import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {Services, Stylists} from "../utils/salonAttributes.jsx";

function EditAppointment() {
  const { id } = useParams();                   // useParams() gets the appointment ID from the URL

  const [service, setService] = useState("");
  const [stylist, setStylist] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadAppointment() {
      const response = await fetch(`http://localhost:8000/appointments/${id}/`, {
        credentials: "include",
      });

      const data = await response.json();

      setService(data.service);
      setStylist(data.stylist);
      setDate(data.date);
      setNotes(data.notes);
    }

    loadAppointment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a date.");
      return;
    }

    // Prevent past dates
    const selectedDate = new Date(date);
    const now = new Date();

    if (selectedDate < now) {
        alert("You cannot book an appointment in the past.");
        return;
    }

    if (!service) {
      alert("Please select a service.");
      return;
    }

    if (!stylist) {
      alert("Please select a stylist.");
      return;
    }

    const response = await fetch(`http://localhost:8000/appointments/${id}/edit/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        service,
        stylist,
        date,
        notes,
      }),
    });

    if (response.ok) {
      alert("Appointment updated!");
      window.location.href = "/appointments";
    } else {
      alert("Failed to update appointment");
    }
  };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Edit Appointment</h1>

            <label>Service</label>
            <select
                value={service}
                onChange={(e) => setService(e.target.value)}
            >
                <option value="">Select a service</option>
                {
                    Object.keys(Services).map((val, index) => (
                        <option key={`service-${index}`} value={val}>{val}</option>
                    ))
                }
            </select>

            <label>Stylist</label>
            <select
                value={stylist}
                onChange={(e) => setStylist(e.target.value)}
            >
                <option value="">Select a stylist</option>
                {
                    Stylists.map((item, index) => (
                        <option key={`stylist-${index}`} value={item}>{item}</option>
                    ))
                }
            </select>

            <label>Date</label>
            <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <label>Notes</label>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />

            <button type="submit">Save Changes</button>
        </form>
    );
}

export default EditAppointment;
