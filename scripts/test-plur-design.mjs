import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium as pw } from 'playwright';
import chromium from '@sparticuz/chromium';
const base = process.env.BASE_URL || 'http://127.0.0.1:3011';
const output = process.env.EVIDENCE_DIR || '/opt/data/plur-design/local';
const captureOnly = process.env.CAPTURE_ONLY === '1';
fs.mkdirSync(output, { recursive: true });
const browser = await pw.launch({ args: chromium.args, executablePath: await chromium.executablePath() });
const results = [];
try {
  const page = await browser.newPage();
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${output}/home-${width}.png` });
    if (!captureOnly) {
      assert.match(await page.title(), /^PLUR/);
      assert.equal(await page.getByRole('button', { name: 'PLUR, ir al inicio' }).isVisible(), true);
      assert.doesNotMatch(await page.locator('body').innerText(), /Lienzo Blanco|marca ficticia|Gratis desde|3 a 5 días/);
      const hero = await page.locator('.hero').boundingBox();
      assert(hero.height < (width < 800 ? 660 : 500), 'compact photographic hero');
      const photos = page.locator('.hero img');
      assert.equal(await photos.count(), 2);
      for (const photo of await photos.all()) {
        assert.match(await photo.getAttribute('src'), /\/catalogo\/.*(?:05|04)\.webp$/);
        assert(await photo.evaluate(el => el.complete && el.naturalWidth > 0));
        assert(await photo.evaluate(el => el.getBoundingClientRect().height <= el.parentElement.getBoundingClientRect().height + 1), 'hero photo must fit without clipping');
      }
      assert.equal(await page.locator('[data-testid="product-card"]').count(), 197);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    const first = page.getByTestId('product-card').first();
    await first.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.product-card img')].slice(0, 4).every(img => img.complete && img.naturalWidth > 0));
    await page.screenshot({ path: `${output}/catalog-${width}.png` });
    const longest = await page.locator('.product-card h3').evaluateAll(els => els.reduce((a, e) => e.textContent.length > a.length ? e.textContent : a, ''));
    await page.getByRole('searchbox').fill(longest);
    await page.getByRole('searchbox').press('Enter');
    await page.waitForTimeout(600);
    await page.getByTestId('product-card').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${output}/long-name-${width}.png` });
    await page.getByTestId('product-card').first().getByRole('button', { name: /Ver diseño/ }).click();
    await page.getByTestId('gallery-main-image').evaluate(img => img.decode());
    if (!captureOnly) {
      assert.equal(await page.getByRole('dialog').evaluate(el => el.scrollWidth > el.clientWidth), false);
      assert.match(await page.getByRole('dialog').innerText(), /sin cobro/);
      if (width === 1440) {
        const thumb = await page.getByTestId('gallery-thumbnail').last().boundingBox();
        const modal = await page.getByRole('dialog').boundingBox();
        assert(thumb.y + thumb.height <= modal.y + modal.height, 'desktop thumbnails visible without scrolling');
      }
      for (const button of await page.getByTestId('product-size').all()) assert((await button.boundingBox()).height >= 44);
    }
    await page.screenshot({ path: `${output}/modal-${width}.png` });
    await page.keyboard.press('Escape');
    results.push({ width, longest, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), status: captureOnly ? 'baseline captured' : 'passed' });
  }
  fs.writeFileSync(`${output}/results.json`, JSON.stringify({ base, results }, null, 2));
  console.log(JSON.stringify({ base, results }, null, 2));
} finally { await browser.close(); }
