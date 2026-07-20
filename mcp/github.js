require("dotenv").config();

const OWNER = "MathiasArenas";
const REPO = "promociones-ia";

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

        console.error(error);

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

        return Buffer.from(archivo.content, "base64");

    } catch (error) {

        console.error(error);

        return null;

    }

}

module.exports = {
    listarEventos,
    descargarArchivo
};