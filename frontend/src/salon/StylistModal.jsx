import "../styles/home.css";

export const StylistModal = ({ existing, onUpdate, onClose }) => {
    return (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Stylist Already Exists</h3>
            <p>
              The stylist <strong>{existing.name}</strong> already exists.
            </p>

            <p>Would you like to update the stylist details?</p>

            <div className="modal-actions">
              <button className="modal-update" onClick={onUpdate}>
                Update Stylist Details
              </button>

              <button className="modal-close" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
    );
}