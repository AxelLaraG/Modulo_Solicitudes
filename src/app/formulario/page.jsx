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
import solicitud from "@/models/solicitud";

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
    responsable: [""],
    delegacion: "",
    fechaVen: "",
    estatus: "pendiente",
  });

  const [otroResponsable, setOtroResponsable] = useState("");
  const [showOtroInput, setShowOtroInput] = useState(false);
  const [responsables, setResponsables] = useState([]);

  const handleDelegacionChange = (event) => {
    setFormData({
      ...formData,
      delegacion: event.target.value,
    });
  };

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
      const responsables = document.getElementById("responsable").value;
      const solicitante = document.getElementById("solicitante").value;
      const procedencia = document.getElementById("procedencia").value;
      const correo = document.getElementById("correo").value;
      const telefono = document.getElementById("telefono").value;
      const asunto = document.getElementById("asunto").value;
      const estatus = document.getElementById("estatus").value;
      const fechaVen = document.getElementById("fechaInput").value;
      const delegacion = document.getElementById("delegacion").value;

      // Actualizar formData con el valor de otroResponsable si es necesario
      const responsableFinal = showOtroInput
        ? [...responsables, otroResponsable] // Incluir "Otro" si está activo
        : responsables;
      setFormData({
        responsable: responsableFinal,
        delegacion,
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
            delegacion: "",
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
          responsable:
            esOtroResponsable && tieneOtroResponsable
              ? solicitudData.otroResponsable
              : solicitudData.responsable,
          delegacion: solicitudData.delegacion,
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
        setOtroResponsable(
          esOtroResponsable && tieneOtroResponsable
            ? solicitudData.otroResponsable
            : ""
        );
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
    setShowOtroInput(nuevoResponsable === "Otro");

    if (nuevoResponsable === "Otro") {
      setResponsables([...responsables, otroResponsable]); // Agregar el responsable "Otro"
      setOtroResponsable(""); // Limpiar el input de "Otro"
    } else {
      setResponsables([...responsables, nuevoResponsable]); // Agregar el responsable seleccionado
    }
  };
  const handleEliminarResponsable = (index) => {
    setResponsables(responsables.filter((_, i) => i !== index));
    // Si se elimina el último responsable y "Otro" estaba activo, desactivarlo
    if (responsables.length === 1 && showOtroInput) {
      setShowOtroInput(false);
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
              <label htmlFor="delegacion" className="fw-bold">
                Delegacion:
              </label>
              <select
                className="form-control"
                id="delegacion"
                onChange={handleDelegacionChange}
                value={formData.delegacion}
                required
              >
                <option value="Barrio de Coaxustenco">
                  Barrio de Coaxustenco
                </option>
                <option value="Barrio de San Mateo">Barrio de San Mateo</option>
                <option value="Barrio de San Miguel">
                  Barrio de San Miguel
                </option>
                <option value="Barrio de Santa Cruz">
                  Barrio de Santa Cruz
                </option>
                <option value="Barrio de Santa Cruz Ocotitlán">
                  Barrio de Santa Cruz Ocotitlán
                </option>
                <option value="Barrio de Santiaguito">
                  Barrio de Santiaguito
                </option>
                <option value="Barrio del Espíritu Santo">
                  Barrio del Espíritu Santo
                </option>
                <option value="Colonia Agrícola Alvaro Obregón">
                  Colonia Agrícola Alvaro Obregón
                </option>
                <option value="Colonia Agrícola Bellavista">
                  Colonia Agrícola Bellavista
                </option>
                <option value="Colonia Agrícola Francisco I. Madero">
                  Colonia Agrícola Francisco I. Madero
                </option>
                <option value="Colonia Agrícola Lázaro Cárdenas">
                  Colonia Agrícola Lázaro Cárdenas
                </option>
                <option value="Colonia Dr. Jorge Jiménez Cantu">
                  Colonia Dr. Jorge Jiménez Cantu
                </option>
                <option value="Colonia El Hípico">Colonia El Hípico</option>
                <option value="Colonia La Michoacana">
                  Colonia La Michoacana
                </option>
                <option value="Colonia La Providencia">
                  Colonia La Providencia
                </option>
                <option value="Colonia Luisa Isabel Campos de Jiménez Cantú">
                  Colonia Luisa Isabel Campos de Jiménez Cantú
                </option>
                <option value="Col. La Municipal">Col. La Municipal</option>
                <option value="Colonia La Unión">Colonia La Unión</option>
                <option value="Condominio Agripin García Estrada">
                  Condominio Agripin García Estrada
                </option>
                <option value="Fraccionamiento Casa Blanca">
                  Fraccionamiento Casa Blanca
                </option>
                <option value="Fraccionamiento Fuentes de San Gabriel">
                  Fraccionamiento Fuentes de San Gabriel
                </option>
                <option value="Fraccionamiento Izcalli Cuauhtémoc I">
                  Fraccionamiento Izcalli Cuauhtémoc I
                </option>
                <option value="Fraccionamiento Izcalli Cuauhtémoc II">
                  Fraccionamiento Izcalli Cuauhtémoc II
                </option>
                <option value="Fraccionamiento Izcalli Cuauhtémoc III">
                  Fraccionamiento Izcalli Cuauhtémoc III
                </option>
                <option value="Fraccionamiento Izcalli Cuauhtémoc IV">
                  Fraccionamiento Izcalli Cuauhtémoc IV
                </option>
                <option value="Fraccionamiento Izcalli Cuauhtémoc V">
                  Fraccionamiento Izcalli Cuauhtémoc V
                </option>
                <option value="Fraccionamiento Izcalli Cuauhtémoc VI">
                  Fraccionamiento Izcalli Cuauhtémoc VI
                </option>
                <option value="Fraccionamiento Jesús Jiménez Gallardo">
                  Fraccionamiento Jesús Jiménez Gallardo
                </option>
                <option value="Fraccionamiento Las Haciendas">
                  Fraccionamiento Las Haciendas
                </option>
                <option value="Fraccionamiento Las Margaritas">
                  Fraccionamiento Las Margaritas
                </option>
                <option value="Fraccionamiento Las Marinas">
                  Fraccionamiento Las Marinas
                </option>
                <option value="Fraccionamiento Licenciado Juan Fernández Albarrán">
                  Fraccionamiento Licenciado Juan Fernández Albarrán
                </option>
                <option value="Fraccionamiento Los Pilares">
                  Fraccionamiento Los Pilares
                </option>
                <option value="Fraccionamiento Rancho San Francisco">
                  Fraccionamiento Rancho San Francisco
                </option>
                <option value="Fraccionamiento Rancho San Lucas">
                  Fraccionamiento Rancho San Lucas
                </option>
                <option value="Fraccionamiento San Javier">
                  Fraccionamiento San Javier
                </option>
                <option value="Fraccionamiento San José La Pila">
                  Fraccionamiento San José La Pila
                </option>
                <option value="Fraccionamiento Xinantecátl">
                  Fraccionamiento Xinantecátl
                </option>
                <option value="Pueblo de San Bartolomé Tlaltelulco">
                  Pueblo de San Bartolomé Tlaltelulco
                </option>
                <option value="Pueblo de San Francisco Coaxusco">
                  Pueblo de San Francisco Coaxusco
                </option>
                <option value="Pueblo de San Gaspar Tlalhuelilpan">
                  Pueblo de San Gaspar Tlalhuelilpan
                </option>
                <option value="Pueblo de San Jerónimo Chicahualco">
                  Pueblo de San Jerónimo Chicahualco
                </option>
                <option value="Pueblo de San Jorge Pueblo Nuevo">
                  Pueblo de San Jorge Pueblo Nuevo
                </option>
                <option value="Pueblo de San Lorenzo Coacalco">
                  Pueblo de San Lorenzo Coacalco
                </option>
                <option value="Pueblo de San Lucas Tunco">
                  Pueblo de San Lucas Tunco
                </option>
                <option value="Pueblo de San Miguel Totocuitlapilco">
                  Pueblo de San Miguel Totocuitlapilco
                </option>
                <option value="Pueblo de San Salvador Tizatlali">
                  Pueblo de San Salvador Tizatlali
                </option>
                <option value="Pueblo de San Sebastian">
                  Pueblo de San Sebastian
                </option>
                <option value="Pueblo de Santa María Magdalena Ocotitlán">
                  Pueblo de Santa María Magdalena Ocotitlán
                </option>
                <option value="Unidad Habitacional Andrés Molina Enríquez">
                  Unidad Habitacional Andrés Molina Enríquez
                </option>
                <option value="Unidad Habitacional Lázaro Cardenas">
                  Unidad Habitacional Lázaro Cardenas
                </option>
                <option value="Unidad Habitacional Tollocan II">
                  Unidad Habitacional Tollocan II
                </option>
              </select>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="responsable" className="fw-bold">
                Responsable(s):
              </label>
              <select
                className="form-control"
                id="responsable"
                onChange={handleResponsableChange}
                value={formData.responsable} // No seleccionar ningún valor por defecto
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
              {showOtroInput && (
                <input
                  id="otroResponsable"
                  type="text"
                  className="form-control mt-2"
                  placeholder="Escribe el responsable"
                  value={otroResponsable}
                  onChange={(e) => setOtroResponsable(e.target.value)}
                  required
                />
              )}
            </div>
            <div
              style={{
                maxHeight: "100px",
                overflowY: "auto",
                marginTop: "12px",
              }}
            >
              <ul className="list-group">
                {responsables.map((responsable, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {responsable}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminarResponsable(index)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </li>
                ))}
              </ul>
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
