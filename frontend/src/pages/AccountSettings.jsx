// src/pages/AccountSettings.jsx
import { Link } from "react-router-dom"
import { useAuth } from "../auth/useAuth"

export default function AccountSettings() {
  const user = useAuth(s => s.user)
  const logout = useAuth(s => s.actions.logout)

  const faceEnrolled = user?.faceEnrolled === true
  const googleLinked = user?.authProvider === "google"

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
      <h2 style={{ marginBottom: "20px" }}>Account Settings</h2>

      {/* User Info */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Your Profile</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>User ID:</strong> {user?.id}</p>
      </div>

      <hr />

      {/* Face Enrollment Status */}
      <div style={{ margin: "30px 0" }}>
        <h3>Face Recognition</h3>

        {faceEnrolled ? (
          <p style={{ color: "green" }}>Your face is enrolled</p>
        ) : (
          <p style={{ color: "red" }}>Face not enrolled</p>
        )}

        {!faceEnrolled && (
          <Link
            to="/account/enroll-face"
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "10px 16px",
              background: "#222",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none"
            }}
          >
            Enroll Face
          </Link>
        )}
      </div>

      <hr />

      {/* Google OAuth Status */}
      <div style={{ margin: "30px 0" }}>
        <h3>Google Account</h3>

        {googleLinked ? (
          <p style={{ color: "green" }}>Google account linked</p>
        ) : (
          <p style={{ color: "red" }}>Google not linked</p>
        )}

        {!googleLinked && (
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
        )}
      </div>

      <hr />

      {/* Logout */}
      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "#d9534f",
          color: "#fff",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  )
}
