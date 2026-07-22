// src/pages/KanbanPage.jsx
import { useEffect } from "react";
import { useSidebar } from "../ui/useSidebar";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import KanbanBoard from "../kanban/KanbanBoard";
import { useKanbanStore } from "../kanban/useKanbanStore";

export function KanbanPage() {
  const closeSidebar = useSidebar(state => state.closeSidebar);

  const board = useKanbanStore(state => state.board);
  const actions = useKanbanStore(state => state.actions);
  const loadBoard = useKanbanStore(state => state.loadBoard);

  useEffect(() => {
    closeSidebar();
  }, []);

  useEffect(() => {
    loadBoard();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Kanban Board</h2>

      <DndProvider backend={HTML5Backend}>
        <KanbanBoard board={board} actions={actions} />
      </DndProvider>
    </div>
  );
}
