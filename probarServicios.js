const { obtenerPromociones } = require("./mcp/services/promociones");

const promociones = obtenerPromociones(
    "./mcp/temp/Mailing Dia del Padre.xlsx"
);

console.log("Cantidad:", promociones.length);

console.log(
    JSON.stringify(
        promociones.slice(0, 10),
        null,
        4
    )
);