import { chromium as playwright } from 'playwright';
import chromium from '@sparticuz/chromium';

const browser = await playwright.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.goto('http://127.0.0.1:3010', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.getByRole('searchbox', { name: /buscar diseños/i }).fill('gato cósmico');

  const product = page.locator('[data-testid="product-card"]').filter({ hasText: 'Gato Cósmico' });
  if (await product.count() !== 1) throw new Error('Expected one real product named Gato Cósmico');

  const cardImage = product.locator('img');
  if (!((await cardImage.getAttribute('src')) || '').includes('/catalogo/gato-cosmico/01.webp')) {
    throw new Error('Expected the first numbered product image in the catalog card');
  }

  await page.locator('[data-action="open-product-gato-cosmico"]').click();
  const dialog = page.getByRole('dialog', { name: /detalle de producto/i });
  await dialog.waitFor({ state: 'visible' });

  const thumbnails = dialog.locator('[data-testid="gallery-thumbnail"]');
  if (await thumbnails.count() !== 5) throw new Error('Expected five numbered images in the product gallery');

  await thumbnails.nth(4).click();
  const mainImage = dialog.locator('[data-testid="gallery-main-image"]');
  if (!((await mainImage.getAttribute('src')) || '').includes('/catalogo/gato-cosmico/05.webp')) {
    throw new Error('Expected gallery to display image 05 after selecting the fifth thumbnail');
  }

  console.log(JSON.stringify({ status: 'ok', product: 'Gato Cósmico', images: 5 }));
} finally {
  await browser.close();
}
