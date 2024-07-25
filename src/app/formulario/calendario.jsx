"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import flatpickr from "flatpickr";
import "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";

export default function Funciones() {
    //funcion para limitar l afecha de vencimiento
    const flatpickrRef = useRef(null);
    const [fechaMin, setFechaMin] = useState(new Date());
  
    useEffect(() => {
      flatpickrRef.current = flatpickr("#fechaInput", {
        minDate: fechaMin, // Establece la fecha mínima permitida
        dateFormat: "Y-m-d", // Formato de fecha (puedes ajustarlo)
        disableMobile: true,
        onChange: function (selectedDates, dateStr, instance) {
          const fechaSeleccionada = new Date(dateStr);
          if (fechaSeleccionada < fechaMin) {
            // Muestra un mensaje de error si la fecha es inválida
            document.getElementById("date-error").textContent =
              "La fecha no puede ser anterior a hoy.";
            document.getElementById("date-error").classList.remove("d-none");
          } else {
            // Oculta el mensaje de error si la fecha es válida
            document.getElementById("date-error").classList.add("d-none");
          }
        },
        locale: Spanish,
      });
    }, [fechaMin]);
  }