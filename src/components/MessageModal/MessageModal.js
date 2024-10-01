import React from 'react';
import './MessageModal.css'; // Import your styles here

const MessageModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay show">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Notification</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
