const { obtenerEvento } = require("./evento");

async function generarCasos(idEvento) {

    const evento = await obtenerEvento(idEvento);

    const casos = [];

    let idCaso = 1;

    for (const promocion of evento.promociones) {

        casos.push({

            id: idCaso++,

            idEvento,

            codigoPromocion: promocion.codigo,

            formatoPromocion: promocion.formatoPromocion,

            moneda: promocion.moneda,

            accionCaja: promocion.accionCaja,

            descripcion:
                `Validar promoción ${promocion.codigo}`,

            productos: [],

            resultadoEsperado:
                "La promoción debe aplicarse correctamente."

        });

    }

    return {

        evento: evento.cabecera.nombreEvento,

        cantidadCasos: casos.length,

        casos

    };

}

module.exports = {

    generarCasos

};