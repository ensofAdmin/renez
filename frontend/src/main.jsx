// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./auth/AuthProvider";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {ReviewsProvider} from "./context/ReviewsProvider.jsx";

import App from "./App"

import "./styles/global.css"

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// --- Fast Refresh only works when the file exports something React Fast Refresh tracks modules.
// It can only track a module if that module has at least one export.
//
// If a file has no exports, Fast Refresh treats it as:
//
// “A side‑effect‑only module — do a full reload.”---

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>

        <BrowserRouter>
            <AuthProvider>
                <ReviewsProvider>
                    <App />
                </ReviewsProvider>
            </AuthProvider>
        </BrowserRouter>

    </GoogleOAuthProvider>
  </React.StrictMode>
)
