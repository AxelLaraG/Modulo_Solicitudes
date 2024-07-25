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

function Principal() {
  const [solicitudesData, setSolicitudesData] = useState([]);
  const [filtroCriterio, setFiltroCriterio] = useState("todos");
  const [filtroValor, setFiltroValor] = useState("");
  const tablaSolicitudesRef = useRef(null);
  const rendimientoContainerRef = useRef(null);

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
  }, []); // El array vacío asegura que esto solo se ejecute una vez al cargar el componente

  const filterData = (data, criterio, valorFiltro) => {
    if (criterio === "todos" || valorFiltro === "") {
      return data;
    } else if (criterio === "estatus") {
      return data.filter((solicitud) => solicitud.estatus === valorFiltro);
    } else if (criterio === "fecha") {
      const fechaFiltro = new Date(valorFiltro);
      return data.filter((solicitud) => {
        const fechaSolicitud = new Date(solicitud.fecha);
        return fechaSolicitud.toDateString() === fechaFiltro.toDateString();
      });
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
      filtroValor
    );

    if (tablaSolicitudesRef.current) {
      tablaSolicitudesRef.current.innerHTML = solicitudesAMostrar
        .map(
          (solicitud) =>
            `<tr key={solicitud.id}> 
                <td>${new Date(solicitud.fecha).toLocaleDateString()}</td>
                <td>${solicitud.solicitante}</td>
                <td>${solicitud.asunto}</td>
                <td>${solicitud.responsable}</td>
                <td>${
                  solicitud.estatus === "realizado"
                    ? '<i class="bi bi-check-circle-fill text-success"></i>'
                    : solicitud.estatus === "pendiente"
                    ? '<i class="bi bi-circle-fill text-warning"></i>'
                    : '<i class="bi bi-x-circle-fill text-danger"></i>'
                }</td>
            </tr>`
        )
        .join(""); // Unimos las filas en un string
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [solicitudesData, filtroCriterio, filtroValor]); // Actualizamos cuando cambien los datos o filtros

  // Función para manejar el cambio del filtroCriterio
  const handleFiltroCriterioChange = (event) => {
    setFiltroCriterio(event.target.value);
    setFiltroValor(""); // Restablecer el valor del filtro al cambiar el criterio
  };

  // Función para manejar el cambio del filtroValor
  const handleFiltroValorChange = (event) => {
    setFiltroValor(event.target.value);
  };

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
            <option value="fecha">Fecha</option>
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
            <input
              type="date"
              className="form-control"
              id="filtroValor"
              ref={flatpickr}
              value={filtroValor}
              onChange={handleFiltroValorChange}
            />
          ) : (
            <input
              type="text"
              className="form-control"
              id="filtroValor"
              placeholder="Buscar..."
              value={filtroValor}
              onChange={handleFiltroValorChange}
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
          <button id="botonCrear" className="btn btn-primary">
            Crear Nuevo Registro
          </button>
        </Link>

        <button
          id="botonDescargar"
          className="btn btn-primary"
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

export default Principal;
