const { listarEventos } = require("./mcp/github");

async function main() {

    const eventos = await listarEventos();

    console.table(eventos);

}

main();