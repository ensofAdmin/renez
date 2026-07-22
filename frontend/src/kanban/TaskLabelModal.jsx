import { useState, useEffect } from "react";

import "../styles/home.css";

const LABEL_COLORS = {
  frontend: "#2ECC71",
  backend: "#3366FF",
  bug: "#ffcc00",
  urgent: "#ff3333",
  design: "#aa33ff"
}

export default function TaskLabelModal({
  open,
  initialLabels,
  initialPriority,
  onClose,
  onSubmit
}) {
  const [labels, setLabels] = useState([])
  const [priority, setPriority] = useState("medium")

  useEffect(() => {
    if (open) {
      setLabels(initialLabels || [])
      setPriority(initialPriority || "medium")
    }
  }, [open, initialLabels, initialPriority])

  if (!open) return null

  const toggleLabel = label => {
    setLabels(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    )
  }

  return (
    <div className={"modal-overlay"}>
      <div className={"modal-card"}>
        <h3>Edit Labels & Priority</h3>

        <h4>Labels</h4>
        <div className={"modal-card-label-color"}>
          {Object.keys(LABEL_COLORS).map(label => (
            <div
              key={label}
              onClick={() => toggleLabel(label)}
              style={{
                background: LABEL_COLORS[label],
                opacity: labels.includes(label) ? 1 : 0.4,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <h4>Priority</h4>
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
            onClick={() => onSubmit({ labels, priority })}
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
