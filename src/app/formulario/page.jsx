"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
  const [formData, setFormData] = useState({
    solicitante: "",
    telefono: "",
    asunto: "",
    procedencia: "",
    correo: "",
    responsable: "",
    fechaVen: "",
    estatus: "pendiente",
  });

  const [otroResponsable, setOtroResponsable] = useState("");
  const [showOtroInput, setShowOtroInput] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleClearDate = () => {
    // Borrar la fecha en flatpickr
    flatpickrRef.current?.clear();

    // Borrar la fecha en el estado formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      fechaVen: "",
    }));
  };

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
      // Obtener los valores de todos los campos del formulario
      const responsableSeleccionado =
        document.getElementById("responsable").value;
      const solicitante = document.getElementById("solicitante").value;
      const procedencia = document.getElementById("procedencia").value;
      const correo = document.getElementById("correo").value;
      const telefono = document.getElementById("telefono").value;
      const asunto = document.getElementById("asunto").value;
      const estatus = document.getElementById("estatus").value;
      const fechaVen = document.getElementById("fechaInput").value; // Obtener la fecha seleccionada

      // Actualizar formData con el valor de otroResponsable si es necesario
      const responsableFinal = showOtroInput ? otroResponsable : formData.responsable;
      setFormData({
        responsable: responsableFinal,
        solicitante,
        procedencia,
        correo,
        telefono,
        asunto,
        estatus,
        fechaVen,
      });

      // Verificar si estamos creando una nueva solicitud (no hay params.id) o editando una existente
      if (!params.id) {
        // Crear una nueva solicitud
        const response = await fetch("/api/solicitudes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Solicitud creada con éxito
          alert("Solicitud enviada con éxito");

          // Restablecer el formulario para una nueva solicitud
          setFormData({
            solicitante: "",
            telefono: "",
            asunto: "",
            procedencia: "",
            correo: "",
            responsable: "",
            fechaVen: "",
            estatus: "pendiente",
          });

          // Opcional: Redirigir a otra página después de crear la solicitud
          // router.push("/ruta-de-redireccion");
        } else {
          // Error al crear la solicitud
          alert("Error al enviar la solicitud");
        }
      } else {
        // Actualizar una solicitud existente
        const response = await fetch(`/api/solicitudes/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Solicitud actualizada con éxito
          alert("Solicitud actualizada con éxito");
        } else {
          // Error al actualizar la solicitud
          alert("Error al actualizar la solicitud");
        }
      }
    } catch (error) {
      console.error(error.message); // Manejar el error
    }
  };

  useEffect(() => {
    // Inicializar flatpickr una sola vez al montar el componente

    flatpickrRef.current = flatpickr("#fechaInput", {
      minDate: fechaMin,
      dateFormat: "Y-m-d",
      disableMobile: true,
      // Configurar el manejador onChange para actualizar el estado
      onChange: function (selectedDates, dateStr, instance) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          fechaVen: dateStr,
        }));
      },
      locale: Spanish,
    });
    // Si estamos editando, establecer la fecha inicial
    if (params.id && formData.fechaVen) {
      flatpickrRef.current.setDate(formData.fechaVen.split("T")[0]);
    }
    return () => {
      flatpickrRef.current?.destroy(); // Limpiar al desmontar
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (params.id) {
        const response = await fetch(`/api/solicitudes/${params.id}`);
        const solicitudData = await response.json();
  
        // Verificar si el responsable es "Otro" y si hay un valor para otroResponsable
        const esOtroResponsable = solicitudData.responsable === "Otro";
        const tieneOtroResponsable = !!solicitudData.otroResponsable;
  
        setFormData({
          responsable: esOtroResponsable && tieneOtroResponsable ? solicitudData.otroResponsable : solicitudData.responsable,
          solicitante: solicitudData.solicitante,
          correo: solicitudData.correo,
          telefono: solicitudData.telefono,
          asunto: solicitudData.asunto,
          estatus: solicitudData.estatus,
          fechaVen: solicitudData.fechaVen
            ? solicitudData.fechaVen.split("T")[0]
            : "",
          procedencia: solicitudData.procedencia,
        });
  
        // Mostrar el campo de entrada "Otro" si es necesario
        setShowOtroInput(esOtroResponsable && tieneOtroResponsable);
  
        // Establecer el valor de otroResponsable si existe
        setOtroResponsable(esOtroResponsable && tieneOtroResponsable ? solicitudData.otroResponsable : "");
      } else {
        // ... (Restablecer formData si no hay params.id)
      }
    };
  
    fetchData();
  }, [params.id]); // Dependencia: params.id
  

  useEffect(() => {
    const opcionesResponsables = [
      "Dirección de Administración",
      "Dirección de Cultura",
      "Dirección de Desarrollo Económico, Turístico y Artesanal",
      "Dirección de Desarrollo Social y Asuntos Indígenas",
      "Dirección de Desarrollo Urbano y Metropolitano",
      "Dirección de Educación",
      "Dirección de la Gerencia de la Ciudad",
      "Dirección de Gobernación",
      "Dirección de Gobierno Digital y Electrónico",
      "Dirección de Gobierno por Resultados",
      "Dirección de Igualdad de Género",
      "Dirección de Medio Ambiente",
      "Dirección de Obras Públicas",
      "Dirección de Seguridad Pública",
      "Dirección de Servicios Públicos",
      "Dirección de Transparencia y Gobierno Abierto",
      "Subdirección de Vinculacion",
      "Subdirección de Delegaciones",
      "Subdirección de Política Sectorial",
      "Subdirección de Programas municipales",
    ];
    if (
      params.id &&
      formData.responsable &&
      !opcionesResponsables.includes(formData.responsable)
    ) {
      setShowOtroInput(true);
    }
  }, [params.id, formData.responsable]);

  const handleResponsableChange = (e) => {
    const nuevoResponsable = e.target.value;
    setFormData({ ...formData, responsable: nuevoResponsable }); // Actualizar formData directamente
    setShowOtroInput(nuevoResponsable === "Otro");
  
    // Restablecer otroResponsable si no se selecciona "Otro"
    if (nuevoResponsable !== "Otro") {
      setOtroResponsable(""); 
    }
  };
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
            <input
              type="text"
              className="form-control"
              id="asunto"
              onChange={handleChange}
              value={formData.asunto}
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
                onChange={handleChange}
                value={formData.solicitante}
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
                onChange={handleChange}
                value={formData.procedencia}
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
                onChange={handleChange}
                value={formData.fechaVen}
              />
              <div id="date-error" className="invalid-feedback d-none"></div>
            </div>
          </div>
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
                onChange={handleChange}
                value={formData.telefono}
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
                onChange={handleChange}
                value={formData.correo}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="responsable" className="fw-bold">
                Responsable:
              </label>
              <select
                className="form-control"
                id="responsable"
                onChange={handleResponsableChange}
                value={formData.responsable}
                required
              >
                <option value="Dirección de Administración">
                  Dirección de Administración
                </option>
                <option value="Dirección de Cultura">
                  Dirección de Cultura
                </option>
                <option value="Dirección de Desarrollo Económico, Turístico y Artesanal">
                  Dirección de Desarrollo Económico, Turístico y Artesanal
                </option>
                <option value="Dirección de Desarrollo Social y Asuntos Indígenas">
                  Dirección de Desarrollo Social y Asuntos Indígenas
                </option>
                <option value="Dirección de Desarrollo Urbano y Metropolitano">
                  Dirección de Desarrollo Urbano y Metropolitano
                </option>
                <option value="Dirección de Educación">
                  Dirección de Educación
                </option>
                <option value="Dirección de la Gerencia de la Ciudad">
                  Dirección de la Gerencia de la Ciudad
                </option>
                <option value="Dirección de Gobernación">
                  Dirección de Gobernación
                </option>
                <option value="Dirección de Gobierno Digital y Electrónico">
                  Dirección de Gobierno Digital y Electrónico
                </option>
                <option value="Dirección de Gobierno por Resultados">
                  Dirección de Gobierno por Resultados
                </option>
                <option value="Dirección de Igualdad de Género">
                  Dirección de Igualdad de Género
                </option>
                <option value="Dirección de Medio Ambiente">
                  Dirección de Medio Ambiente
                </option>
                <option value="Dirección de Obras Públicas">
                  Dirección de Obras Públicas
                </option>
                <option value="Dirección de Seguridad Pública">
                  Dirección de Seguridad Pública
                </option>
                <option value="Dirección de Servicios Públicos">
                  Dirección de Servicios Públicos
                </option>
                <option value="Dirección de Transparencia y Gobierno Abierto">
                  Dirección de Transparencia y Gobierno Abierto
                </option>
                <option value="Subdirección de Vinculacion">
                  Subdirección de Vinculacion
                </option>
                <option value="Subdirección de Delegaciones">
                  Subdirección de Delegaciones
                </option>
                <option value="Subdirección de Política Sectorial">
                  Subdirección de Política Sectorial
                </option>
                <option value="Subdirección de Programas municipales">
                  Subdirección de Programas municipales
                </option>
                <option>Otro</option>
              </select>
              {showOtroInput && ( // Show the input only when "Otro" is selected
                <input
                  id="responsable"
                  type="text"
                  className="form-control mt-2"
                  placeholder="Escribe el responsable"
                  value={otroResponsable} // Use the state variable for the input
                  onChange={(e) => setOtroResponsable(e.target.value)} // Update the state variable
                  required
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <Link href="/">
            <button type="button" className="btn btn-secondary me-2">
              Cerrar
            </button>
          </Link>
          {params.id && ( // Mostrar botón solo si params.id existe
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={handleDelete}
            >
              Borrar
            </button>
          )}
          {params.id && formData.fechaVen && (
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={handleClearDate}
            >
              Borrar Fecha de Vencimiento
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {params.id ? "Actualizar Solicitud" : "Crear Solicitud"}
          </button>
        </div>
      </form>
    </div>
  );
}
