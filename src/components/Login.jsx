"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomAlert from "./Alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [showAlert, setShowAlert] = useState(false); // Estado para mostrar la alerta
  const [alertMessage, setAlertMessage] = useState(""); // Estado para el mensaje de alerta
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Establece el mensaje del error recibido del servidor
        setAlertMessage(data.message || "Ocurrió un error desconocido");
        setShowAlert(true);
        return;
      }

      // Login exitoso
      localStorage.setItem("token", data.token);
      router.push("/Principal");
    } catch (error) {
      console.error("Error en el login:", error);
      setAlertMessage("Error en el servidor. Inténtalo más tarde.");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center vh-100 justify-content-center">
      <h2 className="display-4 text-center">Inicio de Sesión</h2>
      <div className="col-md-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Contraseña"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-100"
            >
              {isLoading ? "Validando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
        {isLoading && <p className="text-center mt-3">Cargando...</p>}
        {showAlert && (
          <CustomAlert
            message={alertMessage} // Mensaje dinámico según el error
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
    </div>
  );
}
