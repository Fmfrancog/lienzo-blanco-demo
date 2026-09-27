import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium as pw } from 'playwright';
import chromium from '@sparticuz/chromium';

const base = process.env.BASE_URL || 'http://127.0.0.1:3011';
const output = process.env.EVIDENCE_DIR || '/opt/data/plur-search/local';
fs.mkdirSync(output, { recursive: true });
const browser = await pw.launch({ args: chromium.args, executablePath: await chromium.executablePath() });
const results = [];
try {
  const page = await browser.newPage();
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(base, { waitUntil: 'networkidle' });
    const search = page.getByRole('searchbox', { name: 'Buscar diseños' });
    assert(await search.isVisible(), `search visible initially at ${width}`);
    assert.equal(await search.getAttribute('placeholder'), 'Buscar productos');
    const bounds = await search.boundingBox();
    assert(bounds.y < 220 && bounds.width > width * .55, `prominent search at ${width}`);
    await page.screenshot({ path: `${output}/header-${width}.png` });
    const cards = page.getByTestId('product-card');
    assert.equal(await cards.count(), 197);
    const layout = await page.locator('.product-grid').evaluate(el => ({ columns: getComputedStyle(el).gridTemplateColumns.split(' ').length, overflow: document.documentElement.scrollWidth > innerWidth }));
    assert.equal(layout.columns, width < 800 ? 2 : 4);
    assert.equal(layout.overflow, false);
    // A previous collection must not prevent a whole-catalog search.
    await page.locator('.filters button').last().click();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await search.click();
    const before = await page.evaluate(() => scrollY);
    await search.pressSequentially('GATO COSMICO', { delay: 45 });
    await page.waitForTimeout(400);
    assert.equal(await search.evaluate(el => el === document.activeElement), true);
    assert(Math.abs(await page.evaluate(() => scrollY) - before) < 5, 'typing must not scroll');
    assert.equal(await page.locator('[data-action="filter-todos"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await cards.count(), 2); // Legacy Gato Cósmico and the distinct imported design.
    assert.match(await cards.first().textContent(), /Gato Cósmico/);
    await search.press('Enter');
    await page.waitForFunction(() => { const r = document.querySelector('#catalogo').getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight / 2; });
    await cards.first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => { const img = document.querySelector('.product-card img'); return img?.complete && img.naturalWidth > 0; });
    await page.screenshot({ path: `${output}/results-${width}.png` });
    await cards.first().getByRole('button', { name: /Ver diseño/ }).click();
    await page.getByRole('dialog', { name: /Gato Cósmico/ }).waitFor();
    assert.match(await page.getByTestId('gallery-main-image').getAttribute('src'), /05\.webp/);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Limpiar búsqueda', exact: true }).click();
    assert.equal(await search.inputValue(), '');
    assert.equal(await cards.count(), 197);
    await search.fill('zzzxsinresultados');
    await page.getByRole('button', { name: 'Buscar productos', exact: true }).click();
    await page.locator('.empty-state').waitFor();
    assert.equal(await cards.count(), 0);
    assert.match(await page.locator('#search-status').textContent(), /Sin resultados/);
    await page.locator('[data-action="clear-search"]').click();
    assert.equal(await cards.count(), 197);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    results.push({ width, products: 197, ...layout, errors, search: 'pass', clear: 'pass', submit: 'Enter and button', product: 'opened, cover 05' });
    page.removeAllListeners('pageerror');
    page.removeAllListeners('console');
  }
  fs.writeFileSync(`${output}/results.json`, JSON.stringify({ base, results }, null, 2));
  console.log(JSON.stringify({ base, results }, null, 2));
} finally { await browser.close(); }
