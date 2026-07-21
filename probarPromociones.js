const { leerPromociones } = require("./mcp/excel/promociones");

const promociones = leerPromociones(
    "./mcp/temp/Mailing Dia del Padre.xlsx"
);

console.log(promociones.slice(0, 10));