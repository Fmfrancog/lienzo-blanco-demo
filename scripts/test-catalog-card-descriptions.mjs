import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium as playwright } from 'playwright';
import chromium from '@sparticuz/chromium';

const descriptions = JSON.parse(fs.readFileSync(new URL('../src/data/product-copy.json', import.meta.url), 'utf8'));
const browser = await playwright.launch({ args: chromium.args, executablePath: await chromium.executablePath() });
try {
  const page = await browser.newPage();
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(process.env.BASE_URL || 'http://127.0.0.1:3011', { waitUntil: 'networkidle' });
    const cards = page.getByTestId('product-card');
    const contents = await cards.evaluateAll(elements => elements.map(element => ({
      id: element.dataset.productId,
      text: element.textContent,
      name: element.querySelector('h3')?.textContent,
      image: Boolean(element.querySelector('img')),
      controls: element.querySelectorAll('button').length,
    })));
    assert.equal(contents.length, Object.keys(descriptions).length);
    for (const card of contents) {
      assert(descriptions[card.id], `Known product ${card.id}`);
      assert(!card.text.includes(descriptions[card.id]), `${width}px: ${card.id} description must not appear on catalog card`);
      assert(card.name && card.image && card.controls >= 2, `${card.id}: retain name, image and controls`);
      assert.match(card.text, /199/, `${card.id}: retain price`);
    }
    const columns = await page.locator('.product-grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    assert.equal(columns, width === 390 ? 2 : 4);
    for (const index of [0, contents.length - 1]) {
      const card = contents[index];
      await cards.nth(index).locator(index === 0 ? '.product-art-button' : '.card-action').click();
      const detail = page.getByRole('dialog', { name: /^Detalle de producto:/ });
      await detail.waitFor({ state: 'visible' });
      assert.equal(await detail.locator('.detail-copy > p').textContent(), descriptions[card.id]);
      assert(await detail.getByTestId('product-size').count() > 0);
      assert(await detail.locator('[data-action="add-to-cart"]').isVisible());
      await page.keyboard.press('Escape');
      await detail.waitFor({ state: 'hidden' });
    }
    console.log(`PASS ${width}px: ${contents.length} cards without descriptions; names/images/prices/controls retained; ${columns} columns; image and Ver diseño clicks retain full detail descriptions`);
  }
} finally {
  await browser.close();
}
