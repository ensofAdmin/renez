// src/kanban/actionsFactory.js
import { useApi } from "../api/useApi";

const API_URL = import.meta.env.VITE_API_URL;

export function actionsFactory(get, set) {
  const api = useApi();

  const setBoard = (fn) => {
    const newBoard = fn(get().board);
    set({ board: newBoard });
  };

  return {
    async createColumn(title) {
      const res = await api.request(`${API_URL}/kanban/columns/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      if (res.ok) {
        setBoard(prev => [...prev, res.data]);
      }
    },

    async deleteColumn(columnId) {
      const res = await api.request(`${API_URL}/kanban/columns/${columnId}/delete/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        setBoard(prev => prev.filter(col => col.id !== columnId));
      }
    },

    async updateColumnTitle(columnId, title) {
      // ⭐ Optimistic update
      setBoard(prev =>
        prev.map(col =>
          col.id === columnId ? { ...col, title } : col
        )
      );

      // ⭐ Backend update
      const res = await api.request(`${API_URL}/kanban/columns/${columnId}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      // ⭐ Reload if backend fails
      if (!res.ok) {
        const reload = await api.request(`${API_URL}/kanban/columns/`);
        if (reload.ok) set({ board: reload.data });
      }
    },

    async updateColumnIcon(columnId, icon) {
      // ⭐ Optimistic update
      setBoard(prev =>
        prev.map(col =>
          col.id === columnId ? { ...col, icon } : col
        )
      );

      // ⭐ Backend update
      const res = await api.request(`${API_URL}/kanban/columns/${columnId}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icon }),
      });

      // ⭐ Reload if backend fails
      if (!res.ok) {
        const reload = await api.request(`${API_URL}/kanban/columns/`);
        if (reload.ok) set({ board: reload.data });
      }
    },

    async updateColumnColor(columnId, color) {

      setBoard(prev =>
        prev.map(col =>
          col.id === columnId ? { ...col, color } : col
        )
      );

      const res = await api.request(`${API_URL}/kanban/columns/${columnId}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color })
      });

      if (!res.ok) {
        const reload = await api.request(`${API_URL}/kanban/columns/`);
        if (reload.ok) set({ board: reload.data });
      }
    },

    async createTask(columnId, data) {
      const res = await api.request(`${API_URL}/kanban/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, column: columnId })
      });

      if (res.ok) {
        setBoard(prev =>
          prev.map(col =>
            col.id === columnId
              ? { ...col, tasks: [...col.tasks, res.data] }
              : col
          )
        );
      }
    },

    async updateTask(columnId, taskId, data) {
      const res = await api.request(`${API_URL}/kanban/tasks/${taskId}/update/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setBoard(prev =>
          prev.map(col =>
            col.id === columnId
              ? {
                  ...col,
                  tasks: col.tasks.map(t =>
                    t.id === taskId ? res.data : t
                  )
                }
              : col
          )
        );
      }
    },

    async deleteTask(columnId, taskId) {
      const res = await api.request(`${API_URL}/kanban/tasks/${taskId}/delete/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        setBoard(prev =>
          prev.map(col =>
            col.id === columnId
              ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
              : col
          )
        );
      }
    },

    async moveColumn(columnId, hoverColumnId) {
      setBoard(prev => {
        const newBoard = [...prev];
        const srcIndex = newBoard.findIndex(c => c.id === columnId);
        const hoverIndex = newBoard.findIndex(c => c.id === hoverColumnId);
        const [removed] = newBoard.splice(srcIndex, 1);
        newBoard.splice(hoverIndex, 0, removed);
        return newBoard;
      });

      const res = await api.request(`${API_URL}/kanban/move-column/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId, hoverColumnId })
      });

      if (!res.ok) {
        const reload = await api.request(`${API_URL}/kanban/columns/`);
        if (reload.ok) set({ board: reload.data });
      }
    },

    async moveTask(taskId, fromColumnId, toColumnId, hoverIndex) {
      setBoard(prev => {
        const newBoard = [...prev];
        const fromCol = newBoard.find(c => c.id === fromColumnId);
        const toCol = newBoard.find(c => c.id === toColumnId);

        const taskIndex = fromCol.tasks.findIndex(t => t.id === taskId);
        const [task] = fromCol.tasks.splice(taskIndex, 1);

        if (hoverIndex == null) {
          toCol.tasks.push(task);
        } else {
          toCol.tasks.splice(hoverIndex, 0, task);
        }

        return newBoard;
      });

      const res = await api.request(`${API_URL}/kanban/move-task/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, fromColumnId, toColumnId, hoverIndex })
      });

      if (!res.ok) {
        const reload = await api.request(`${API_URL}/kanban/columns/`);
        if (reload.ok) set({ board: reload.data });
      }
    },

    // ⭐ Reorder Task Within Same Column
    reorderTask(columnId, fromIndex, toIndex) {
      set(state => ({
        board: state.board.map(col => {
          if (col.id !== columnId) return col;

          const updated = [...col.tasks];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);

          return { ...col, tasks: updated };
        })
      }));
    },

    isModalOpen() {
      return get().ui?.isModalOpen ?? false;
    }

  };
}
