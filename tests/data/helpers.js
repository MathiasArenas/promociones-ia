// Librerías utilizadas:
// fs   -> lectura/escritura de archivos
// path -> manejo de rutas de archivos
// expect -> validaciones de Playwright

const fs = require('fs');
const path = require('path');
const { expect } = require('@playwright/test');


// =====================================
// CONFIGURACIÓN DE LOGS
// =====================================

// Archivo donde se guardará el resultado de la ejecución
// =====================================
// CONFIGURACIÓN DE EJECUCIÓN
// =====================================

// Carpeta creada por el MCP.
// Si Playwright se ejecuta manualmente,
// utiliza la carpeta tests/data.

const carpetaEjecucion =
  process.env.CARPETA_EJECUCION ||
  __dirname;

const currentDir = carpetaEjecucion;

// Archivo de log de la ejecución.

const logFile = path.join(
  carpetaEjecucion,
  "resultado_pruebas.txt"
);

/**
 * Escribe un mensaje en:
 * - consola
 * - archivo resultado_pruebas.txt
 */
function escribirLog(texto) {

  const fecha = new Date().toLocaleString();

  fs.appendFileSync(
    logFile,
    `[${fecha}] ${texto}\n`
  );

  console.error(texto);
}


// =====================================
// NAVEGACIÓN INICIAL
// =====================================

/**
 * Abre la pantalla principal del simulador
 */
async function visibleHome(page) {

  escribirLog('Ingresando al sitio');

  await page.goto(
    'http://10.0.210.10/sign-in?redirectURL=%2Fpromotion-home'
  );
}


/**
 * Realiza login
 */
async function inicioSesion(page) {

  escribirLog('Iniciando sesión');

  await page
    .getByRole('textbox', { name: 'Usuario' })
    .fill('Mathias Arenas');

  await page
    .getByRole('textbox', { name: 'Contraseña' })
    .fill('marenas2026');

  await page
    .getByRole('button', { name: 'Iniciar sesión' })
    .click();
}


/**
 * Navega hasta el módulo Productos
 */
async function abrirProductos(page) {

  escribirLog('Abriendo simulador');

  await page
    .getByRole('link', {
      name: 'Simulador',
      exact: true
    })
    .click();

  await page
    .getByText('PRODUCTOS', {
      exact: true
    })
    .click();
}


// =====================================
// BÚSQUEDA DE SKU
// =====================================

/**
 * Busca un SKU dentro del simulador.
 *
 * Retorna:
 * true  -> SKU encontrado
 * false -> SKU no encontrado
 */
async function buscarSku(page, sku) {

  escribirLog(`Buscando SKU ${sku}`);

  // Localiza el buscador principal
  const search = page
    .getByRole('combobox', {
      name: /Buscar articulo por SKU o/
    })
    .first();

  // Verifica que exista
  const visible = await search
    .isVisible()
    .catch(() => false);

  if (!visible) {

    escribirLog(`ERROR: Combobox no visible para SKU ${sku}`);

    // Captura pantalla para diagnóstico
    await page.screenshot({
      path: path.join(carpetaEjecucion, `error_combobox_${sku}.png`),
      fullPage: true
    });

    return false;
  }

  // Espera que sea visible
  await expect(search).toBeVisible({
    timeout: 10000
  });

  // Limpia el campo
  await search.click();

  await page.waitForTimeout(500);

  await search.fill('');

  await page.waitForTimeout(200);

  // Escribe SKU
  await search.fill(sku);

  await page.waitForTimeout(1000);

  // Ejecuta búsqueda
  await search.press('Enter');

  // Busca resultado dentro de la lista
  const optionLocator = page
    .locator('[role="listbox"] [role="option"]')
    .filter({ hasText: sku })
    .filter({
      hasNotText: 'Buscando articulos'
    });

  // Espera resultado visible
  const foundOption = await optionLocator
    .first()
    .waitFor({
      state: 'visible',
      timeout: 10000
    })
    .then(() => true)
    .catch(() => false);

  // Si no encuentra resultado
  if (!foundOption) {

    escribirLog(
      `ERROR: SKU ${sku} no encontrado`
    );

    await page.screenshot({
      path: path.join(carpetaEjecucion, `error_combobox_${sku}.png`),
      fullPage: true
    });

    return false;
  }

  // Selecciona SKU encontrado
  await optionLocator.first().click();

  escribirLog(
    `SKU ${sku} encontrado correctamente`
  );

  return true;
}


// =====================================
// AJUSTAR CANTIDAD
// =====================================

/**
 * Modifica la cantidad del producto.
 *
 * Si la cantidad es 1 no realiza cambios.
 */
async function ajustarCantidad(
  page,
  cantidad
) {

  if (
    cantidad === undefined ||
    Number(cantidad) === 1
  ) {
    return;
  }

  const qtyInput = page
    .getByRole('spinbutton', {
      name: 'Cantidad'
    })
    .first();

  try {

    await qtyInput.waitFor({
      state: 'visible',
      timeout: 5000
    });

    await qtyInput.fill(
      String(cantidad)
    );

    escribirLog(
      `Cantidad ajustada a ${cantidad}`
    );

  } catch (e) {

    escribirLog(
      `No se encontró campo Cantidad`
    );

  }
}


