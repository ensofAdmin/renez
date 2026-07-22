// src/auth/useAuth.jsx
import { create } from "zustand";
import {useApi} from "../api/useApi.jsx";

const API_URL = import.meta.env.VITE_API_URL;

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
