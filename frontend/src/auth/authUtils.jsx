// -----------------------------
// SAFE LOCALSTORAGE LOAD
// -----------------------------
export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw || raw === "undefined") return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.error(`Failed to load ${key}:`, err)
    return fallback
  }
}

// -----------------------------
// SAFE LOCALSTORAGE SAVE
// -----------------------------
export function save(key, value) {
  try {
    if (value === undefined) {
      localStorage.removeItem(key)
      return
    }

    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error(`Failed to save ${key}:`, err)
  }
}

// -----------------------------
// STORAGE UTILS GROUP
// -----------------------------
export const storageUtils = {
  load,
  save
}

// -----------------------------
// DEFAULT AUTH STATE
// -----------------------------
export const authDefaults = {
  user: null,
  access: null,
  refresh: null,
  permissions: [],
  stylistProfile: null,
  settings: {},
  kanbanSettings: {}
}
