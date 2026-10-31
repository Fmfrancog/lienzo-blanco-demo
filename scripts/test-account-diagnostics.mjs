import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import c from '@sparticuz/chromium';
const base = process.env.BASE_URL || 'http://127.0.0.1:3044';
const browser = await chromium.launch({ args: c.args.filter(a => !['--single-process', '--disable-web-security'].includes(a)), executablePath: await c.executablePath(), headless: true });
try {
  for (const [query, expected] of [
    ['#sb=&error=server_error&error_code=unexpected_failure&error_description=Unable+to+exchange+external+code%3A+PRIVATE_SENTINEL&state=PRIVATE_SENTINEL&access_token=PRIVATE_SENTINEL&refresh_token=PRIVATE_SENTINEL&code=PRIVATE_SENTINEL', 'PLUR-AUTH-PROVIDER'],
    ['?error=access_denied&error_description=PRIVATE_SENTINEL', 'PLUR-AUTH-DENIED'],
    ['?error_code=provider_disabled&error_description=PRIVATE_SENTINEL', 'PLUR-AUTH-CONFIG'],
    ['?error=PRIVATE_SENTINEL&error_code=PRIVATE_SENTINEL', 'PLUR-AUTH-CALLBACK'],
    ['?code=PRIVATE_SENTINEL', 'PLUR-AUTH-VERIFIER'],
  ]) {
    const page = await browser.newPage();
    const logs = [];
    page.on('console', m => logs.push(m.text()));
    page.on('pageerror', e => logs.push(e.message));
    await page.goto(base + '/' + query);
    await page.locator('[data-action="open-account"]').click();
    await page.getByRole('alert').filter({ hasText: expected }).waitFor({ timeout: 10000 });
    const evidence = await page.evaluate(() => JSON.stringify({ text: document.body.innerText, local: { ...localStorage }, session: { ...sessionStorage }, url: location.href }));
    assert.ok(!evidence.includes('PRIVATE_SENTINEL'), 'callback secrets must not survive in UI, storage or URL');
    assert.ok(!logs.join('').includes('PRIVATE_SENTINEL'), 'no callback secrets in console');
    console.log('PASS', expected);
    await page.close();
  }
} finally { await browser.close(); }
