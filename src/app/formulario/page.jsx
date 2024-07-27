"use client";

import { useEffect, useState, useRef } from "react";
import { useParams,useRouter } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";

export default function FormularioPlantilla() {
  const flatpickrRef = useRef(null);
  const params = useParams();
  const router = useRouter();
  const [fechaMin, setFechaMin] = useState(new Date());

  const handleDelete = async () => {
    if (window.confirm("¿Está seguro de que quiere eliminar esta solicitud?")) {
      const response = await fetch(`/api/solicitudes/${params.id}`, {
        method: "DELETE",
      });
      router.push("/");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita el envío tradicional del formulario

    try {
      const formData = {
        responsable: document.getElementById("responsable").value,
        solicitante: document.getElementById("solicitante").value,
        correo: document.getElementById("correo").value,
        telefono: document.getElementById("telefono").value,
        asunto: document.getElementById("asunto").value,
        estatus: document.getElementById("estatus").value,
        fechaVen: document.getElementById("fechaInput").value, // Obtener la fecha seleccionada
      };

      const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Solicitud exitosa, puedes redirigir o hacer otra acción
        alert("Solicitud enviada con éxito");
      } else {
        alert("Error al enviar la solicitud");
      }
    } catch (error) {
      console.error(error.message); // Manejar el error
    }
  };

  useEffect(() => {
    flatpickrRef.current = flatpickr("#fechaInput", {
      minDate: fechaMin,
      dateFormat: "Y-m-d",
      disableMobile: true,
      onChange: function (selectedDates, dateStr, instance) {
        const fechaSeleccionada = new Date(dateStr);
        if (fechaSeleccionada < fechaMin) {
          document.getElementById("date-error").textContent =
            "La fecha no puede ser anterior a hoy.";
          document.getElementById("date-error").classList.remove("d-none");
        } else {
          document.getElementById("date-error").classList.add("d-none");
        }
      },
      locale: Spanish,
    });
  }, [fechaMin]); // Dependencia del useEffect

  return (
    <div className="container mt-4" onSubmit={handleSubmit}>
      <div className="header-container">
        <h2 className="text-center">Solicitud</h2>
        <br />
      </div>

      <form id="formularioSolicitud">
        <input type="hidden" id="idSolicitud" />

        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="asunto" className="fw-bold">
              Asunto:
            </label>
            <input type="text" className="form-control" id="asunto" required />
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
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="procedencia" className="fw-bold">
                Procedencia:
              </label>
              <select className="form-control" id="procedencia" required>
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
              <input type="text" className="form-control" id="fechaInput" />
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
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="correo" className="fw-bold">
                Correo:
              </label>
              <input type="email" className="form-control" id="correo" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="responsable" className="fw-bold">
                Responsable:
              </label>
              <select className="form-control" id="responsable" required>
                <option value="Responsable 1">Responsable 1</option>
                <option value="Responsable 2">Responsable 2</option>
                <option value="Responsable 3">Responsable 3</option>
                <option value="Responsable 4">Responsable 4</option>
                <option value="Responsable 5">Responsable 5</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="estatus">Estatus:</label>
              <select className="form-control" id="estatus">
                <option value="pendiente">Pendiente</option>
                <option value="realizado">Realizado</option>
                <option value="rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Link href="/">
            <button type="button" className="btn btn-secondary me-2">
              Cerrar
            </button>
          </Link>
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={handleDelete}
          >Borrar</button>
          <button type="submit" className="btn btn-primary">
            {params.id ? "Actualizar Solicitud" : "Crear Solicitud"}
          </button>
        </div>
      </form>
    </div>
  );
}
