import { chromium as playwright } from 'playwright';
import chromium from '@sparticuz/chromium';

const browser = await playwright.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.goto('http://127.0.0.1:3010', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(1500);
  await page.locator('[data-action="open-product-gato-cosmico"]').click();
  const dialog = page.getByRole('dialog', { name: /detalle de producto/i });
  await dialog.waitFor({ state: 'visible' });

  const pricing = dialog.locator('[data-testid="product-pricing"]');
  if (!((await pricing.textContent()) || '').includes('$299')) throw new Error('Expected original price of $299');
  if (!((await pricing.textContent()) || '').includes('$199')) throw new Error('Expected sale price of $199');

  const availableSizes = await dialog.locator('[data-testid="product-size"]').allTextContents();
  const expectedSizes = ['CH', 'M', 'G', 'EG'];
  if (JSON.stringify(availableSizes) !== JSON.stringify(expectedSizes)) {
    throw new Error(`Expected sizes ${expectedSizes.join(', ')}, received ${availableSizes.join(', ')}`);
  }

  await dialog.getByRole('button', { name: 'EG', exact: true }).click();
  await dialog.getByRole('button', { name: /agregar a la bolsa.*199/i }).click();
  console.log(JSON.stringify({ status: 'ok', originalPrice: 299, salePrice: 199, sizes: availableSizes }));
} finally {
  await browser.close();
}
