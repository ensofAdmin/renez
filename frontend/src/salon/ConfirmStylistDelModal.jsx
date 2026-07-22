import "../styles/home.css";

export default function ConfirmStylistDelModal({ open, onClose, onConfirm, stylist }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Delete Stylist</h3>

        <p>
          Are you sure you want to delete <strong>{stylist.name}</strong>?
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button className="modal-close" onClick={onClose}>
            Cancel
          </button>

          <button className="modal-delete" onClick={onConfirm}>
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
