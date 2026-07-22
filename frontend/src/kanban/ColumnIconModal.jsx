import { useState } from "react";

const EMOJI_OPTIONS = [
  "💡", "📋", "🔧", "✔️",
  "🔥", "🚀", "📁", "📝",
  "⚙️", "📦", "🎯", "⏳",
];

export default function ColumnIconModal({ open, initialIcon, onClose, onSubmit }) {
  const [icon, setIcon] = useState(initialIcon || "📁");

  if (!open) return null;

  return (
    <div className={"modal-overlay"}>
      <div className={"modal-card"}>
        <h3>Select Column Icon</h3>

        <div className={"modal-card-icons"}>
          {EMOJI_OPTIONS.map(e => (
            <span
              key={e}
              style={{ background: icon === e ? "#eee" : "transparent" }}
              onClick={() => setIcon(e)}
            >
              {e}
            </span>
          ))}
        </div>

        <div className="modal-actions">
          <button className={"modal-submit"} onClick={() => onSubmit(icon)}>Save</button>
          <button className={"modal-close"} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
