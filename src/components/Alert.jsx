import React from "react";
import "../../public/Styles/alert.css"

export default function CustomAlert({ message, onClose }) {
  return (
    <div className="overlay">
      <div className="alert-box">
        <p className="alert-message">{message}</p>
        <button className="alert-button" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
}
