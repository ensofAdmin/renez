// src/kanban/useKanbanStore.js
import { create } from "zustand";
import { actionsFactory } from "./actionsFactory";

import { useApi } from "../api/useApi";

const API_URL = import.meta.env.VITE_API_URL;

export const useKanbanStore = create((set, get) => ({
  board: [],
  setBoard: (board) => set({ board }),

  actions: actionsFactory(get, set),

  async loadBoard() {
    const api = useApi();
    const res = await api.request(`${API_URL}/kanban/columns/`);

    if (res.ok) {
      set({ board: res.data });
    }
  }
}));
