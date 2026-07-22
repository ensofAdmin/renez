// src/kanban/TaskModal.jsx
import { useState } from "react";

import ConfirmDeleteModal from "./ConfirmDeleteModal";

import "../styles/home.css";

export default function TaskModal({ task, columnId, actions, onClose }) {

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "normal");

  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    actions.updateTask(columnId, task.id, {
      title,
      description,
      priority,
    });
    onClose();
  };

  const handleDelete = () => {
    setShowConfirm(true);   // ⭐ open confirmation modal
  };

  const confirmDelete = () => {
    actions.deleteTask(columnId, task.id);
    onClose();
  };

  if (!open) return null

  return (
      <>
        <div className={"modal-overlay"}>
          <div className={"modal-card"}>
            <h3>{task.title ? "Edit Task" : "Create Task"}</h3>

            <div className="floating-group">
                <input
                    type="text"
                    id="task_title"
                    placeholder=" "
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <label htmlFor="task_title">Task title</label>
            </div>

            <div className="floating-group">
                <textarea
                    id="task_description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description"
                />
            </div>

            <label>Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className={"modal-actions"}>
              <button
                  className={"modal-submit"}
                  onClick={handleSave}
              >
                Save
              </button>

              <button
                  className={"modal-delete"}
                  onClick={handleDelete}
              >
                Delete
              </button>

              <button
                  className={"modal-close"}
                  onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* ⭐ Confirmation Modal */}
        {showConfirm && (
          <ConfirmDeleteModal
              open={showConfirm}
              onConfirm={confirmDelete}
              onCancel={() => setShowConfirm(false)}
              text={"Are you sure you want to delete this task?"}
          />
        )}
      </>

  )
}
