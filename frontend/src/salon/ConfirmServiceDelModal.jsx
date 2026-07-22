
export default function ConfirmServiceDelModal ({ open, onClose, onConfirm, service }) {
    if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Delete Service</h3>

        <p>
          Are you sure you want to delete <strong>{service.name}</strong>?
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