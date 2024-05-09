import React from "react";
import "./TimeUpModal.css";

const TimeUpModal = ({ onClose }) => {
  return (
    <div className="TimeUpModal-modal">
      <div className="TimeUpModal-modal-content">
        <h2 className="TimeUpModal-title">Time for test completed</h2>
        <button className="TimeUpModal-button" onClick={onClose}>
          Ok
        </button>
      </div>
    </div>
  );
};

export default TimeUpModal;
