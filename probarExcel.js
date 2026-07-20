const fs = require("fs");

const {
    listarEventos,
    descargarArchivo
} = require("./mcp/github");

async function main() {

    const eventos = await listarEventos();

    console.log(eventos);

    if (eventos.length === 0) {

        console.log("No hay Excel.");

        return;

    }

    const buffer = await descargarArchivo(eventos[0].nombre);

    if (!buffer) {

        console.log("No se pudo descargar.");

        return;

    }

    fs.writeFileSync(
        "excel_descargado.xlsx",
        buffer
    );

    console.log("");
    console.log("Excel descargado correctamente.");

}

main();