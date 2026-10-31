import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import c from '@sparticuz/chromium';

const base = process.env.BASE_URL || 'http://127.0.0.1:3044';
const dir = process.env.EVIDENCE_DIR || '/opt/data/plur-no-demo-evidence/local';
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ args: c.args.filter(a => !['--single-process', '--disable-web-security'].includes(a)), executablePath: await c.executablePath(), headless: true });
const results = [];
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    // Read-only production verification: never submit orders or start OAuth.
    await page.route('**/*', route => ['GET', 'HEAD', 'OPTIONS'].includes(route.request().method()) ? route.continue() : route.abort());
    assert.equal((await page.goto(base, { waitUntil: 'networkidle' })).status(), 200);
    const forbidden = /demostraci[oó]n|\bdemo\b|simulador|simulaci[oó]n|fictici|correo de muestra|suscribirme|boceta tu camiseta/i;
    assert.doesNotMatch(await page.locator('body').innerText(), forbidden, 'Production must not expose demo features');
    assert.equal(await page.locator('#personaliza, .newsletter, .customizer, [data-action="open-customizer"], [data-action="submit-newsletter"]').count(), 0);
    assert.equal(await page.getByRole('button', { name: 'Personaliza', exact: true }).count(), 0);
    await page.evaluate(() => {
      window.__scrollTargets = [];
      Element.prototype.scrollIntoView = function () { window.__scrollTargets.push(this.id); };
    });
    for (const [action, target] of [['hero-explore', 'catalogo'], ['nav-catálogo', 'catalogo'], ['nav-colecciones', 'colecciones'], ['nav-nosotros', 'nosotros'], ['footer-catálogo', 'catalogo'], ['footer-colecciones', 'colecciones'], ['back-to-top', 'inicio']]) {
      if (width === 390 && action.startsWith('nav-')) await page.locator('[data-action="toggle-mobile-menu"]').click();
      await page.locator(`[data-action="${action}"]`).click();
      assert.equal(await page.evaluate(() => window.__scrollTargets.at(-1)), target, action);
    }
    for (const selector of ['.hero-copy .button--line', '[data-action="footer-preguntas-frecuentes"]']) {
      await page.locator(selector).click();
      await page.getByRole('dialog', { name: /Centro de ayuda/ }).waitFor();
      assert.doesNotMatch(await page.getByRole('dialog').innerText(), forbidden);
      await page.keyboard.press('Escape');
    }
    await page.locator('[data-action="open-account"]').click();
    await page.getByRole('button', { name: 'Continuar con Google', exact: true }).waitFor();
    await page.screenshot({ path: `${dir}/${width}-account.png` });
    await page.keyboard.press('Escape');
    await page.locator('[data-action="open-product-gato-cosmico"]').click();
    await page.locator('[data-action="add-to-cart"]').click();
    await page.locator('[data-action="open-cart"]').click();
    await page.getByLabel('Calle', { exact: true }).waitFor();
    await page.locator('[data-action="register-and-pay"]').waitFor();
    await page.screenshot({ path: `${dir}/${width}-cart.png` });
    await page.keyboard.press('Escape');
    await page.locator('.toast').waitFor({ state: 'hidden' });
    await page.locator('#nosotros').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${dir}/${width}-about-footer.png` });
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${dir}/${width}-footer.png` });
    const links = await page.locator('footer a').evaluateAll(elements => elements.map(e => e.getAttribute('href')));
    for (const href of links) {
      assert.equal((await page.goto(new URL(href, base).href, { waitUntil: 'networkidle' })).status(), 200, href);
      assert.doesNotMatch(await page.locator('body').innerText(), forbidden, href);
      const broken = await page.locator('a[href^="#"]').evaluateAll(elements => elements.filter(e => !document.getElementById(e.hash.slice(1))).map(e => e.hash));
      assert.deepEqual(broken, []);
    }
    assert.deepEqual(errors, []);
    results.push({ width, pages: links.length + 1, demoAbsent: true, navigation: true, googleAccount: true, cartAddressCheckout: true, errors });
    fs.writeFileSync(`${dir}/results.json`, JSON.stringify({ base, results, noOrdersChargesOrEmails: true }, null, 2));
    await page.close();
  }
  console.log(JSON.stringify({ base, results, evidence: dir, noOrdersChargesOrEmails: true }, null, 2));
} finally { await browser.close(); }
