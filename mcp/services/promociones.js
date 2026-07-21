const { leerPromociones } = require("../excel/promociones");
const { aplicar } = require("../reglas");

function obtenerPromociones(rutaExcel) {

    const promociones = leerPromociones(rutaExcel);

    const resultado = [];

    for (const promocion of promociones) {

        const promocionProcesada = aplicar(promocion);

        if (promocionProcesada) {
            resultado.push(promocionProcesada);
        }

    }

    return resultado;

}

module.exports = {
    obtenerPromociones
};