import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function exportToExcel(data, filename) {
  // Seleccionamos solo las columnas deseadas
  const dataForExcel = data.map(item => ({
    Asunto: item.asunto,
    Responsable: item.responsable.join(", "),
    Fecha_Creación: item.fecha.slice(0, 10),
    Fecha_Vencimiento: item.fechaVen.slice(0, 10),
    Solicitante: item.estatus,
    Procedencia: item.procedencia,
    Estatus: item.estatus,
    Teléfono: item.telefono,
    Correo: item.correo,
    Delegación: item.delegacion,
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

