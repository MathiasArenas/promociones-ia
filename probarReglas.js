const { aplicar } = require("./mcp/reglas");

const promociones = [
    {
        codigo: 466557,
        formatoPromocion: "Precio Fijo",
        moneda: "$",
        accionCaja: "249,00"
    },
    {
        codigo: 123456,
        formatoPromocion: "DescuentoPorcentajeAProducto",
        moneda: "%",
        accionCaja: "20"
    }
];

promociones.forEach((promocion) => {
    console.log(aplicar(promocion));
});