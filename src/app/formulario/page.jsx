"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";
import "../../../public/Styles/styles.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Link from "next/link";

export default function FormularioPlantilla() {
  const flatpickrRef = useRef(null);
  const params = useParams();
  const router = useRouter();
  const [responsablesSeleccionados, setResponsablesSeleccionados] = useState(
    []
  );
  const opcionesResponsables = [
    {
      value: "Dirección de Administración",
      label: "Dirección de Administración",
      checked: false,
    },
    {
      value: "Dirección de Cultura",
      label: "Dirección de Cultura",
      checked: false,
    },
    {
      value: "Dirección de Desarrollo Económico, Turístico y Artesanal",
      label: "Dirección de Desarrollo Económico, Turístico y Artesanal",
      checked: false,
    },
    {
      value: "Dirección de Desarrollo Social y Asuntos Indígenas",
      label: "Dirección de Desarrollo Social y Asuntos Indígenas",
      checked: false,
    },
    {
      value: "Dirección de Desarrollo Urbano y Metropolitano",
      label: "Dirección de Desarrollo Urbano y Metropolitano",
      checked: false,
    },
    {
      value: "Dirección de Educación",
      label: "Dirección de Educación",
      checked: false,
    },
    {
      value: "Dirección de la Gerencia de la Ciudad",
      label: "Dirección de la Gerencia de la Ciudad",
      checked: false,
    },
    {
      value: "Dirección de Gobernación",
      label: "Dirección de Gobernación",
      checked: false,
    },
    {
      value: "Dirección de Gobierno Digital y Electrónico",
      label: "Dirección de Gobierno Digital y Electrónico",
      checked: false,
    },
    {
      value: "Dirección de Tesoreria",
      label: "Dirección de Tesoreria",
      checked: false,
    },
    {
      value: "Dirección de Gobierno por Resultados",
      label: "Dirección de Gobierno por Resultados",
      checked: false,
    },
    {
      value: "Dirección de Igualdad de Género",
      label: "Dirección de Igualdad de Género",
      checked: false,
    },
    {
      value: "Dirección de Medio Ambiente",
      label: "Dirección de Medio Ambiente",
      checked: false,
    },
    {
      value: "Dirección de Obras Públicas",
      label: "Dirección de Obras Públicas",
      checked: false,
    },
    {
      value: "Dirección de Seguridad Pública",
      label: "Dirección de Seguridad Pública",
      checked: false,
    },
    {
      value: "Dirección de Servicios Públicos",
      label: "Dirección de Servicios Públicos",
      checked: false,
    },
    {
      value: "Dirección de Transparencia y Gobierno Abierto",
      label: "Dirección de Transparencia y Gobierno Abierto",
      checked: false,
    },
    {
      value: "Tesorería Municipal",
      label: "Tesorería Municipal",
      checked: false,
    },
    {
      value: "Subdirección de Vinculación",
      label: "Subdirección de Vinculacion",
      checked: false,
    },
    {
      value: "Subdirección de Delegaciones",
      label: "Subdirección de Delegaciones",
      checked: false,
    },
    {
      value: "Subdirección de Política Sectorial",
      label: "Subdirección de Política Sectorial",
      checked: false,
    },
    {
      value: "Subdirección de Programas municipales",
      label: "Subdirección de Programas municipales",
      checked: false,
    },
    { value: "Otro", label: "Otro", checked: false },
  ];
  const [fechaMin, setFechaMin] = useState(new Date());
  const [formData, setFormData] = useState({
    solicitante: "",
    telefono: "",
    asunto: "",
    procedencia: "Oficio",
    correo: "",
    responsable: "Dirección de Administración",
    delegacion: "",
    fechaVen: "",
    estatus: "pendiente",
  });

  const handleCheckResponsable = (value) => {
    if (responsablesSeleccionados.includes(value)) {
      setResponsablesSeleccionados(
        responsablesSeleccionados.filter((item) => item !== value)
      );
    } else {
      setResponsablesSeleccionados([...responsablesSeleccionados, value]);
    }
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
      setFormData({
        responsable: responsablesSeleccionados.join(', '),
        solicitante: document.getElementById("solicitante").value,
        procedencia: document.getElementById("procedencia").value,
        correo: document.getElementById("correo").value,
        telefono: document.getElementById("telefono").value,
        asunto: document.getElementById("asunto").value,
        estatus: document.getElementById("estatus").value,
        delegacion: document.getElementById("delegacion").value,
        fechaVen: document.getElementById("fechaInput").value, // Obtener la fecha seleccionada
      });

      if (!params.id) {
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
          setFormData({
            solicitante: "",
            telefono: "",
            asunto: "",
            procedencia: "Oficio",
            correo: "",
            delegacion: "Barrio de Coaxustenco",
            responsable: "",
            fechaVen: "",
            estatus: idSolicitud ? formData.estatus : "pendiente", // Preserve existing status on edit
          });
        } else {
          alert("Error al enviar la solicitud");
        }
      } else {
        const response = await fetch(`/api/solicitudes/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert("Solicitud actualizada con éxito");
        } else {
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
        setFormData({
          responsable: solicitudData.responsable,
          solicitante: solicitudData.solicitante,
          correo: solicitudData.correo,
          telefono: solicitudData.telefono,
          asunto: solicitudData.asunto,
          estatus: solicitudData.estatus,
          delegacion: solicitudData.delegacion,
          fechaVen: solicitudData.fechaVen
            ? solicitudData.fechaVen.split("T")[0]
            : "", // Obtener la fecha sin la hora
          procedencia: solicitudData.procedencia,
        });
      } else {
        // Restablecer formData si no hay params.id (nueva solicitud)
        setFormData({
          solicitante: "",
          telefono: "",
          asunto: "",
          procedencia: "Oficio",
          correo: "",
          responsable: "",
          fechaVen: "",
          estatus: "pendiente",
        });
      }
    };
    fetchData();
  }, [params.id]); // Dependencia: params.id

  return (
    <div className="container mt-4" onSubmit={handleSubmit}>
      <h2 className="display-4 text-center">Solicitud</h2>
      <div className="header-container">
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
                <option value="Oficio">Oficio</option>
                <option value="Correo">Correo</option>
                <option value="Teléfono">Teléfono</option>
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
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="delegacion" className="fw-bold">
                Delegacion:
              </label>
              <select
                className="form-control"
                id="delegacion"
                onChange={handleChange}
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
                Responsable:
              </label>
              <div>
                {" "}
                {/* Contenedor para las opciones de la checklist */}
                {opcionesResponsables.map((opcion) => (
                  <div key={opcion.value} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={opcion.value}
                      id={`responsable-${opcion.value}`}
                      checked={responsablesSeleccionados.includes(opcion.value)}
                      onChange={() => handleCheckResponsable(opcion.value)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`responsable-${opcion.value}`}
                    >
                      {opcion.label}
                    </label>
                  </div>
                ))}
              </div>
              {responsablesSeleccionados.includes("Otro") && (
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Escriba el nombre del responsable"
                  onChange={(e) =>
                    setResponsablesSeleccionados([
                      ...responsablesSeleccionados.filter(
                        (item) => item !== "Otro"
                      ),
                      e.target.value,
                    ])
                  }
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
