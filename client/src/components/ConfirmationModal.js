import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button className="submit-button" onClick={onConfirm}>Confirm</button>
        <button className="submit-button" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ConfirmationModal