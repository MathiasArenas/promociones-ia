const github = require("../github");

const { buscarEventoPorId } = require("./eventos");

const { leerCabecera } = require("../excel/cabecera");

const { obtenerPromociones } = require("./promociones");

/**
 * Obtiene un evento completo.
 */
async function obtenerEvento(id) {

    const evento = await buscarEventoPorId(id);

    if (!evento) {

        throw new Error(`No existe un evento con id ${id}.`);

    }

    const rutaExcel = await github.descargarArchivo(evento.archivo);

    if (!rutaExcel) {

        throw new Error(`No fue posible descargar ${evento.archivo}.`);

    }

    const { generarResumen } =
    require("./resumen");

    const resumen =
    generarResumen(promociones);

    const resumen = generarResumen(promociones);

    return {

        id: evento.id,

        archivo: evento.archivo,

        cabecera,

        resumen,

        promociones

    };

    const cabecera = leerCabecera(rutaExcel);

    const promociones = obtenerPromociones(rutaExcel);

    return {

        id: evento.id,

        archivo: evento.archivo,

        cabecera,

        promociones

    };

}

module.exports = {

    obtenerEvento

};