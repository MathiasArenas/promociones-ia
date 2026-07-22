const github = require("../github");
const cabecera = require("../excel/cabecera");

/**
 * Lista todos los eventos disponibles.
 */
async function listarEventos() {

    const archivos = await github.listarEventos();

    const eventos = [];

    let id = 1;

    for (const archivo of archivos) {

        try {

            // Descargar Excel
            const ruta = await github.descargarArchivo(archivo.nombre);

            if (!ruta) {
                continue;
            }

            // Leer cabecera
            const datos = cabecera.leerCabecera(ruta);

            eventos.push({

                id: id++,

                nombre: datos.nombreEvento,

                areaSolicitante: datos.areaSolicitante,

                nombreSolicitante: datos.nombreSolicitante,

                tipoEvento: datos.tipoEvento,

                detallePromocion: datos.detallePromocion,

                fechaInicio: datos.fechaInicio,

                fechaFin: datos.fechaFin,

                archivo: archivo.nombre

            });

        } catch (error) {

            console.warn(`Se omite ${archivo.nombre}: ${error.message}`);

        }

    }

    eventos.sort((a, b) => {

        return new Date(a.fechaInicio) - new Date(b.fechaInicio);

    });

    return {

        total: eventos.length,

        eventos

    };

}

/**
 * Busca un evento por su ID.
 */
async function buscarEventoPorId(id) {

    const catalogo = await listarEventos();

    return catalogo.eventos.find(evento => evento.id === id);

}

module.exports = {

    listarEventos,

    buscarEventoPorId

};