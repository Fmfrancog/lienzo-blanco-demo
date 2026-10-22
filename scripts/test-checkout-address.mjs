import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import c from '@sparticuz/chromium';
const browser=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:3044';
const evidence=process.env.EVIDENCE_DIR||'/opt/data/checkout-address-evidence';
await mkdir(evidence,{recursive:true});
try {
 for(const width of [390,1280]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  let calls=0, payload;
  if(!process.env.LIVE_CHECK) await page.route('**/link-orders/health',r=>r.fulfill({json:{version:'link-orders-v1',ready:true}}));
  await page.route('**/link-orders',r=>{calls++;payload=r.request().postDataJSON();return r.fulfill({status:503,json:{error:'Mock only: no order created'}});});
  await page.goto(base);await page.locator('[data-action="open-product-gato-cosmico"]').click();await page.locator('[data-action="add-to-cart"]').click();await page.locator('[data-action="open-cart"]').click();
  const field=name=>page.getByLabel(name,{exact:true});
  await field('Calle').waitFor({timeout:5000});
  await field('Nombre completo').fill('Cliente Prueba');await field('Correo electrónico para tu pedido').fill('prueba@example.test');await field('Teléfono de contacto').fill('5512345678');
  await field('Calle').fill('Calle de Prueba');await field('Número exterior').fill('S/N');await field('Colonia').fill('Centro');await field('Código postal').fill('01234');await field('Municipio o alcaldía').fill('Álvaro Obregón');await field('Estado').selectOption({label:'Ciudad de México'});
  assert.equal(await field('Estado').locator('option').count(),33);
  assert.equal(await field('Código postal').getAttribute('type'),'text');assert.equal(await field('Código postal').getAttribute('inputmode'),'numeric');
  for(const el of await page.locator('.checkout-manual input:not([type=checkbox]), .checkout-manual select, .checkout-manual textarea').all()) assert.ok(await el.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await field('Calle').scrollIntoViewIfNeeded();await page.screenshot({path:`${evidence}/${width}-address.png`});
  await page.locator('[data-testid="order-consent"]').check();
  await field('Código postal').fill('1234');await page.locator('[data-action="register-and-pay"]').click();
  assert.equal(calls,0);assert.equal(await field('Código postal').getAttribute('aria-invalid'),'true');
  await field('Código postal').scrollIntoViewIfNeeded();await page.screenshot({path:`${evidence}/${width}-invalid.png`});
  await field('Código postal').fill('01234');
  if(!process.env.LIVE_CHECK) {
   const originals={Calle:'Calle de Prueba','Número exterior':'S/N','Número interior (opcional)':'',Colonia:'Centro','Municipio o alcaldía':'Álvaro Obregón','Referencias de entrega (opcional)':''};
   for(const [label,length] of Object.entries({Calle:160,'Número exterior':30,'Número interior (opcional)':30,Colonia:120,'Municipio o alcaldía':120,'Referencias de entrega (opcional)':200})) await field(label).fill('x'.repeat(length));
   await page.locator('[data-action="register-and-pay"]').click();
   await page.getByRole('alert').filter({hasText:'700'}).waitFor({timeout:3000});assert.equal(calls,0);
   for(const [label,value] of Object.entries(originals)) await field(label).fill(value);
   await page.locator('[data-action="register-and-pay"]').click();await page.getByRole('alert').filter({hasText:'Mock only'}).waitFor();
   assert.equal(calls,1);assert.equal(payload.customer.address,'Calle de Prueba S/N, Col. Centro, C.P. 01234, Álvaro Obregón, Ciudad de México');assert.equal(payload.expectedTotalCents,39800);
   const stored=await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}));assert.ok(!stored.includes('Calle de Prueba'));assert.ok(!stored.includes('prueba@example.test'));
  }
  await page.close();
 }
 console.log('PASS mobile/desktop address, 32 states, S/N, leading zero, accessibility, invalid blocks POST, '+(process.env.LIVE_CHECK?'production: zero POST':'mock payload and no stored PII'));
}finally{await browser.close();}
