import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function exportToExcel(data, filename) {
  // Seleccionamos solo las columnas deseadas
  const dataForExcel = data.map(item => ({
    Asunto: item.asunto,
    Responsable: item.responsable ? item.responsable.join(", ") : '',
    Fecha_Creación: item.fecha ? item.fecha.slice(0, 10) : 'N/A',
    Fecha_Vencimiento: item.fechaVen ? item.fechaVen.slice(0, 10) : 'N/A',
    Solicitante: item.solicitante || 'N/A',
    Procedencia: item.procedencia || 'N/A',
    Estatus: item.estatus || 'N/A',
    Teléfono: item.telefono || 'N/A',
    Correo: item.correo || 'N/A',
    Delegación: item.delegacion || 'N/A',
  }));

  const ws = XLSX.utils.json_to_sheet(dataForExcel);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Solicitudes");

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const buf = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF;

  saveAs(new Blob([buf], { type: "application/octet-stream" }), filename);
}

export { exportToExcel };
