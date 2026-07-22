import { jwtDecode } from "jwt-decode"

// --- Decode a JWT safely ---
function decode(token) {
  try {
    if (!token) return null
    return jwtDecode(token)
  } catch (err) {
    console.error("Failed to decode JWT:", err)
    return null
  }
}

// --- Check if token expires within thresholdMs ---
function isExpiringSoon(token, thresholdMs = 60000) {
  const payload = decode(token)
  if (!payload || !payload.exp) return true

  const now = Date.now()
  const expMs = payload.exp * 1000

  return expMs - now < thresholdMs
}

export const jwtUtils = {
  decode,
  isExpiringSoon
}
