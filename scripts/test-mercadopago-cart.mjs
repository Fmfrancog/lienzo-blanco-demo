import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium as playwright } from 'playwright';
import chromium from '@sparticuz/chromium';
const base = process.env.BASE_URL || 'http://127.0.0.1:3033';
const evidence = process.env.EVIDENCE_DIR || '/opt/data/plur-links-evidence';
await fs.mkdir(evidence,{recursive:true});
const browser = await playwright.launch({args:chromium.args.filter(arg => arg !== '--single-process'),executablePath:await chromium.executablePath(),headless:true});
const results=[];
try {
 for (const width of [390,1280]) {
  const page = await browser.newPage({viewport:{width,height:844},acceptDownloads:true});
  const errors=[]; const worker=[];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('request', r=>{if(r.url().includes('workers.dev'))worker.push(r.url());});
  await page.goto(base,{waitUntil:'networkidle'});
  assert.ok((await page.locator('body').innerText()).includes('Envío gratis a partir de 3 playeras'));
  await page.locator('[data-action="open-product-gato-cosmico"]').click();
  await page.locator('[data-action="select-size-G"]').click();
  await page.locator('[data-action="add-to-cart"]').click();
  await page.locator('[data-action="open-cart"]').click();
  const expected=[[398,'2xwcTmy'],[597,'2SpociY'],[597,'1tGZvcR'],[796,'2BeYgHo'],[995,'26aMKHf']];
  for(let i=0;i<expected.length;i++) {
   const [total,slug]=expected[i];
   assert.match(await page.locator('[data-testid="cart-grand-total"]').innerText(),new RegExp(String(total)));
   assert.match(await page.locator('[data-testid="cart-shipping"]').innerText(),i<2?/199/:/Gratis/);
   assert.equal(await page.locator('[data-action="checkout"]').count(),0);
   await page.getByLabel('Nombre completo').fill('CLIENTE DE PRUEBA');
   await page.getByLabel('Dirección de entrega').fill('DIRECCIÓN FICTICIA DE PRUEBA, colonia, ciudad, estado, CP 00000');
   const downloadEvent=page.waitForEvent('download');
   await page.getByRole('button',{name:'Descargar resumen del pedido'}).click();
   const download=await downloadEvent;
   const text=await fs.readFile(await download.path(),'utf8');
   assert.ok(text.includes('Gato Cósmico | Talla G | Cantidad '+(i+1)));
   assert.ok(text.includes('DIRECCIÓN FICTICIA DE PRUEBA'));
   assert.ok(text.includes(`Total: $${total} MXN`));
   const mail=await page.locator('[data-action="send-order"]').getAttribute('href');
   assert.ok(mail.startsWith('mailto:fmfrancog03@gmail.com?'));
   assert.ok(decodeURIComponent(mail).includes('Adjunta el resumen'));
   await page.getByLabel('Ya envié el resumen del pedido a PLUR y confirmé disponibilidad y entrega con la tienda.').check();
   const checkout=page.locator('[data-action="checkout"]');
   assert.equal(await checkout.getAttribute('href'),`https://mpago.la/${slug}`);
   assert.equal(await checkout.getAttribute('rel'),'noopener noreferrer');
   assert.match(await page.locator('[data-testid="checkout-status"]').innerText(),/Confirmación manual/);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.ok(await page.getByLabel('Dirección de entrega').evaluate(el => el.clientWidth >= el.parentElement.clientWidth - 4),'La dirección debe aprovechar el ancho del formulario');
   if(i===0) await page.screenshot({path:`${evidence}/checkout-${width}.png`});
   results.push({width,quantity:i+1,total,href:await checkout.getAttribute('href')});
   await page.locator('[data-action="increase-cart-gato-cosmico"]').click();
  }
  assert.match(await page.locator('[data-testid="checkout-limit"]').innerText(),/más de 5/);
  assert.equal(await page.locator('[data-action="checkout"]').count(),0);
  assert.deepEqual(worker,[]); assert.deepEqual(errors,[]);
  await page.close();
 }
 await fs.writeFile(`${evidence}/results.json`,JSON.stringify({base,results,noPaymentsExecuted:true},null,2));
 console.log(JSON.stringify({base,cases:results.length,overLimitBlocked:true,noWorkerRequests:true,noPaymentsExecuted:true}));
} finally { await browser.close(); }
