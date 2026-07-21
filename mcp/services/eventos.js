const github = require("../github");
const cabecera = require("../excel/cabecera");

/**
 * Lista todos los eventos disponibles.
 */
async function listarEventos() {

    const archivos = await github.listarEventos();

    console.log("Archivos encontrados:");
    console.table(archivos);

    const eventos = [];

    let id = 1;

    for (const archivo of archivos) {

        try {

            console.log("--------------------------------");
            console.log("Procesando:", archivo.nombre);

            // Descargar Excel
            const ruta = await github.descargarArchivo(archivo.nombre);

            if (!ruta) {
                console.log("No se pudo descargar.");
                continue;
            }

            console.log("Ruta:", ruta);

            // Leer cabecera
            const datos = cabecera.leerCabecera(ruta);

            console.log("Cabecera leída correctamente.");
            console.log(datos);

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

            console.log("Evento agregado.");

        } catch (error) {

            console.error("--------------------------------");
            console.error("Error procesando:", archivo.nombre);
            console.error(error);
            console.error("--------------------------------");

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

module.exports = {
    listarEventos
};