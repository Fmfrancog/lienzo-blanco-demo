import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { chromium as pw } from 'playwright';
import chromium from '@sparticuz/chromium';
const base = process.env.BASE_URL || 'http://127.0.0.1:3011';
const out = process.env.EVIDENCE_DIR || '/opt/data/plur-audience/local';
fs.mkdirSync(out, { recursive: true });
const bytes = fs.readFileSync(new URL('../src/data/drive-products.json', import.meta.url));
const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures/catalog-integrity.json', import.meta.url)));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), fixture.driveSha256);
const products = [fixture.legacy, ...JSON.parse(bytes)];
const taxonomy = JSON.parse(fs.readFileSync(new URL('../src/data/product-taxonomy.json', import.meta.url)));
assert.equal(products.length, 197);
const expected = (audience, theme = 'Todos') => products.filter(p => (audience === 'Todos' || new RegExp(`\\b${audience}\\b`, 'i').test(p.name)) && (theme === 'Todos' || taxonomy.find(t => t.id === p.id).category === theme)).map(p => p.id);
const counts = { Todos: products.length, Hombre: expected('Hombre').length, Mujer: expected('Mujer').length };
const browser = await pw.launch({ args: chromium.args, executablePath: await chromium.executablePath() });
const report = { base, counts, intersections: [], screenshots: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  const cards = page.getByTestId('product-card');
  const ids = () => cards.evaluateAll(els => els.map(el => el.dataset.productId));
  const button = audience => page.locator(`[data-action="audience-${audience.toLowerCase()}"]`);
  assert.equal(await button('Hombre').count(), 1, 'Hombre filter must exist');
  assert.equal(await button('Mujer').count(), 1, 'Mujer filter must exist');
  assert.deepEqual(await ids(), expected('Todos'));
  for (const audience of ['Hombre', 'Mujer']) {
    assert.match(await button(audience).textContent(), new RegExp(`${counts[audience]}$`));
    await button(audience).click();
    assert.equal(await button(audience).getAttribute('aria-pressed'), 'true');
    assert.deepEqual(await ids(), expected(audience));
    for (const theme of [...new Set(taxonomy.map(t => t.category))]) {
      await page.locator('.filters button').filter({ hasText: theme }).click();
      assert.deepEqual(await ids(), expected(audience, theme));
      report.intersections.push({ audience, theme, count: expected(audience, theme).length });
      if (!expected(audience, theme).length) {
        await page.locator('.empty-state').waitFor();
        await page.locator('[data-action="clear-search"]').click();
        assert.deepEqual(await ids(), expected('Todos'));
        assert.equal(await button('Todos').getAttribute('aria-pressed'), 'true');
        await button(audience).click();
      }
    }
    await page.locator('[data-action="filter-todos"]').click();
    assert.deepEqual(await ids(), expected(audience), 'theme reset preserves audience');
    await button('Todos').click();
    assert.deepEqual(await ids(), expected('Todos'));
  }
  const search = page.getByRole('searchbox', { name: 'Buscar diseños' });
  await button('Mujer').click();
  await search.fill('GATO COSMICO');
  assert.equal(await button('Todos').getAttribute('aria-pressed'), 'true');
  assert.equal(await search.evaluate(el => el === document.activeElement), true);
  assert.equal(await cards.count(), 2);
  await search.press('Enter');
  await page.getByRole('button', { name: 'Limpiar búsqueda', exact: true }).click();
  assert.deepEqual(await ids(), expected('Todos'));
  await button('Hombre').click();
  await search.fill('zzzxsinresultados');
  assert.equal(await cards.count(), 0);
  await page.locator('[data-action="clear-search"]').click();
  assert.deepEqual(await ids(), expected('Todos'));
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.locator('.audience-filters').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${out}/filters-${width}.png` });
    const columns = await page.locator('.product-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(columns, width < 800 ? 2 : 4);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    report.screenshots.push({ width, columns, overflow: false });
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(`${out}/results.json`, JSON.stringify({ ...report, errors, status: 'PASS' }, null, 2));
  console.log(JSON.stringify({ ...report, status: 'PASS' }, null, 2));
} finally { await browser.close(); }
