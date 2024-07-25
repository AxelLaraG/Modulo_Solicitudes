"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";

function Solicitud() {
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
  const datePickerRef = useRef(null);

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
            fechaVen: selectedDate
              ? selectedDate.toISOString().split("T")[0]
              : "",
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
      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Enviar los datos del formulario
      });

      if (response.ok) {
        alert("Solicitud creada exitosamente");
        setFormData({
          solicitante: "",
          telefono: "",
          asunto: "",
          procedencia: "Procedencia 1",
          correo: "",
          responsable: "Responsable 1",
          fechaVen: "",
          estatus: idSolicitud ? formData.estatus : "pendiente", // Preserve existing status on edit
        });
      } else {
        alert("Error al enviar/modificar solicitud:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al enviar/modificar solicitud.");
    }
  };

  return (
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
            <label htmlFor="asunto" className="fw-bold">
              Asunto:
            </label>
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
              <label htmlFor="solicitante" className="fw-bold">
                Solicitante:
              </label>
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
              <label htmlFor="procedencia" className="fw-bold">
                Procedencia:
              </label>
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
              <label htmlFor="fechaInput" className="fw-bold">
                Fecha de vencimiento:
              </label>
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
              <label htmlFor="telefono" className="fw-bold">
                Teléfono:
              </label>
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
              <label htmlFor="correo" className="fw-bold">
                Correo:
              </label>
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
              <label htmlFor="responsable" className="fw-bold">
                Responsable:
              </label>
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
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => router.back()}
          >
            Cerrar
          </button>
          (
          <button type="submit" className="btn btn-primary">
            Enviar Solicitud
          </button>
          )
        </div>
      </form>
    </div>
  );
}

export default Solicitud;
