// src/kanban/ColumnModal.jsx
import { useState, useEffect } from "react"

import "../styles/home.css";

export default function ColumnModal({ open, onClose, onSubmit }) {

  const [title, setTitle] = useState("")

  useEffect(() => {
    if (open) setTitle("")
  }, [open])

  if (!open) return null

  return (
    <div className={"modal-overlay"}>
      <div className={"modal-card"}>
        <h3>Create Column</h3>

        <div className="floating-group">
            <input
                type="text"
                id="column_name"
                placeholder=" "
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <label htmlFor="column_name">Column name</label>
        </div>

        <div className={"modal-actions"}>
          <button
              className={"modal-submit"}
              onClick={() => onSubmit(title)}
          >
            Create
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
  )
}
