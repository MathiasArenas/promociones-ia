const transformar = require("./mcp/reglas/precioFijo");

const promocion = {
    codigo: 466557,
    formatoPromocion: "Precio Fijo",
    moneda: "$",
    accionCaja: "249,00"
};

const resultado = transformar(promocion);

console.log(resultado);