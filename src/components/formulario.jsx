"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";

function SolicitudModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idSolicitud = searchParams.get("id");

  const [formData, setFormData] = useState({
    solicitante: "",
    telefono: "",
    asunto: "",
    procedencia: "Procedencia 1",
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
  }, [idSolicitud]);

  useEffect(() => {
    if (datePickerRef.current) {
      flatpickr(datePickerRef.current, {
        locale: "es",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: (selectedDates) => {
          const selectedDate = selectedDates[0];
          setFormData((prevFormData) => ({
            ...prevFormData,
            fechaVen: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
          }));
        },
      });
    }
  }, [formData.fechaVen]);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
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
    router.push("/"); // Redireccion :c
  };

  return (
    <>
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        id="solicitudModal"
        tabIndex="-1"
        aria-labelledby="solicitudModalLabel"
        aria-hidden={!showModal}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="solicitudModalLabel">
                {idSolicitud ? "Modificar Solicitud" : "Nueva Solicitud"}
              </h5>
            </div>
            <div className="modal-body">
              <div className="container mt-4">
                <div className="header-container">
                  <h2 className="text-center">Solicitud</h2>
                  <br />
                </div>

                <form id="formularioSolicitud" onSubmit={handleSubmit}>
                  {idSolicitud && (
                    <input type="hidden" id="idSolicitud" value={idSolicitud} />
                  )}
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="asunto" className="fw-bold">Asunto:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="solicitante" className="fw-bold">Solicitante:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="solicitante"
                          value={formData.solicitante}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="procedencia" className="fw-bold">Procedencia:</label>
                        <select
                          className="form-control"
                          id="procedencia"
                          value={formData.procedencia}
                          onChange={handleChange}
                          required
                        >
                          <option value="Procedencia 1">Oficio</option>
                          <option value="Procedencia 2">Correo</option>
                          <option value="Procedencia 3">Teléfono</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="fechaInput" className="fw-bold">Fecha de vencimiento:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="fechaInput"
                          ref={datePickerRef}
                          value={formData.fechaVen}
                          onChange={handleChange}
                          required
                        />
                        <div id="date-error" className="invalid-feedback d-none"></div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="telefono" className="fw-bold">Teléfono:</label>
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
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="correo" className="fw-bold">Correo:</label>
                        <input
                          type="email"
                          className="form-control"
                          id="correo"
                          value={formData.correo}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="responsable" className="fw-bold">Responsable:</label>
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
                    </div>
                    {idSolicitud && (
                      <div className="col-md-6">
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
                      </div>
                    )}
                  </div>
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
