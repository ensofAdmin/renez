import { useNavigate } from "react-router-dom";

import { useGetMyAppointmentsQuery } from "../store/api";

function MyAppointments() {

  const navigate = useNavigate();

  const { data: appointments, isLoading } = useGetMyAppointmentsQuery();

  if (isLoading) return <p>Loading...</p>;

  if (!appointments) return <p>No appointments found.</p>;

  const handleCancel = async (id) => {
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;

    const response = await fetch(`http://localhost:8000/appointments/${id}/cancel/`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      alert("Appointment canceled");
      window.location.reload();
    } else {
      alert("Failed to cancel appointment");
    }
  };

  return (
    <div>
      <h1>My Appointments</h1>

      {appointments.map((a) => (
        <div key={a.id} style={{ border: "1px solid #ccc", margin: "10px" }}>
          <p><strong>Service:</strong> {a.service}</p>
          <p><strong>Stylist:</strong> {a.stylist}</p>
          <p><strong>Date:</strong> {a.date}</p>
          <p><strong>Notes:</strong> {a.notes}</p>

          <button onClick={() => navigate(`/appointments/${a.id}/edit`)}>
            Edit
          </button>

          <button onClick={() => handleCancel(a.id)}>
            Cancel Appointment
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyAppointments;
