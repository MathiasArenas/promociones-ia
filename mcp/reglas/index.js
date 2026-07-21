const precioFijo = require("./precioFijo");
const descuentoPorcentaje = require("./descuentoPorcentaje");

const reglas = {

    "Precio Fijo": precioFijo,

    "DescuentoPorcentajeAProducto": descuentoPorcentaje

};

function aplicar(promocion) {

    const regla = reglas[promocion.formatoPromocion];

    if (!regla) {

        throw new Error(
            `No existe una regla para el formato "${promocion.formatoPromocion}"`
        );

    }

    return regla(promocion);

}

module.exports = {
    aplicar
};