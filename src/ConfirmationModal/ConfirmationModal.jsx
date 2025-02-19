import React from "react";
import "./ConfirmationModal.css"; // Add styles if needed

const ConfirmationModal = ({ isOpen, onClose, onConfirm, word }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete "{word?.swedish}"?</p>
        <button onClick={onConfirm}>Yes, Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
