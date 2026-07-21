function transformar(promocion) {

    return {
        tipo: "PrecioFijo",
        codigo: promocion.codigo,
        cantidad: 1,
        precio: Number(
            String(promocion.accionCaja)
                .replace(".", "")
                .replace(",", ".")
        ),
        moneda: promocion.moneda
    };

}

module.exports = transformar;