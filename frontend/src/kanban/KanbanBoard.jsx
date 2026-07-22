// src/kanban/KanbanBoard.jsx
import Column from "./Column";
import { useState } from "react";

import "../styles/home.css";

export default function KanbanBoard({ board, actions }) {
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    actions.createColumn(newColumnTitle);
    setNewColumnTitle("");
  };

  return (
    <div className="kanban-board">

      {/* ⭐ Add Column Input */}
      <div className="add-column">
        <input
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          placeholder="New column title"
        />
        <button onClick={handleAddColumn}>Add Column</button>
      </div>

      {/* ⭐ Render Columns */}
      {board.map((column, index) => (
        <Column
          key={column.id}
          column={column}
          index={index}
          actions={actions}
        />
      ))}
    </div>
  );
}
