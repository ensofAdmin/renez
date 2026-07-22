import { useState } from "react"

import { useAuth } from "./useAuth.jsx"
import {useApi} from "../api/useApi.jsx";

import ForgotPasswordModal from "./ForgotPasswordModal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

import "../styles/home.css"

export default function LoginModal({ open, onClose }) {

    const api = useApi();
    const login = useAuth(s => s.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForgot, setShowForgot] = useState(false);

    const [error, setError] = useState("");

    if (!open) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("");

        const res = await api.request(`${API_URL}/users/login/`, {
          method: "POST",
          body: JSON.stringify({ email, password })
        })

        if (res.ok) {
            // Save tokens + user
            login(res.data.access, res.data.refresh, res.data.user)

            // Persist user
            localStorage.setItem("access", res.data.access)
            localStorage.setItem("refresh", res.data.refresh)
            localStorage.setItem("user", JSON.stringify(res.data.user))

            onClose()
            window.location.reload();

        } else {
            setError("Invalid credentials or server error.");
            return;
        }
    }

    return (
        <>
            <div className="modal-overlay" style={{overflowY: "auto"}}>
                <div className="modal-container">
                    <h2>Login</h2>
                    {
                        error && <p>{error}</p>
                    }

                    <form onSubmit={handleSubmit} className="modal-form">

                        <div className="floating-group">
                            <input
                                id="email"
                                type="email"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="email">Email</label>
                        </div>

                        <div className="floating-group">
                            <input
                                type="password"
                                id="password"
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {handleSubmit}
                                }}
                                required
                            />
                            <label htmlFor="password">Password</label>
                        </div>

                        <button type="submit" className="modal-btn primary">Login</button>
                    </form>

                    <button
                        className="link-btn"
                        onClick={() => setShowForgot(true)}
                    >
                        Forgot Password?
                    </button>

                    <button className="modal-btn close" onClick={onClose}>Close</button>
                </div>
            </div>
            {showForgot && (
              <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />
            )}
        </>

    )
}
