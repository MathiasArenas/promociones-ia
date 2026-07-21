function normalizarNumero(valor) {

    return Number(
        String(valor)
            .replace("%", "")
            .replace(",", ".")
    );

}

function transformar(promocion) {

    let porcentaje = normalizarNumero(promocion.accionCaja);

    // Excel guarda 40% como 0.4
    if (porcentaje > 0 && porcentaje <= 1) {
        porcentaje *= 100;
    }

    // Elimina errores de precisión de JavaScript
    porcentaje = Number(porcentaje.toPrecision(12));

    return {

        tipo: "DescuentoPorcentaje",

        codigo: promocion.codigo,

        porcentaje: porcentaje

    };

}

module.exports = transformar;