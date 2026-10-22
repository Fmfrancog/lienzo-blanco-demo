import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import c from '@sparticuz/chromium';
const browser=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
try {
 for(const width of [390,1280]) {
  const page=await browser.newPage({viewport:{width,height:844}});
  const errors=[];let posts=0;
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/link-orders/health',r=>r.fulfill({json:{version:'link-orders-v1',ready:true}}));
  await page.route('**/link-orders',r=>{posts++;return r.abort();});
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:3044');
  await page.locator('[data-action="open-product-gato-cosmico"]').click();await page.locator('[data-action="select-size-G"]').click();await page.locator('[data-action="add-to-cart"]').click();await page.locator('[data-action="open-cart"]').click();
  for(const [i,total] of [398,597,597,796,995].entries()) {
   assert.match(await page.locator('[data-testid="cart-grand-total"]').innerText(),new RegExp(String(total)));
   assert.match(await page.locator('[data-testid="cart-shipping"]').innerText(),i<2?/199/:/Gratis/);
   assert.match(await page.locator('[data-action="register-and-pay"]').innerText(),new RegExp(String(total)));
   assert.ok(await page.locator('[data-action="register-and-pay"]').isDisabled());
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('[data-action="increase-cart-gato-cosmico"]').click();
  }
  await page.locator('[data-testid="checkout-limit"]').waitFor();assert.equal(await page.locator('[data-action="register-and-pay"]').count(),0);
  assert.equal(posts,0);assert.deepEqual(errors,[]);await page.close();
 }
 console.log('PASS mobile/desktop quantities 1–5, shipping, totals, consent gate and >5 block; zero order POST');
}finally{await browser.close();}
