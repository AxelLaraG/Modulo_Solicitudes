function exportToExcel(data, filename) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Solicitudes");
    
    // Usar saveAs de FileSaver.js para la descarga
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF;
    
    saveAs(new Blob([buf], { type: "application/octet-stream" }), filename);
}

// Función para filtrar datos basados en el criterio y valor del filtro
function filterData(solicitudesData, criterio, valorFiltro) {
    let datosAMostrar = solicitudesData;

    if (criterio === "fecha" && valorFiltro) {
        const fechaFiltro = new Date(valorFiltro);

        datosAMostrar = solicitudesData.filter((solicitud) => {
            const fechaRegistro = new Date(solicitud.fecha);
            return (
                (!valorFiltro || fechaRegistro.getFullYear() === fechaFiltro.getFullYear()) &&
                (!valorFiltro || fechaRegistro.getMonth() === fechaFiltro.getMonth()) &&
                (!valorFiltro || fechaRegistro.getDate() === fechaFiltro.getDate())
            );
        });
    } else if (valorFiltro) {
        datosAMostrar = solicitudesData.filter((solicitud) => {
            if (criterio === "todos") {
                return Object.values(solicitud).some((valor) =>
                    String(valor).toLowerCase().includes(valorFiltro.toLowerCase())
                );
            } else if (criterio === "estatus") {
                return valorFiltro === "" || solicitud.estatus === valorFiltro;
            } else {
                return String(solicitud[criterio]).toLowerCase().includes(valorFiltro.toLowerCase());
            }
        });
    }

    return datosAMostrar;
}

// Exportar funciones para que sean accesibles desde otros scripts
window.exportToExcel = exportToExcel;
window.filterData = filterData;