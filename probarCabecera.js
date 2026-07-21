const github = require("./mcp/github");
const cabecera = require("./mcp/excel/cabecera");

async function main() {

    const eventos = await github.listarEventos();

    if (eventos.length === 0) {
        console.log("No hay eventos.");
        return;
    }

    const ruta = await github.descargarArchivo(eventos[0].nombre);

    console.log("Excel descargado:");
    console.log(ruta);

    console.log("");

    const datos = cabecera.leerCabecera(ruta);

    console.log("Cabecera encontrada:");

    console.log(datos);

}

main();