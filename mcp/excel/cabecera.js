const XLSX = require("xlsx");

const CAMPOS = {
    nombreEvento: "Nombre de Evento:",
    areaSolicitante: "Area Solicitante:",
    nombreSolicitante: "Nombre Solicitante:",
    tipoEvento: "Tipo de Evento:",
    detallePromocion: "Detalle de Promoción:",
    fechaInicio: "Fecha Inicio:",
    fechaFin: "Fecha Fin:"
};

function buscarValor(sheet, textoBuscado) {

    const rango = XLSX.utils.decode_range(sheet["!ref"]);

    for (let fila = rango.s.r; fila <= rango.e.r; fila++) {

        for (let columna = rango.s.c; columna <= rango.e.c; columna++) {

            const direccion = XLSX.utils.encode_cell({
                r: fila,
                c: columna
            });

            const celda = sheet[direccion];

            if (!celda) {
                continue;
            }

            const valor = String(celda.v).trim();

            if (valor === textoBuscado) {

                const derecha = XLSX.utils.encode_cell({
                    r: fila,
                    c: columna + 1
                });

                return sheet[derecha] || null;

            }

        }

    }

    return null;

}

function convertirFechaExcel(numeroSerie) {

    const fecha = XLSX.SSF.parse_date_code(numeroSerie);

    if (!fecha) {
        return null;
    }

    const dia = String(fecha.d).padStart(2, "0");
    const mes = String(fecha.m).padStart(2, "0");
    const anio = fecha.y;

    return `${dia}/${mes}/${anio}`;

}

function leerCabecera(rutaExcel) {

    const workbook = XLSX.readFile(rutaExcel);

    const sheet = workbook.Sheets["Planilla"];

    if (!sheet) {
        throw new Error('No existe la hoja "Planilla".');
    }

    const resultado = {};

    for (const [campo, etiqueta] of Object.entries(CAMPOS)) {

        const celda = buscarValor(sheet, etiqueta);

        if (!celda) {
            resultado[campo] = null;
            continue;
        }

        if (
            (campo === "fechaInicio" || campo === "fechaFin")
            && celda.t === "n"
        ) {

            resultado[campo] = convertirFechaExcel(celda.v);

        } else {

            resultado[campo] = String(celda.v).trim();

        }

    }

    return resultado;

}

module.exports = {
    leerCabecera
};