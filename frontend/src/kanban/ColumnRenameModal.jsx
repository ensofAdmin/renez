import { useState, useEffect } from "react";

export default function ColumnRenameModal({ open, initialTitle, onClose, onSubmit }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (open) setTitle(initialTitle || "");
  }, [open, initialTitle]);

  if (!open) return null;

  return (
    <div className={"modal-overlay"}>
      <div className={"modal-card"}>
        <h3>Rename Column</h3>

        <div className="floating-group">
            <input
                type="text"
                id="title"
                placeholder="Column name"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <label htmlFor="title">Title</label>
        </div>

        <div className={"modal-actions"}>
          <button className={"modal-submit"} onClick={() => onSubmit(title)}>Save</button>
          <button className={"modal-close"} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
