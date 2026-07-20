import { test } from '@playwright/test';
import {
  visibleHome,
  inicioSesion,
  agregarProductos
} from './data/helpers';

test(
  'agregar productos desde JSON usando helpers',
  async ({ page }) => {

    test.setTimeout(300000);

    await visibleHome(page);

    await inicioSesion(page);

    await agregarProductos(page);

  }
);