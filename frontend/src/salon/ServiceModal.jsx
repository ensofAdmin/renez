import "../styles/home.css";

export const ServiceModal = ({ existing, onUpdate, onClose }) => {
    return (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Service Already Exists</h3>
            <p>
              The service <strong>{existing.name}</strong> already exists.
            </p>

            <p>Would you like to update the existing offer?</p>

            <div className="modal-actions">
              <button className="modal-update" onClick={onUpdate}>
                Update Existing Offer
              </button>

              <button className="modal-close" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
    );
}