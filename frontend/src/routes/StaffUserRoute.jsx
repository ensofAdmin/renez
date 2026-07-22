// src/routes/SuperuserRoute.jsx
import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/useAuth"

export default function StaffUserRoute({ children }) {
  const user = useAuth(s => s.user)

  // If no user → redirect to login
  if (!user) return <Navigate to="/" replace />

  // If no user → redirect to login
  if (!user.is_staff) return <Navigate to="/" replace />

  return children
}
