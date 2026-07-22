import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useApi } from "../api/useApi"

export default function AppointmentDetails() {
  const { id } = useParams()
  const api = useApi()
  const [appt, setAppt] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    api.request(`/salon/appointments/${id}/`).then(async res => {
      if (!res.ok) return
      setAppt(await res.json())
    })
  }, [id])

  const cancel = async () => {
    const res = await api.request(`/salon/appointments/${id}/cancel/`, {
      method: "POST"
    })
    if (!res.ok) {
      setMessage("Failed to cancel")
      return
    }
    setMessage("Cancelled")
  }

  if (!appt) return <p>Loading...</p>

  return (
    <div>
      <h2>Appointment Details</h2>
      <p>{appt.date} {appt.start_time}</p>
      <p>Service: {appt.service?.name}</p>
      <p>Stylist: {appt.stylist?.name}</p>
      <p>Notes: {appt.notes}</p>
      <p>Cancelled: {appt.cancelled ? "Yes" : "No"}</p>
      {!appt.cancelled && <button onClick={cancel}>Cancel</button>}
      <p>{message}</p>
    </div>
  )
}
