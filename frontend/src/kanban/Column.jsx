// src/kanban/Column.jsx
import { useDrop, useDrag } from "react-dnd";
import { DND_TYPES } from "./dndTypes";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { useState } from "react";

import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";
import ColumnColorModal from "./ColumnColorModal.jsx";
import ColumnRenameModal from "./ColumnRenameModal.jsx";
import ColumnIconModal from "./ColumnIconModal.jsx";

// ⭐ Move Modals to render outside the Kanban Board DOM
import ModalPortal from "./ModalPortal";

export default function Column({ column, index, actions }) {
  // ⭐ Modal state
  const [editingTask, setEditingTask] = useState(null);
  const [showColumnConfirm, setShowColumnConfirm] = useState(false);


  // ⭐ Add Task input
  const [taskTitle, setTaskTitle] = useState("");

  // ⭐ Add Color Picker Modal State
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [colorColumnId, setColorColumnId] = useState(null);
  const [colorInitial, setColorInitial] = useState("#007bff");

  // ⭐ Add Rename Title Modal State
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameColumnId, setRenameColumnId] = useState(null);
  const [renameInitial, setRenameInitial] = useState("");

  // ⭐ Add Icon Picker Modal State
  const [iconModalOpen, setIconModalOpen] = useState(false);
  const [iconInitial, setIconInitial] = useState("📁");
  const [iconColumnId, setIconColumnId] = useState(null);

  const isModalOpen = Boolean(editingTask);

  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    actions.createTask(column.id, { title: taskTitle });
    setTaskTitle("");
  };

  // ⭐ Column drag source
  const [{ isDraggingColumn }, dragColumnRef] = useDrag({
    type: DND_TYPES.COLUMN,
    item: { columnId: column.id, index },
    canDrag: () => !isModalOpen,   // ⭐ prevent flicker
    collect: monitor => ({
      isDraggingColumn: monitor.isDragging(),
    }),
  });

  // ⭐ Column drop target (reorder columns)
  const [, dropColumnRef] = useDrop({
    accept: DND_TYPES.COLUMN,
    hover: (item) => {
      if (item.index === index) return;
      item.index = index;
      actions.moveColumn(item.columnId, column.id);
    },
  });

  // ⭐ Task drop target (move tasks)
  const [, dropTaskRef] = useDrop({
    accept: DND_TYPES.TASK,
    hover: (item, monitor) => {
      if (isModalOpen) return;   // ⭐ prevent flicker
      if (!monitor.isOver({ shallow: true })) return;

      const fromColumnId = item.fromColumnId;
      const toColumnId = column.id;

      if (fromColumnId === toColumnId) return;

      const hoverIndex = column.tasks.length;

      item.fromColumnId = toColumnId;
      item.index = hoverIndex;

      actions.moveTask(item.taskId, fromColumnId, toColumnId, hoverIndex);
    },
  });

  // ⭐ Combine all refs
  const columnRef = (node) => {
    dragColumnRef(node);
    dropColumnRef(node);
    dropTaskRef(node);
  };

  // ⭐ Task drop highlight (isOver)
  const [{ isOver }, dropRef] = useDrop({
    accept: DND_TYPES.TASK,
    collect: monitor => ({
      isOver: isModalOpen ? false : monitor.isOver({ shallow: true })
    })
  });

  // ⭐ Combine both refs
  const tasksDropRef = (node) => {
    dropTaskRef(node);
    dropRef(node);
  };

  return (
    <div
      ref={columnRef}
      className={`kanban-column ${isDraggingColumn ? "dragging-column" : ""}`}
      style={{
        opacity: isDraggingColumn ? 0.7 : 1,
        background: column.color + "22"   // subtle tint
      }}
    >
      <div className="column-header">
        <div className="column-title-row">

          <span
            className="column-color-dot"
            style={{ background: column.color }}
            onClick={() => {
              setColorInitial(column.color);
              setColorColumnId(column.id);
              setColorModalOpen(true);
            }}
          ></span>

          <span className="column-icon">{column.icon}</span>

          <h3 className="column-title">{column.title}</h3>

          <button
            className="rename-column-icon"
            onClick={() => {
              setRenameInitial(column.title);
              setRenameColumnId(column.id);
              setRenameModalOpen(true);
            }}
          >
            ✏️
          </button>

          <button
            className="icon-picker-btn"
            onClick={() => {
              setIconInitial(column.icon);
              setIconColumnId(column.id);
              setIconModalOpen(true);
            }}
          >
            🎨
          </button>
        </div>

        <button
          className="delete-column-icon"
          onClick={() => setShowColumnConfirm(true)}
        >
          🗑️
        </button>
      </div>


      {/* ⭐ Add Task UI */}
      <div className="add-task">
        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="New task"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* ⭐ Task List */}
      <div
          ref={tasksDropRef}
          className={`kanban-tasks ${isOver ? "drop-hover" : ""}`}
      >

        {column.tasks.map((task, i) => (
          <TaskCard
            key={task.id}
            task={task}
            index={i}
            columnId={column.id}
            actions={actions}        // ⭐ ADD THIS
            onOpen={(task) => setEditingTask(task)}   // ⭐ REQUIRED
          />
        ))}
      </div>

      {/* ⭐ Task Modal */}
      {editingTask && (
        <ModalPortal>
          <TaskModal
            task={editingTask}
            columnId={column.id}
            actions={actions}
            onClose={() => setEditingTask(null)}
          />
        </ModalPortal>
      )}


      {/* ⭐ Column Delete Confirmation Modal */}
      {showColumnConfirm && (
          <ModalPortal>
            <ConfirmDeleteModal
                open={showColumnConfirm}
                onConfirm={() => {
                  actions.deleteColumn(column.id);
                  setShowColumnConfirm(false);
                }}
                onCancel={() => setShowColumnConfirm(false)}
                text={"Are you sure you want to delete this column and it's related tasks?"}
            />
          </ModalPortal>

      )}

      <ModalPortal>
        <ColumnColorModal
          open={colorModalOpen}
          initialColor={colorInitial}
          onClose={() => setColorModalOpen(false)}
          onSubmit={(newColor) => {
            actions.updateColumnColor(colorColumnId, newColor);
            setColorModalOpen(false);
          }}
        />
      </ModalPortal>

      <ModalPortal>
        <ColumnRenameModal
          open={renameModalOpen}
          initialTitle={renameInitial}
          onClose={() => setRenameModalOpen(false)}
          onSubmit={(newTitle) => {
            actions.updateColumnTitle(renameColumnId, newTitle);
            setRenameModalOpen(false);
          }}
        />
      </ModalPortal>

      <ModalPortal>
        <ColumnIconModal
          open={iconModalOpen}
          initialIcon={iconInitial}
          onClose={() => setIconModalOpen(false)}
          onSubmit={(newIcon) => {
            actions.updateColumnIcon(iconColumnId, newIcon);
            setIconModalOpen(false);
          }}
        />
      </ModalPortal>

    </div>
  );
}
