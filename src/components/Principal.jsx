"use client";

import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { exportToExcel } from "../utils/exportToExcel";
import { useRouter } from "next/navigation";
import "../../public/Styles/styles.css";
import Link from "next/link";
import flatpickr from "flatpickr";
import "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";

export default function Principal() {
  const [solicitudesData, setSolicitudesData] = useState([]);
  const [filtroCriterio, setFiltroCriterio] = useState("todos");
  const [filtroValor, setFiltroValor] = useState("");
  const tablaSolicitudesRef = useRef(null);
  const rendimientoContainerRef = useRef(null);
  const [filtroValorOtro, setFiltroValorOtro] = useState("");
  const [filtroValorOtroBusqueda, setFiltroValorOtroBusqueda] = useState("");

  const router = useRouter(); // Inicializa useRouter

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/solicitudes"); // Ruta de tu API Route
      const data = await response.json();
      setSolicitudesData(data);

      // Calcular y mostrar el rendimiento
      const resueltos = data.filter(
        (solicitud) => solicitud.estatus === "realizado"
      ).length;
      const rechazados = data.filter(
        (solicitud) => solicitud.estatus === "rechazado"
      ).length;
      const pendientes = data.filter(
        (solicitud) => solicitud.estatus === "pendiente"
      ).length;
      const rendimiento = Math.round(
        ((resueltos + rechazados) / (resueltos + pendientes + rechazados)) * 100
      );
      const r = 255 - Math.round(2.55 * rendimiento);
      const g = Math.round(2.55 * rendimiento);
      const colorRGB = `rgb(${r}, ${g}, 0)`;

      if (rendimientoContainerRef.current) {
        rendimientoContainerRef.current.innerHTML = `
                <div class="rendimiento-box">
                    <div class="asuntos-resueltos">${resueltos}</div>
                    <div><p>Asuntos Resueltos</p></div>
                </div>
                <div class="rendimiento-box">
                    <div class="asuntos-pendientes">${pendientes}</div>
                    <div>Asuntos Pendientes</div>
                </div>
                <div class="rendimiento-box">
                    <div class="rendimiento-general" style="color: ${colorRGB}">${rendimiento}%</div>
                    <div>Rendimiento General</div>
                </div>
            `;
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const fechaInput = document.getElementById("filtroValor");
    if (filtroCriterio === "fecha" && fechaInput) {
      flatpickr.current = flatpickr(fechaInput, {
        locale: "es",
        onChange: (selectedDates) => {
          if (selectedDates.length > 0) {
            const fechaSeleccionada = selectedDates[0];
            setFiltroValor(fechaSeleccionada.toISOString().split("T")[0]);
            cargarSolicitudes();
          }
        },
      });
    } else if (flatpickr.current) {
      flatpickr.current.destroy();
      flatpickr.current = null;
    }
  }, [filtroCriterio]);

  const filterData = (data, criterio, valorFiltro, valorFiltroOtroBusqueda) => {
    if (criterio === "todos" || valorFiltro === "") {
      return data;
    } else if (criterio === "estatus") {
      return data.filter((solicitud) => solicitud.estatus === valorFiltro);
    } else if (criterio === "fecha") {
      const fechaFiltro = new Date(valorFiltro);
      fechaFiltro.setHours(23, 59, 59, 999);

      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0);

      return data.filter((solicitud) => {
        const fechaSolicitud = new Date(solicitud.fechaVen);
        return (
          fechaSolicitud.getTime() >= fechaActual.getTime() &&
          fechaSolicitud.getTime() <= fechaFiltro.getTime()
        );
      });
    } else if (criterio === "responsable") {
      const valorComparacion = 
          valorFiltro === "otro" && valorFiltroOtroBusqueda // Usamos el valor de búsqueda
              ? valorFiltroOtroBusqueda.toLowerCase()     
              : valorFiltro.toLowerCase();

      return data.filter((solicitud) =>
        solicitud[criterio].toLowerCase().includes(valorComparacion)
      );
    } else {
      const valorFiltroLower = valorFiltro.toLowerCase();
      return data.filter((solicitud) =>
        solicitud[criterio].toLowerCase().includes(valorFiltroLower)
      );
    }
  };

  const cargarSolicitudes = () => {
    const solicitudesAMostrar = filterData(
      solicitudesData,
      filtroCriterio,
      filtroValor,
      filtroValorOtro,
      filtroValorOtroBusqueda // Incluimos el valor de búsqueda
    );

    if (tablaSolicitudesRef.current) {
      tablaSolicitudesRef.current.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

      solicitudesAMostrar.forEach((solicitud) => {
        const row = document.createElement("tr");
        row.setAttribute("key", solicitud._id);

        const columns = [
          new Date(solicitud.fecha).toLocaleDateString(),
          solicitud.solicitante,
          solicitud.asunto.length > 5
            ? solicitud.asunto.slice(0, 5) + "..."
            : solicitud.asunto,
          solicitud.responsable,
          solicitud.estatus === "realizado"
            ? '<i class="bi bi-check-circle-fill text-success"></i>'
            : solicitud.estatus === "pendiente"
            ? '<i class="bi bi-circle-fill text-warning"></i>'
            : '<i class="bi bi-x-circle-fill text-danger"></i>',
        ];

        columns.forEach((columnText) => {
          const cell = document.createElement("td");
          cell.innerHTML = columnText;
          cell.addEventListener("click", () => {
            router.push("/formulario/" + solicitud._id);
          });
          row.appendChild(cell);
        });

        tablaSolicitudesRef.current.appendChild(row);
      });
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [solicitudesData, filtroCriterio, filtroValor, filtroValorOtro]); // Actualizamos cuando cambien los datos o filtros

  // Función para manejar el cambio del filtroCriterio
  const handleFiltroCriterioChange = (event) => {
    setFiltroCriterio(event.target.value);
    setFiltroValor(""); // Restablecer el valor del filtro al cambiar el criterio
  };

  // Función para manejar el cambio del filtroValor
  const handleFiltroValorChange = (event) => {
    const nuevoValor = event.target.value;
    setFiltroValor(nuevoValor);

    // Limpiar filtroValorOtro solo si se selecciona una opción diferente de "otro"
    if (nuevoValor !== "otro") {
      setFiltroValorOtro("");
    }
  };

  const handleFiltroValorOtroChange = (event) => {
    setFiltroValorOtro(event.target.value);
  };

  const handleFiltroValorChangeD = (selectedDates) => {
    if (selectedDates.length > 0) {
      const fechaSeleccionada = selectedDates[0];
      setFiltroValor(fechaSeleccionada.toISOString().split("T")[0]);
    }
  };

  function Flatpickr({ className, ...props }) {
    const inputRef = useRef(null);

    useEffect(() => {
      flatpickr.setDefaults({
        dateFormat: "Y-m-d",
        locale: "es",
        minDate: "today",
      }); // Establecemos el formato por defecto
      const fp = flatpickr(inputRef.current, {
        ...props,
        onClose: (selectedDates) => {
          if (selectedDates.length > 0) {
            const fechaSeleccionada = selectedDates[0]
              .toISOString()
              .split("T")[0];
            inputRef.current.value = fechaSeleccionada; // Actualizamos el valor del input
          }
        },
      });

      return () => {
        fp.destroy(); // Destruimos la instancia al desmontar
      };
    }, []);

    return (
      <div>
        <input
          ref={inputRef}
          className={className}
          type="text"
          value={filtroValor}
        />
      </div>
    );
  }
  return (
    <div className="container mt-5">
      <h2 className="display-4">Registros de Solicitudes</h2>

      {/* Contenedor de rendimiento */}
      <div
        className="rendimiento-container"
        ref={rendimientoContainerRef}
      ></div>

      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-control"
            id="filtroCriterio"
            value={filtroCriterio}
            onChange={handleFiltroCriterioChange}
          >
            <option value="todos">Todos los campos</option>
            <option value="responsable">Responsable</option>
            <option value="estatus">Estatus</option>
            <option value="solicitante">Solicitante</option>
            <option value="fecha">Fecha de Vencimiento</option>
          </select>
        </div>
        <div className="col-md-9" id="contenedorFiltroValor">
          {filtroCriterio === "estatus" ? (
            <select
              className="form-control"
              id="filtroValor"
              value={filtroValor}
              onChange={handleFiltroValorChange}
            >
              <option value="">Todos los estatus</option>
              <option value="realizado">Realizado</option>
              <option value="pendiente">Pendiente</option>
              <option value="rechazado">Rechazado</option>
            </select>
          ) : filtroCriterio === "fecha" ? (
            <Flatpickr
              className="form-control"
              id="filtroValor"
              value={filtroValor}
              onChange={handleFiltroValorChangeD}
            />
          ) : filtroCriterio === "responsable" ? (
            <div>
              <select
                className="form-control"
                id="filtroValor"
                value={filtroValor}
                onChange={handleFiltroValorChange}
              >
                <option value="">Todos los responsables</option>
                <option value="Tesorería Municipal">
                  Tesorería Municipal
                </option>
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
                <option value="otro">Otro</option>
              </select>
              {filtroValor === "otro" && (
                <input
                type="text"
                className="form-control mt-2"
                placeholder="Escribe el responsable"
                value={filtroValorOtroBusqueda} // Conectamos al estado de búsqueda
                onChange={(e) => {
                  setFiltroValorOtroBusqueda(e.target.value); 
                  handleFiltroValorOtroChange(e);  // Actualizamos ambos estados
                }}
              />
              )}
            </div>
          ) : (
            <input
              type="text"
              className="form-control"
              id="filtroValor"
              placeholder="Buscar..."
              value={filtroValor}
              onChange={handleFiltroValorOtroChange}
            />
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Fecha de Creación</th>
              <th>Solicitante</th>
              <th>Asunto</th>
              <th>Responsable</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody ref={tablaSolicitudesRef}></tbody>
        </table>
      </div>

      <div className="fixed-button">
        <Link href="/formulario">
          <button id="botonCrear" className="btn btn-primary me-2">
            Crear Nuevo Registro
          </button>
        </Link>

        <button
          id="botonDescargar"
          className="btn btn-primary "
          onClick={() => {
            const datosFiltrados = filterData(
              solicitudesData,
              filtroCriterio,
              filtroValor
            );
            if (datosFiltrados.length > 0) {
              exportToExcel(datosFiltrados, "solicitudes.xlsx");
            } else {
              alert("No hay datos para exportar.");
            }
          }}
        >
          Descargar Excel
        </button>
      </div>
    </div>
  );
}
