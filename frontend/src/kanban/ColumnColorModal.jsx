// src/kanban/ColumnColorModal.jsx
import { useState, useEffect } from "react";

import "../styles/home.css";

export default function ColumnColorModal({ open, initialColor, onClose, onSubmit }) {

  const [color, setColor] = useState("#007bff")

  useEffect(() => {
    if (open) setColor(initialColor || "#007bff")
  }, [open, initialColor])

  if (!open) return null

  return (
    <div className={"modal-overlay"}>
      <div className={"modal-card"}>
        <h3>Column Color</h3>

        <div className="floating-group">
            <input
                type="color"
                id="color"
                value={color}
                onChange={e => (
                    setColor(e.target.value)
                )}
            />
            <label htmlFor="color">Color</label>
        </div>

        <div className={"modal-actions"}>
          <button
            onClick={() => onSubmit(color)}
            className={"modal-submit"}
          >
            Save
          </button>

          <button
            onClick={onClose}
            className={"modal-close"}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
