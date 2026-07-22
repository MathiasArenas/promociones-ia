function generarResumen(promociones) {

    const resumen = {

        cantidadPromociones: promociones.length,

        formatos: {},

        monedas: new Set(),

        accionesCaja: new Set()

    };

    promociones.forEach(promocion => {

        resumen.formatos[promocion.formatoPromocion] =
            (resumen.formatos[promocion.formatoPromocion] || 0) + 1;

        resumen.monedas.add(promocion.moneda);

        resumen.accionesCaja.add(promocion.accionCaja);

    });

    resumen.monedas = [...resumen.monedas];

    resumen.accionesCaja = [...resumen.accionesCaja];

    return resumen;

}

module.exports = {

    generarResumen

};