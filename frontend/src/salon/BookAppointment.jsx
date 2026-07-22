import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";

import { useApi } from "../api/useApi"
import {useAuth} from "../auth/useAuth.jsx";

import {useSidebar} from "../ui/useSidebar.js";

import "../styles/home.css"

const API_URL = import.meta.env.VITE_API_URL;

export default function BookAppointment() {

  const closeSidebar = useSidebar(state => state.closeSidebar);
  const api = useApi();
  const navigate = useNavigate();
  const user = useAuth(s => s.user);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editId = params.get("edit");
  const initialDate = params.get("date"); // "2026-07-19"
  const initialTime = params.get("time"); // "17:00"

  const [services, setServices] = useState([])
  const [stylists, setStylists] = useState([])
  const [serviceId, setServiceId] = useState("")
  const [stylistId, setStylistId] = useState("")
  const [date, setDate] = useState(initialDate ?? "")

  const [slots, setSlots] = useState([])
  const [editedSlots, setEditedSlots] = useState([])
  const [slot, setSlot] = useState(initialTime ?? "")
  const [notes, setNotes] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
      closeSidebar();   // auto-close on page load
  }, []);

  useEffect(() => {
    api.request(`${API_URL}/salon/services/`)
      .then(res => { if (res.ok) setServices(res.data); });
  }, []);

  useEffect(() => {
    api.request(`${API_URL}/salon/stylists/`)
      .then(res => { if (res.ok) setStylists(res.data); });
  }, []);

  useEffect(() => {
    if (!date || !serviceId || !stylistId) return
    fetch(
      `${API_URL}/salon/timeslots/?date=${date}&service=${serviceId}&stylist=${stylistId}`
    )
      .then(r => r.json())
      .then(d => (
          setSlots(d.available_slots || [])
      ))
  }, [date, serviceId, stylistId])

  useEffect(() => {
    if (!editId) return;

    api.request(`${API_URL}/salon/appointments/${editId}/`)
      .then(res => {
        if (res.ok) {
          const appt = res.data;

          // appt.date example: "2026-07-20T12:00:00Z" or "2026-07-20T12:00:00"
          const [datePart, timePartRaw] = appt.date.split("T");

          // Remove seconds + timezone if present
          const timePart = timePartRaw.slice(0, 5); // "12:00"

          // Now you have EXACT database values
          const htmlDate = datePart;   // "2026-07-20"
          const htmlTime = timePart;   // "12:00"

          // For <input type="time">
          const hh = htmlTime.split(":")[0];
          const min = htmlTime.split(":")[1];

          const tempSlots = [];
          const duration = Number(appt.service.duration);
          const durationMin = 60.0 * (Number(duration) - Math.trunc(duration)) / 1.0;

          // Initialize times (e.g., timeA and timeB PM on today's date)
          let timeA = new Date(appt.date);
          timeA.setHours(hh, min, 0, 0);

          let timeB = new Date(appt.date);
          timeB.setHours((Number(hh) + Math.trunc(duration)), durationMin, 0, 0);

          let hrsCount = null;
          let minCount = null;

          while (timeA < timeB) {
            hrsCount = String(timeA.getHours()).padStart(2, "0");
            minCount = String(timeA.getMinutes()).padStart(2, "0");
            tempSlots.push(`${hrsCount}:${minCount}`)
            // Add 30 minutes (30 mins * 60 seconds * 1000 milliseconds)
            timeA.setTime(timeA.getTime() + 30 * 60 * 1000);
          }

          setDate(htmlDate);
          setSlot(htmlTime);

          setServiceId(appt.service.id);
          setStylistId(appt.stylist.id);
          setNotes(appt.notes);
          setEditedSlots(tempSlots);
        }
      });
  }, [editId]);

  const handleSubmit = async e => {
    e.preventDefault()

    setMessage("")

    const access = useAuth.getState().accessToken;

    let res = null;

    if (editId) {
      // UPDATE

      res = await api.request(`${API_URL}/salon/appointments/${editId}/`, {
        method: "PUT",
        body: JSON.stringify({
          date: `${date} ${slot}`,
          notes,
          service_id: serviceId,
          stylist_id: stylistId,
          user: user.id
        })
      });
    } else {
      // CREATE

      res = await api.request(`${API_URL}/salon/appointments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`
        },
        body: JSON.stringify({
          date: `${date} ${slot}`,
          notes,
          service_id: serviceId,
          stylist_id: stylistId,
          user: user.id
        })
      })
    }

    if (!res.ok) {
      if (res.data.detail) {
        setMessage(res.data.detail)
      } else {
        setMessage("Failed to create appointment:", res.data)
      }
      return
    }

    if (res.ok) {
      // Clear form
      setServiceId("");
      setStylistId("");
      setDate("");
      setNotes("");
      setSlot("")
      setMessage("Your appointment has been successfully scheduled.");

      if (editId) navigate("/appointments");
    }
  }

  const combineSorts = (list1, list2) => {
    const combinedSlot = [...new Set([...list1, ...list2])].sort((a, b) => a - b);
    return combinedSlot;
  };
  
  return (
      <>
        <div className="booking-card">
          <h2 className="booking-title">Book Appointment</h2>
          <form className="booking-form" onSubmit={handleSubmit}>
            <select
                className="booking-input"
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
            >
              <option value="">Select service</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.price} SAR)</option>
              ))}
            </select>

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

            <input
                className="booking-input"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
            />

            <select
                className="booking-input"
                value={slot}
                onChange={e => setSlot(e.target.value)}
            >
              <option value="">Select time</option>
              {
                combineSorts(slots, editedSlots).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))
              }
            </select>

            <textarea
                className="booking-input"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notes"
            />

            <button className="booking-submit" type="submit">
              {editId ? "Save Changes" : "Create Appointment"}
            </button>
          </form>
          <p>{message}</p>
        </div>

        {message && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Appointment Booking</h3>
              <p>{message}</p>

              <button className="modal-close" onClick={() => setMessage("")}>
                OK
              </button>
            </div>
          </div>
        )}
      </>

  )
}
