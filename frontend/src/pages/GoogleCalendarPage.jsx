// src/pages/GoogleCalendarPage.jsx
import {useState, useEffect, useContext} from "react";
import { useNavigate } from "react-router-dom";

import { Calendar, Views } from "react-big-calendar";
import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";

import { useApi } from "../api/useApi.jsx";
import { useAuth } from "../auth/useAuth.jsx";

import "../styles/calendar.css";
import "../styles/home.css"
import ReviewsContext from "../context/ReviewsProvider.jsx";

const locales = { "en-US": enUS };
const API_URL = import.meta.env.VITE_API_URL;

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

export default function GoogleCalendarPage() {

  const api = useApi();
  const user = useAuth(s => s.user);
  const navigate = useNavigate();

  const {
        setOpenReviews
  } = useContext(ReviewsContext);

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState(Views.WEEK);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  // Call Appointments to get the bookings information
  useEffect(() => {
    if (!user) return;

    api.request(`${API_URL}/salon/appointments/`)
      .then(res => {
        if (!res.ok) return;

        const data = res.data;

        const mapped = data.map(appt => {
          // Backend format: "2026-07-19T17:00:00Z" or "2026-07-19T17:00:00"
          const [datePart, timePartRaw] = appt.date.split("T");

          // Extract HH:MM without seconds or timezone
          const [hourStr, minuteStr] = timePartRaw.split(":");

          const year = Number(datePart.slice(0, 4));
          const month = Number(datePart.slice(5, 7)) - 1; // JS months are 0-based
          const day = Number(datePart.slice(8, 10));
          const hour = Number(hourStr);
          const minute = Number(minuteStr);

          // Construct a local Date object WITHOUT timezone conversion
          const startDate = new Date(year, month, day, hour, minute);

          // Duration in hours → convert to ms
          const durationHours = appt.service?.duration ?? 1;
          const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

          return {
            id: appt.id,
            title: `${appt.service?.name ?? "Unknown Service"} – ${appt.stylist?.name ?? "Unknown Stylist"}`,
            start: startDate,
            end: endDate,
            isMine: appt.user === user?.id,
            service: appt.service,
            stylist: appt.stylist,
            notes: appt.notes
          };
        });

        setEvents(mapped);
      });
  }, [user]);

  // ⭐ Click‑to‑create booking
  const handleSlotSelect = slotInfo => {
    const start = slotInfo.start;

    const yyyy = start.getFullYear();
    const mm = String(start.getMonth() + 1).padStart(2, "0");
    const dd = String(start.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const hh = String(start.getHours()).padStart(2, "0");
    const min = String(start.getMinutes()).padStart(2, "0");
    const timeStr = `${hh}:${min}`;

    navigate(`/book?date=${dateStr}&time=${timeStr}`);
  };

  const eventPropGetter = event => {
    if (event.isMine) {
      return {
        style: {
          backgroundColor: "#1a73e8",
          color: "white",
          borderRadius: "4px",
          border: "none",
          padding: "2px 4px",
          fontSize: "12px"
        }
      };
    }
    return {
      style: {
        backgroundColor: "#e8eaed",
        color: "#3c4043",
        borderRadius: "4px",
        padding: "2px 4px",
        fontSize: "12px"
      }
    };
  };

  const goPrev = () => {
    if (view === Views.MONTH) {
      setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    } else {
      setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
    }
  };
  const goNext = () => {
    if (view === Views.MONTH) {
      setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    } else {
      setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
    }
  };

  const closePopup = () => setSelectedEvent(null);

  const handleEdit = () => {
    if (!selectedEvent.isMine) return

    navigate(`/book?edit=${selectedEvent.id}`);
  };

  const handleDelete = async () => {
    if (!selectedEvent || !selectedEvent.isMine) return;

    const confirmed = window.confirm("Delete this appointment?");
    if (!confirmed) return;

    const res = await api.request(`${API_URL}/salon/appointments/${selectedEvent.id}/`, {
      method: "DELETE"
    });

    if (res.ok) {
      // Remove from calendar
      setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
      setSelectedEvent(null);
    }
  };

  return (
      <>
        <div className="gc-app">
          {/* Top bar */}
          <header className="gc-topbar">
            <div className="gc-logo">{`${user?.first_name ? user.first_name : "Your"} Appointments`}</div>
            <div className="gc-topbar-right">
              <button className="gc-topbar-btn">Today</button>
              <button className="gc-topbar-btn" onClick={goPrev}>←</button>
              <button className="gc-topbar-btn" onClick={goNext}>→</button>
              <span className="gc-topbar-title">
                {format(selectedDate, "MMMM yyyy")}
              </span>
              <div className="gc-view-toggle">
                <button
                  className={`gc-view-btn ${view === Views.DAY ? "gc-view-btn-active" : ""}`}
                  onClick={() => setView(Views.DAY)}
                >
                  Day
                </button>
                <button
                  className={`gc-view-btn ${view === Views.WEEK ? "gc-view-btn-active" : ""}`}
                  onClick={() => setView(Views.WEEK)}
                >
                  Week
                </button>
                <button
                  className={`gc-view-btn ${view === Views.MONTH ? "gc-view-btn-active" : ""}`}
                  onClick={() => setView(Views.MONTH)}
                >
                  Month
                </button>
              </div>
            </div>
          </header>

          <div className="gc-body">
            {/* Left sidebar */}
            <aside className="gc-sidebar">
              <button className="gc-create-btn" onClick={() => navigate("/book")}>+ Create</button>

              <div className="gc-section">
                <div className="gc-section-title">My calendars</div>
                <label className="gc-calendar-item">
                  <span className="gc-calendar-color gc-calendar-color-blue" />
                  <span>Appointments</span>
                </label>
                <label className="gc-calendar-item">
                  <span className="gc-calendar-color gc-calendar-color-green" />
                  <span>Personal</span>
                </label>
              </div>

              <button className="gc-rate-btn" onClick={() => setOpenReviews(true)}>Rate Us</button>
            </aside>

            {/* Main content */}
            <main className="gc-main">
              {/* Main calendar */}
              <div className="gc-main-calendar">
                <Calendar
                  localizer={localizer}
                  events={events}
                  date={selectedDate}
                  onNavigate={date => setSelectedDate(date)}
                  view={view}
                  onView={setView}
                  selectable
                  defaultView={Views.WEEK}
                  eventPropGetter={eventPropGetter}

                  onSelectEvent={(event, e) => {
                    if (!selectedEvent?.isMine && !user.is_staff) return

                    const rect = e.target.getBoundingClientRect();
                    setPopupPos({ x: rect.right + 10, y: rect.top });
                    setSelectedEvent(event);
                  }}
                  style={{ height: "70vh" }}

                  onSelectSlot={handleSlotSelect}
                />
              </div>

              {/* Right mini month */}
              <div className="gc-right-panel">
                <div className="gc-mini-calendar">
                  <Calendar
                    localizer={localizer}
                    date={selectedDate}
                    onNavigate={date => setSelectedDate(date)}
                    events={events}
                    view={Views.MONTH}
                    toolbar={false}
                    selectable={false}
                  />
                </div>
                <div className="gc-legend">
                  <div><span className="gc-dot gc-dot-blue" /> Your events</div>
                  <div><span className="gc-dot gc-dot-gray" /> Other events</div>
                </div>
              </div>
            </main>

            {selectedEvent && (
              <>
                <div
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={closePopup}
                />

                <div
                  className="absolute z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-4"
                  style={{
                    top: popupPos.y,
                    left: popupPos.x,
                    width: "260px"
                  }}
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedEvent.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Start:</strong> {selectedEvent.start.toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-700 mb-1">
                    <strong>End:</strong> {selectedEvent.end.toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Service:</strong> {selectedEvent.service?.name ?? "N/A"}
                  </p>

                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Stylist:</strong> {selectedEvent.stylist?.name ?? "N/A"}
                  </p>

                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Notes:</strong> {selectedEvent.notes ?? "None"}
                  </p>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="booking-delete"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>

                    <button
                      className="booking-submit"
                      onClick={handleEdit}
                    >
                      Edit
                    </button>

                    <button
                      className="booking-submit"
                      onClick={closePopup}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>

  );
}
