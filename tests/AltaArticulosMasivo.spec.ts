import { test } from '@playwright/test';

import {
  visibleHome,
  inicioSesion,
  agregarProductosMasivo
} from './data/helpers';

test(
  'Carga masiva de promociones',
  async ({ page }) => {

    test.setTimeout(300000);

    await visibleHome(page);

    await inicioSesion(page);

    await agregarProductosMasivo(page);

    //falta verificacion que termine el caso de uso, aca termina cuando carga, no reviso errores

  }
);