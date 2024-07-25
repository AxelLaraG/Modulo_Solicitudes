"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'flatpickr/dist/flatpickr.min.css';

function Solicitud() {

  return (
    <div className="container mt-4">
      <div className="header-container">
        <h2 className="text-center">Solicitud</h2>
        <br />
      </div>

      <form id="formularioSolicitud">
        
          <input type="hidden" id="idSolicitud"/>
        
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="asunto" className="fw-bold">
              Asunto:
            </label>
            <input
              type="text"
              className="form-control"
              id="asunto"
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
                ref={flatpickr}
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
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="estatus">Estatus:</label>
                <select
                  className="form-control"
                  id="estatus"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="realizado">Realizado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
            </div>
        </div>
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => router.back()}
          >
            Cerrar
          </button>
          <button type="submit" className="btn btn-primary">
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
}

export default Solicitud;
