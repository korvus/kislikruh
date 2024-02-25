import React from "react";
import "../../style/modal.css"; // Assurez-vous de créer un fichier CSS approprié

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default Modal;
