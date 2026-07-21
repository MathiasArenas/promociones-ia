const XLSX = require("xlsx");

function leerPromociones(rutaExcel) {

    const workbook = XLSX.readFile(rutaExcel);

    const sheet = workbook.Sheets["Planilla"];

    if (!sheet) {
        throw new Error("No existe la hoja Planilla.");
    }

    const filas = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: ""
    });

    const promociones = [];

    // Fila 13 del Excel (índice 12)
    for (let i = 12; i < filas.length; i++) {

        const fila = filas[i];

        // Columna C (Código)
        const codigo = fila[1];

        if (!codigo) {
            break;
        }

        promociones.push({
            codigo: codigo,
            formatoPromocion: fila[5], // Columna G
            moneda: fila[6],           // Columna H
            accionCaja: fila[7]        // Columna I
        });
    }

    return promociones;
}

module.exports = {
    leerPromociones
};