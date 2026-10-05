import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium as pw } from 'playwright';
import chromium from '@sparticuz/chromium';
const base = process.env.BASE_URL || 'http://127.0.0.1:3011';
const out = process.env.EVIDENCE_DIR || '/opt/data/plur-taxonomy/local';
fs.mkdirSync(out, { recursive: true });
const rows = JSON.parse(fs.readFileSync(new URL('../src/data/product-taxonomy.json', import.meta.url)));
const copy = JSON.parse(fs.readFileSync(new URL('../src/data/product-copy.json', import.meta.url)));
const source = JSON.parse(fs.readFileSync(new URL('../src/data/drive-products.json', import.meta.url)));
const { legacy } = JSON.parse(fs.readFileSync(new URL('./fixtures/catalog-integrity.json', import.meta.url)));
const products = [legacy, ...source];
const counts = Object.fromEntries([...new Set(rows.map(r => r.category))].map(c => [c, rows.filter(r => r.category === c).length]));
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const browser = await pw.launch({ args: chromium.args, executablePath: await chromium.executablePath() });
const report = { base, categories: counts, products: [], tagsSearched: [], screenshots: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(base, { waitUntil: 'networkidle', timeout: 120000 });
  const cards = page.getByTestId('product-card');
  const ids = () => cards.evaluateAll(els => els.map(el => el.getAttribute('data-product-id')));
  assert.equal(await page.locator('.filters button').count(), Object.keys(counts).length + 1, 'all thematic filters and Todos');
  assert.deepEqual(await ids(), rows.map(r => r.id), 'exact 197 IDs, original order and no demos');
  for (const [category, count] of Object.entries(counts)) {
    const button = page.locator('.filters button').filter({ hasText: category });
    assert.match(await button.textContent(), new RegExp(`${count}$`));
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
    assert.deepEqual(await ids(), rows.filter(r => r.category === category).map(r => r.id), category);
  }
  await page.locator('[data-action="filter-todos"]').click();
  const snapshot = await cards.evaluateAll(els => els.map(el => ({
    id: el.dataset.productId, name: el.querySelector('h3').textContent,
    category: el.querySelector('.product-info span').textContent,
    tags: [...el.querySelectorAll('.product-tags li')].map(x => x.textContent),
    cover: el.querySelector('img').getAttribute('src'),
    price: el.querySelector('.product-pricing strong').textContent,
    compare: el.querySelector('.product-pricing del').textContent,
    description: el.querySelector(':scope > p').textContent,
  })));
  for (const [i, row] of rows.entries()) {
    const card = snapshot[i], product = products[i];
    assert.equal(card.name, product.name);
    assert.equal(card.description, copy[row.id], `${row.id} exact card copy`);
    assert.equal(card.category, row.category);
    assert.deepEqual(card.tags, row.tags.slice(0, 2));
    assert.equal(card.cover, row.evidence.photo);
    assert.equal(card.price, `$${product.price}`);
    assert.equal(card.compare, `$${product.compareAtPrice}`);
    await page.locator(`[data-action="open-product-${row.id}"]`).click();
    const modal = page.getByRole('dialog');
    assert.equal(await modal.locator('.detail-copy > p').textContent(), copy[row.id], `${row.id} exact modal copy`);
    assert.equal(await modal.locator('blockquote').count(), 0, 'No empty or unsupported story');
    assert.deepEqual(await modal.locator('.product-tags li').allTextContents(), row.tags);
    assert.equal(await page.getByTestId('gallery-main-image').getAttribute('src'), row.evidence.photo);
    assert.equal(await page.getByTestId('gallery-thumbnail').count(), product.images.length);
    assert.deepEqual(await page.getByTestId('product-size').allTextContents(), product.sizes);
    assert.equal(await modal.locator('.product-pricing strong').textContent(), `$${product.price}`);
    await page.getByTestId('gallery-thumbnail').last().click();
    assert.equal(await page.getByTestId('gallery-main-image').getAttribute('src'), product.images.at(-1));
    await page.keyboard.press('Escape');
    report.products.push({ id: row.id, category: row.category, cardTags: card.tags, modalTags: row.tags, cover: card.cover, price: product.price, gallery: product.images.length, description: copy[row.id], cardCopyExact: true, modalCopyExact: true, status: 'pass' });
  }
  fs.writeFileSync(`${out}/progress.json`, JSON.stringify(report, null, 2));
  const search = page.getByRole('searchbox', { name: 'Buscar diseños' });
  for (const tag of new Set(rows.flatMap(r => r.tags))) {
    const query = normalize(tag);
    await search.fill(query);
    const expected = rows.filter((row, i) => normalize(`${row.name} ${row.category} ${snapshot[i].description}  ${row.tags.join(' ')}`).includes(query)).map(r => r.id);
    assert.deepEqual(await ids(), expected, `search ${tag} must match complete searchable fields`);
    assert.equal(await search.evaluate(el => el === document.activeElement), true);
    report.tagsSearched.push({ tag, results: expected.length });
  }
  await page.getByRole('button', { name: 'Limpiar búsqueda', exact: true }).click();
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `${out}/header-${width}.png` });
    await page.locator('.filters').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${out}/filters-${width}.png` });
    await cards.first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.product-card img')].filter(img => { const r = img.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }).every(img => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: `${out}/cards-${width}.png` });
    const cols = await page.locator('.product-grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(cols, width < 800 ? 2 : 4);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await cards.first().getByRole('button', { name: /Ver diseño/ }).click();
    await page.screenshot({ path: `${out}/modal-${width}.png` });
    await page.keyboard.press('Escape');
    report.screenshots.push({ width, columns: cols, overflow: false });
  }
  assert.deepEqual(errors, []);
  assert.equal(report.products.length, 197);
  fs.writeFileSync(`${out}/results.json`, JSON.stringify({ ...report, errors, status: 'PASS' }, null, 2));
  console.log(JSON.stringify({ base, status: 'PASS', products: report.products.length, categories: counts, uniqueTagsSearched: report.tagsSearched.length, screenshots: report.screenshots, errors }, null, 2));
} finally { await browser.close(); }
