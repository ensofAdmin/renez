import { useState } from "react";
import { useApi } from "../api/useApi";

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPasswordModal({ open, onClose }) {
  const api = useApi();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const requestOTP = async () => {
    const res = await api.request(`${API_URL}/auth/password-reset/request/`, {
      method: "POST",
      body: JSON.stringify({ email })
    });

    if (!res.ok) {
      setError("Email not found");
      return;
    }

    setStep(2);
  };

  const verifyOTP = async () => {
    const res = await api.request(`${API_URL}/auth/password-reset/verify/`, {
      method: "POST",
      body: JSON.stringify({ email, code: otp })
    });

    if (!res.ok) {
      setError("Invalid or expired OTP");
      return;
    }

    setStep(3);
  };

  const resetPassword = async () => {
    const res = await api.request(`${API_URL}/auth/password-reset/complete/`, {
      method: "POST",
      body: JSON.stringify({ email, new_password: newPassword })
    });

    if (!res.ok) {
      setError("Failed to update password");
      return;
    }

    alert("Password updated successfully!");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        <h2>Reset Password</h2>
        {error && <p className="error">{error}</p>}

        {step === 1 && (
          <>
            <div className="floating-group">
                <input
                    id="email"
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="email">Enter your email</label>
            </div>

            <button className="modal-btn primary" onClick={requestOTP}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
              <div className="floating-group">
                <input
                    id="otp"
                    type="text"
                    placeholder=" "
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <label htmlFor="otp">Enter OTP</label>
            </div>

            <button className="modal-btn primary" onClick={verifyOTP}>
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
              <div className="floating-group">
                <input
                    type="password"
                    id="password"
                    placeholder=" "
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <label htmlFor="New password">Password</label>
              </div>

            <button className="modal-btn primary" onClick={resetPassword}>
              Update Password
            </button>
          </>
        )}

        <button className="modal-btn close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
