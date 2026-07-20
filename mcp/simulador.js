const { execSync } =
  require("child_process");

const fs =
  require("fs");

const path =
  require("path");

// ======================================
// CREA UNA CARPETA PARA LA EJECUCIÓN
// ======================================

function crearCarpetaEjecucion() {

  const fecha =
    new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\..+/, "");

  const carpeta =
    path.join(
      __dirname,
      "../ejecuciones",
      fecha
    );

  fs.mkdirSync(
    carpeta,
    {
      recursive: true
    }
  );

  return carpeta;

}

// ======================================
// ALTA ARTICULOS INDIVIDUAL
// ======================================

async function ejecutarAltaArticulos(
  datos
) {

  try {

    console.error(
      "======================================"
    );

    console.error(
      "INICIO ALTA ARTICULOS"
    );

    console.error(
      "======================================"
    );

    const {
      productos,
      modo,
      cantidadCasos
    } = datos;

    if (
      !productos ||
      !Array.isArray(productos)
    ) {

      throw new Error(
        "La lista de productos no es válida."
      );

    }

    // ======================================
    // DEFINIR CANTIDAD A EJECUTAR
    // ======================================

    let productosEjecutar =
      productos;

    if (
      modo === "uno"
    ) {

      productosEjecutar =
        productos.slice(
          0,
          1
        );

    }

    if (
      cantidadCasos &&
      cantidadCasos < productosEjecutar.length
    ) {

      productosEjecutar =
        productosEjecutar.slice(
          0,
          cantidadCasos
        );

    }

    console.error(
      `Productos a ejecutar: ${productosEjecutar.length}`
    );

    // ======================================
    // CREAR CARPETA DE EJECUCIÓN
    // ======================================

    const carpetaEjecucion =
      crearCarpetaEjecucion();

    console.error(
      `Carpeta: ${carpetaEjecucion}`
    );

    // ======================================
    // GENERAR INPUT.JSON
    // ======================================

    const archivoInput =
      path.join(
        carpetaEjecucion,
        "input.json"
      );

    fs.writeFileSync(
      archivoInput,
      JSON.stringify(
        productosEjecutar,
        null,
        2
      )
    );

    console.error(
      `Input generado`
    );

    // ======================================
    // EJECUTAR PLAYWRIGHT
    // ======================================

    const comando =
      process.env.HEADLESS === "true"
        ? "npx playwright test tests/AltaArticulos.spec.ts --project=chromium"
        : "npx playwright test tests/AltaArticulos.spec.ts --project=chromium --headed";

    const salida =
      execSync(
        comando,
        {

          encoding: "utf8",

          stdio: "pipe",

          env: {

            ...process.env,

            INPUT_JSON:
              archivoInput,

            CARPETA_EJECUCION:
              carpetaEjecucion

          }

        }
      );

    // ======================================
    // GUARDAR SALIDA
    // ======================================

    fs.writeFileSync(

      path.join(

        carpetaEjecucion,

        "salida_playwright.txt"

      ),

      salida

    );

    console.error(
      "Playwright finalizado."
    );

    return {

      estado: "OK",

      proceso:
        "alta_articulos",

      productosProcesados:
        productosEjecutar.length,

      carpeta:
        carpetaEjecucion,

      mensaje:
        "Prueba ejecutada correctamente."

    };

  }

  catch (error) {

    console.error(
      error.message
    );

    if (
      error.stdout
    ) {

      console.error(
        error.stdout.toString()
      );

    }

    if (
      error.stderr
    ) {

      console.error(
        error.stderr.toString()
      );

    }

    return {

      estado: "ERROR",

      proceso:
        "alta_articulos",

      mensaje:
        error.message

    };

  }

}

// ======================================
// ALTA MASIVA
// ======================================

async function ejecutarAltaArticulosMasivo(
  archivo
) {

  try {

    console.error(
      "Ejecutando AltaArticulosMasivo.spec.ts"
    );

    execSync(

      `set ARCHIVO=${archivo} && npx playwright test tests/AltaArticulosMasivo.spec.ts`,

      {

        encoding:
          "utf8",

        stdio:
          "pipe"

      }

    );

    return {

      estado:
        "OK",

      proceso:
        "alta_articulos_masivo",

      archivo,

      mensaje:
        "Carga masiva ejecutada correctamente."

    };

  }

  catch (error) {

    return {

      estado:
        "ERROR",

      proceso:
        "alta_articulos_masivo",

      archivo,

      mensaje:
        error.message

    };

  }

}

module.exports = {

  ejecutarAltaArticulos,

  ejecutarAltaArticulosMasivo

};