const { leerCabecera } = require("../excel/cabecera");
const { obtenerPromociones } = require("./promociones");

function obtenerEvento(rutaExcel) {

    const cabecera = leerCabecera(rutaExcel);

    const promociones = obtenerPromociones(rutaExcel);

    return {

        cabecera,

        promociones

    };

}

module.exports = {
    obtenerEvento
};