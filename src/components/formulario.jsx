"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import $ from "jquery";

function SolicitudModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idSolicitud = searchParams.get("id");

  const [formData, setFormData] = useState({
    solicitante: "",
    telefono: "",
    asunto: "",
    procedencia: "",
    correo: "",
    responsable: "Responsable 1",
    fechaVen: "",
    estatus: "pendiente",
  });
  const [showModal, setShowModal] = useState(true);
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (idSolicitud) {
      fetch(`/api/obtener_solicitud/${idSolicitud}`)
        .then((response) => response.json())
        .then((solicitud) => setFormData(solicitud))
        .catch((error) => console.error("Error al cargar datos:", error));
    }

    // Importar los estilos de Bootstrap Datepicker (una sola vez al montar el componente)
    import("bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css");
  }, [idSolicitud]);

  useEffect(() => {
    if (datePickerRef.current && typeof $ !== "undefined") {
      $(datePickerRef.current).datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
        startDate: new Date(),
        language: "es",
      });

      $(datePickerRef.current).on("changeDate", (e) => {
        const selectedDate = new Date(e.date);
        const currentDate = new Date();
        const dateError = document.getElementById("date-error");

        if (selectedDate.getTime() < currentDate.getTime()) {
          dateError.classList.remove("d-none");
          dateError.textContent = "La fecha debe ser igual o posterior a hoy.";
        } else {
          dateError.classList.add("d-none");
        }
      });
    }
  }, []); // Se ejecuta solo una vez al montar el componente


  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        idSolicitud
          ? `/api/modificar_solicitud/${idSolicitud}`
          : "/api/subir_solicitud",
        {
          method: idSolicitud ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert(
          idSolicitud
            ? "Solicitud modificada exitosamente"
            : "Solicitud creada exitosamente"
        );
        router.push("/");
      } else {
        alert("Error al enviar/modificar solicitud:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar/modificar solicitud.");
    }
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta solicitud?")) {
      try {
        const response = await fetch(`/api/eliminar_solicitud/${idSolicitud}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Solicitud eliminada exitosamente");
          router.push("/");
        } else {
          alert("Error al eliminar la solicitud");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al eliminar solicitud.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.push("/");
  };

  return (
    <>
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"
        onLoad={() => console.log("bootstrap-datepicker cargado")}
        onError={(e) => console.error("Error al cargar bootstrap-datepicker:", e)}
      />
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        id="solicitudModal"
        tabIndex="-1"
        aria-labelledby="solicitudModalLabel"
        aria-hidden={!showModal}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="solicitudModalLabel">
                {idSolicitud ? "Modificar Solicitud" : "Nueva Solicitud"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container mt-4">
                <div className="header-container">
                  <h2 className="text-center">Solicitud</h2>
                </div>

                <form id="formularioSolicitud" onSubmit={handleSubmit}>
                  {idSolicitud && (
                    <input type="hidden" id="idSolicitud" value={idSolicitud} />
                  )}

                  <div className="form-group">
                    <label htmlFor="solicitante">Solicitante:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="solicitante"
                      value={formData.solicitante}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="asunto">Asunto:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="procedencia">Procedencia:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="procedencia"
                      value={formData.procedencia}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fechaInput" className="form-label">
                      Fecha de vencimiento:
                    </label>
                    <div
                      className="input-group date"
                      id="datepicker"
                      ref={datePickerRef}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="fechaInput"
                        data-bs-toggle="datepicker"
                        data-bs-format="yyyy-mm-dd"
                        value={formData.fechaVen}
                        onChange={handleChange}
                        required
                        readOnly
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <i className="bi bi-calendar"></i>
                        </span>
                      </div>
                      <div
                        id="date-error"
                        className="invalid-feedback d-none"
                      ></div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      pattern="[0-9]{10}"
                      title="Debe contener 10 dígitos"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="correo">Correo:</label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      value={formData.correo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="responsable">Responsable:</label>
                    <select
                      className="form-control"
                      id="responsable"
                      value={formData.responsable}
                      onChange={handleChange}
                      required
                    >
                      <option value="Responsable 1">Responsable 1</option>
                      <option value="Responsable 2">Responsable 2</option>
                      <option value="Responsable 3">Responsable 3</option>
                      <option value="Responsable 4">Responsable 4</option>
                      <option value="Responsable 5">Responsable 5</option>
                    </select>
                  </div>

                  {idSolicitud && (
                    <div className="form-group">
                      <label htmlFor="estatus">Estatus:</label>
                      <select
                        className="form-control"
                        id="estatus"
                        value={formData.estatus}
                        onChange={handleChange}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="realizado">Realizado</option>
                        <option value="rechazado">Rechazado</option>
                      </select>
                    </div>
                  )}
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
              {idSolicitud ? (
                <>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    Eliminar
                  </button>
                  <button
                    type="submit"
                    form="formularioSolicitud"
                    className="btn btn-primary"
                  >
                    Guardar Cambios
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  form="formularioSolicitud"
                  className="btn btn-primary"
                >
                  Enviar Solicitud
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SolicitudModal;
