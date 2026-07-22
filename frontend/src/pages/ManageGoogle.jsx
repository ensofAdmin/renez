// src/pages/ManageGoogle.jsx
import { useAuth } from "../auth/useAuth"
import { useApi } from "../api/useApi"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function ManageGoogle() {
  const user = useAuth(s => s.user)
  const updateUser = useAuth(s => s.actions.updateUser)
  const api = useApi()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const googleLinked = user?.authProvider === "google"

  async function unlinkGoogle() {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const res = await api.request("/users/google/unlink/", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })

    if (!res.ok) {
      setError("Failed to unlink Google account")
      setLoading(false)
      return
    }

    updateUser({ authProvider: null })

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Manage Google Account</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Google account unlinked</p>}

      <div style={{ marginBottom: "30px" }}>
        <h3>Status</h3>

        {googleLinked ? (
          <>
            <p style={{ color: "green" }}>Google account is linked</p>
            <p><strong>Email:</strong> {user?.email}</p>

            <button
              onClick={unlinkGoogle}
              disabled={loading}
              style={{
                marginTop: "10px",
                padding: "10px 16px",
                background: "#d9534f",
                color: "#fff",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              {loading ? "Unlinking..." : "Unlink Google Account"}
            </button>
          </>
        ) : (
          <>
            <p style={{ color: "red" }}>Google account not linked</p>

            <Link
              to="/login/google"
              style={{
                display: "inline-block",
                marginTop: "10px",
                padding: "10px 16px",
                background: "#007bff",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none"
              }}
            >
              Link Google Account
            </Link>
          </>
        )}
      </div>

      <hr />

      <p style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        You can still log in using your password or face recognition even if Google is unlinked.
      </p>
    </div>
  )
}
