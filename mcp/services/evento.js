const github = require("../github");

const { listarEventos } = require("./eventos");

const { leerCabecera } = require("../excel/cabecera");

const { obtenerPromociones } = require("./promociones");

/**
 * Obtiene un evento completo a partir de su ID.
 *
 * Flujo:
 * 1. Busca el evento en el catálogo.
 * 2. Descarga el Excel.
 * 3. Lee la cabecera.
 * 4. Obtiene las promociones normalizadas.
 */
async function obtenerEvento(id) {

    // Obtener catálogo de eventos
    const catalogo = await listarEventos();

    // Buscar el evento solicitado
    const evento = catalogo.eventos.find(e => e.id === id);

    if (!evento) {
        throw new Error(`No existe un evento con id ${id}.`);
    }

    // Descargar nuevamente el Excel
    const rutaExcel = await github.descargarArchivo(evento.archivo);

    if (!rutaExcel) {
        throw new Error(`No fue posible descargar ${evento.archivo}.`);
    }

    // Leer información del evento
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