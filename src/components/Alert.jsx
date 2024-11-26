import React from "react";

export default function CustomAlert({ message, onClose }) {
  return (
    <div style={overlayStyle}>
      <div style={alertBoxStyle}>
        <p style={messageStyle}>{message}</p>
        <button style={buttonStyle} onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

// Estilos
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const alertBoxStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  width: "300px",
};

const messageStyle = {
  marginBottom: "20px",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};