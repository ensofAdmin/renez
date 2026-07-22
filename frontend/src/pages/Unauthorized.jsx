// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";

import "../styles/home.css"

export default function Unauthorized() {
  return (
    <div className="booking-card">
      <h2 className="booking-title">Access Denied</h2>
      <p>You do not have permission to view this page.</p>

      <Link to="/" className="booking-submit" style={{ display: "inline-block", marginTop: "20px" }}>
        Go back home
      </Link>
    </div>
  );
}
