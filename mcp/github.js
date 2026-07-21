require("dotenv").config();

const fs = require("fs");
const path = require("path");

const OWNER = "MathiasArenas";
const REPO = "promociones-ia";

const TEMP_DIR = path.join(__dirname, "temp");

async function listarEventos() {

    try {

        const response = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/solicitudes`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub respondió ${response.status}`);
        }

        const data = await response.json();

        return data
            .filter(item => item.type === "file")
            .filter(item => item.name.endsWith(".xlsx"))
            .map(item => ({
                nombre: item.name,
                ruta: item.path
            }));

    } catch (error) {

        console.error("Error al listar eventos:", error.message);
        return [];

    }

}

async function descargarArchivo(nombreArchivo) {

    try {

        const response = await fetch(
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/solicitudes/${encodeURIComponent(nombreArchivo)}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`GitHub respondió ${response.status}`);
        }

        const archivo = await response.json();

        // Crear carpeta temporal si no existe
        if (!fs.existsSync(TEMP_DIR)) {
            fs.mkdirSync(TEMP_DIR, { recursive: true });
        }

        // Ruta donde se guardará el Excel
        const rutaArchivo = path.join(TEMP_DIR, nombreArchivo);

        // Guardar archivo
        fs.writeFileSync(
            rutaArchivo,
            Buffer.from(archivo.content, "base64")
        );

        return rutaArchivo;

    } catch (error) {

        console.error("Error al descargar archivo:", error.message);
        return null;

    }

}

module.exports = {
    listarEventos,
    descargarArchivo
};