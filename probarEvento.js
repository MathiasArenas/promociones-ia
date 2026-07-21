const { obtenerEvento } = require("./mcp/services/evento");

(async () => {

    try {

        const evento = await obtenerEvento(1);

        console.log(JSON.stringify(evento, null, 4));

    } catch (error) {

        console.error(error.message);

    }

})();