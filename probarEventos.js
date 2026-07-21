const eventos = require("./mcp/services/eventos");

(async () => {

    const resultado = await eventos.listarEventos();

    console.log(JSON.stringify(resultado, null, 4));

})();