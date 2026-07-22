// src/kanban/ConfirmDeleteModal.jsx
import "../styles/home.css";

export default function ConfirmDeleteModal({ open, onCancel, onConfirm, text }) {
  if (!open) return null

  return (
    <div className={"modal-overlay"}>
      <div className={"modal-card"}>
        <h3>Delete Column</h3>
        <p>{text}</p>

        <div className={"modal-actions"}>
          <button
              className={"modal-delete"}
              onClick={onConfirm}
          >
            Delete
          </button>

          <button
              className={"modal-close"}
              onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
