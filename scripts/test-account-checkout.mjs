import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import c from '@sparticuz/chromium';
const browser = await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:3044';
try {
 for (const authenticated of [true,false]) {
  const page=await browser.newPage();
  if(authenticated) await page.addInitScript(()=>sessionStorage.setItem('sb-zniawtkrdnbevyojewdi-auth-token',JSON.stringify({access_token:'test-only-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,token_type:'bearer',user:{id:'user-a',email:'buyer@example.test',aud:'authenticated',app_metadata:{provider:'google'},user_metadata:{}}})));
  await page.route('**/link-orders/health',r=>r.fulfill({json:{version:'link-orders-v1',ready:true}}));
  let calls=0; const headers=[];
  await page.route('**/link-orders',r=>{calls++;headers.push(r.request().headers());return r.fulfill({status:503,json:{error:'Test-only unavailable; no real order'}});});
  await page.goto(base);await page.locator('[data-action="open-product-gato-cosmico"]').click();await page.locator('[data-action="add-to-cart"]').click();await page.locator('[data-action="open-cart"]').click();
  await page.getByLabel('Nombre completo',{exact:true}).fill('Cliente Prueba');await page.getByLabel('Correo electrónico para tu pedido',{exact:true}).fill('buyer@example.test');await page.getByLabel('Teléfono de contacto',{exact:true}).fill('5512345678');await page.getByLabel('Calle',{exact:true}).fill('Calle Prueba');await page.getByLabel('Número exterior',{exact:true}).fill('10');await page.getByLabel('Colonia',{exact:true}).fill('Centro');await page.getByLabel('Código postal',{exact:true}).fill('55900');await page.getByLabel('Municipio o alcaldía',{exact:true}).fill('Otumba');await page.getByLabel('Estado',{exact:true}).selectOption('México');await page.locator('[data-testid="order-consent"]').check();
  if (!authenticated) await page.evaluate(async()=>{const inputs=[...document.querySelectorAll('.custom-form input:not([type="checkbox"])')].map(input=>input.value);const size=document.querySelector('.cart-line span').textContent.replace('Talla ','');const payload={items:[{id:'gato-cosmico',size,quantity:1}],customer:{name:inputs[0],email:inputs[1],phone:inputs[2],address:'Calle Prueba 10, Col. Centro, C.P. 55900, Otumba, México'},consent:true,expectedTotalCents:39800};const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(payload)))),b=>b.toString(16).padStart(2,'0')).join('');localStorage.setItem('plur-link-order-attempt-v1',JSON.stringify({key:'legacy-guest-key',token:'legacy-guest-token',fingerprint}));});
  for(let i=0;i<2;i++){await page.locator('[data-action="register-and-pay"]').click();await page.getByRole('alert').filter({hasText:'Test-only unavailable'}).waitFor();}
  assert.equal(calls,2);assert.equal(headers[0].authorization,authenticated?'Bearer test-only-token':undefined,'checkout must associate authenticated orders with the JWT');assert.equal(headers[0]['idempotency-key'],headers[1]['idempotency-key']);assert.equal(headers[0]['x-order-token'],headers[1]['x-order-token']);
  assert.match(await page.getByRole('dialog').innerText(),authenticated?/vinculará a/:/invitado/);
  if (authenticated) { await page.evaluate(()=>{const key='sb-zniawtkrdnbevyojewdi-auth-token';const s=JSON.parse(sessionStorage.getItem(key));s.user.id='user-b';sessionStorage.setItem(key,JSON.stringify(s));});await page.locator('[data-action="register-and-pay"]').click();await page.getByRole('alert').filter({hasText:'La cuenta cambió'}).waitFor({timeout:3000});assert.equal(calls,2); }
  await page.close();
 }
 console.log('PASS mocked authenticated/guest checkout, bearer association and stable retry keys; NO orders or payments sent');
} finally {await browser.close();}
