// src/pages/Dashboard.jsx
import { Link } from "react-router-dom"
import { useAuth } from "../auth/useAuth"

export default function Dashboard() {
  const user = useAuth(s => s.user)

  const faceEnrolled = user?.faceEnrolled === true
  const googleLinked = user?.authProvider === "google"

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "30px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>
        Welcome, {user?.name || "User"}
      </h2>

      <p style={{ color: "#666", marginBottom: "30px" }}>
        Here’s a quick overview of your account
      </p>

      {/* User Info */}
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          background: "#f8f9fa",
          marginBottom: "30px"
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Profile</h3>
        <p><strong>Email:</strong> {user?.email}</p>
        {/* <p><strong>User ID:</strong> {user?.id} </p>*/}
      </div>

      {/* Status Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
        {/* Face Status */}
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            background: faceEnrolled ? "#e8fbe8" : "#fdeaea",
            border: faceEnrolled ? "1px solid #7bc67b" : "1px solid #d9534f"
          }}
        >
          <h4>Face Recognition</h4>
          <p style={{ marginBottom: "10px" }}>
            {faceEnrolled ? "Face enrolled" : "Not enrolled"}
          </p>

          {!faceEnrolled && (
            <Link
              to="/account/enroll-face"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                background: "#222",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none"
              }}
            >
              Enroll Face
            </Link>
          )}
        </div>

        {/* Google Status */}
        <div
          style={{
            padding: "20px",
            borderRadius: "10px",
            background: googleLinked ? "#e8fbe8" : "#fdeaea",
            border: googleLinked ? "1px solid #7bc67b" : "1px solid #d9534f"
          }}
        >
          <h4>Google Account</h4>
          <p style={{ marginBottom: "10px" }}>
            {googleLinked ? "Linked" : "Not linked"}
          </p>

          {!googleLinked && (
            <Link
              to="/login/google"
              style={{
                display: "inline-block",
                padding: "8px 12px",
                background: "#007bff",
                color: "#fff",
                borderRadius: "6px",
                textDecoration: "none"
              }}
            >
              Link Google
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          background: "#f8f9fa"
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Quick Actions</h3>

        <ul style={{ lineHeight: "1.8" }}>
          <li>
            <Link to="/account" style={{ textDecoration: "none" }}>
              Manage Account Settings
            </Link>
          </li>
          <li>
            <Link to="/account/enroll-face" style={{ textDecoration: "none" }}>
              Enroll Face Recognition
            </Link>
          </li>
          <li>
            <Link to="/login/google" style={{ textDecoration: "none" }}>
              Link Google Account
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
