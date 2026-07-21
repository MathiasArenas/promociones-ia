const transformar = require("./mcp/reglas/descuentoPorcentaje");

const promocion = {
    codigo: 466557,
    formatoPromocion: "DescuentoPorcentajeAProducto",
    moneda: "%",
    accionCaja: "20"
};

console.log(transformar(promocion));