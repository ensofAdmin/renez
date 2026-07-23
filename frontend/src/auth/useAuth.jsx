// src/auth/useAuth.jsx
import { create } from "zustand";

export const useAuth = create((set) => ({
  user: null,
  access: null,
  refresh: null,

  login: (access, refresh, user) =>
    set({
      access,
      refresh,
      user
    }),

  logout: () =>
    set({
      user: null,
      access: null,
      refresh: null
    }),

  setAuth: (data) =>
    set((state) => ({
      ...state,
      ...data
    })),

}));
