import { chromium as playwright } from 'playwright';
import chromium from '@sparticuz/chromium';

const browser = await playwright.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  for (const [name, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:3010', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForTimeout(1500);
    await page.locator('[data-action="open-product-gato-cosmico"]').click();
    await page.getByRole('dialog', { name: /detalle de producto/i }).waitFor({ state: 'visible' });
    await page.screenshot({ path: `/opt/data/plur-gato-cosmico-${name}.png`, fullPage: false, timeout: 120000 });
  }
  console.log('captured desktop and mobile');
} finally {
  await browser.close();
}