// =====================================
// AGREGAR PRODUCTO
// =====================================

/**
 * Presiona el botón Agregar Producto
 */
async function seleccionarProducto(
  page
) {

  const productoButton = page
    .getByLabel('PRODUCTOS', {
      exact: true
    })
    .getByRole('button')
    .filter({
      hasText: /^$/
    })
    .first();

  const visible = await productoButton
    .isVisible()
    .catch(() => false);

  if (!visible) {

    escribirLog(
      'Botón agregar producto no visible'
    );

    return;
  }

  await productoButton.click();

  escribirLog(
    'Producto agregado'
  );
}


// =====================================
// PROCESO PRINCIPAL
// =====================================

/**
 * Lee el archivo JSON de promociones
 * y procesa cada SKU.
 */
async function agregarProductos(
  page
) {

  await abrirProductos(page);

  const inicioGeneral =
  Date.now();

  // Limpia log anterior
  fs.writeFileSync(
    logFile,
    '===== INICIO EJECUCION =====\n\n'
  );

  // =====================================
// DETERMINAR QUÉ ARCHIVO UTILIZAR
// =====================================

// Si existe input.json generado por el MCP,
// se utiliza ese archivo.
// En caso contrario, se utiliza el archivo
// tradicional casosPromos.json.

const inputPath =
  process.env.INPUT_JSON ||
  path.join(
    currentDir,
    "casosPromos.json"
  );

const filePath = inputPath;

escribirLog(
  `Archivo utilizado: ${filePath}`
);

const json =
  fs.readFileSync(
    filePath,
    "utf8"
  );

const casos =
  JSON.parse(json);

  escribirLog(
    `Total de promociones: ${casos.length}`
  );

  let procesados = 0;

  // Recorre todos los casos
  for (const item of casos) {

    const inicio = Date.now();

    const codigo = String(
      item['Código'] ||
      item['Codigo'] ||
      item['codigo']
    );

    const cantidad = Number(
      item['cantidad de unidades'] ??
      item['cantidad'] ??
      1
    );

    const esperado =
      item['resultado esperado'];

    escribirLog(
      '------------------------------------------------'
    );

    escribirLog(
      `INICIO SKU=${codigo}`
    );

    escribirLog(
      `Cantidad=${cantidad}`
    );

    escribirLog(
      `Resultado esperado=${esperado}`
    );

    try {

      // Busca producto
      const skuFound =
        await buscarSku(
          page,
          codigo
        );

      if (!skuFound) {
        continue;
      }

      // Ajusta cantidad
      await ajustarCantidad(
        page,
        cantidad
      );

      // Agrega producto
      await seleccionarProducto(
        page
      );

      procesados++;

      // Tiempo consumido
      const tiempo =
        (
          (Date.now() - inicio) /
          1000
        ).toFixed(2);

      escribirLog(
        `SKU=${codigo} OK`
      );

      escribirLog(
        `Tiempo=${tiempo} segundos`
      );

    } catch (error) {

      escribirLog(`ERROR SKU=${codigo}`);

      escribirLog(error.message);

      // Screenshot ante excepción
      await page.screenshot({
        path: path.join(carpetaEjecucion, `error_${codigo}.png`),
        fullPage: true
      });

      // continuar con el siguiente caso
      continue;
    }
  } // fin for

  escribirLog('================================================');

  escribirLog(`Promociones procesadas: ${procesados}`);

  const tiempoTotal = ((Date.now() - inicioGeneral) / 1000).toFixed(2);

  escribirLog(`Tiempo total: ${tiempoTotal} segundos`);
  escribirLog('FIN DE EJECUCION');

} // fin agregar productos

 // =====================================
// PROCESO MASIVO
// =====================================

/**
 * Carga un archivo JSON al Simulador Múltiple
 * y ejecuta la evaluación.
 */
async function agregarProductosMasivo(page) {

  escribirLog(
    'Ingresando a Simulador Múltiple'
  );

  await page
    .getByRole('link', {
      name: 'Simulador Múltiple'
    })
    .click();

  escribirLog(
    'Abriendo Importar Ventas'
  );

  await page
    .getByRole('button', {
      name: 'Importar ventas'
    })
    .click();

  const nombreArchivo =
  process.env.ARCHIVO ||
  'casosPromoMasivo.json';

  const filePath = path.join(
    currentDir,
    nombreArchivo
  );

  escribirLog(
    `Importando archivo: ${filePath}`
  );

  await page
    .locator('input[type="file"]')
    .setInputFiles(filePath);

  escribirLog(
    'Archivo cargado correctamente'
  );

  await page.waitForTimeout(2000);

  await page
    .getByRole('button', {
      name: 'Confirmar y evaluar'
    })
    .click();

  escribirLog(
    'Evaluación iniciada'
  );

  await page.waitForTimeout(5000);

  // Evidencia visual
  await page.screenshot({
    path: 'resultado_masivo.png',
    fullPage: true
  });

  escribirLog(
    'Screenshot resultado_masivo.png generado'
  );

}

module.exports = {
  visibleHome,
  inicioSesion,
  abrirProductos,
  buscarSku,
  ajustarCantidad,
  seleccionarProducto,
  agregarProductos,
  agregarProductosMasivo
};