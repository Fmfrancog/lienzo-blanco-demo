import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium as playwright } from 'playwright';
import chromium from '@sparticuz/chromium';
const manifest = JSON.parse(fs.readFileSync(process.env.CATALOG_MANIFEST || new URL('../src/data/drive-products.json', import.meta.url), 'utf8'));
const base = process.env.BASE_URL || 'http://127.0.0.1:3011';
const reportDir = process.env.REPORT_DIR || '/opt/data/plur-import';
fs.mkdirSync(reportDir, {recursive:true});
const browser = await playwright.launch({args:chromium.args,executablePath:await chromium.executablePath(),headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[]; const results=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
try {
 await page.goto(base,{waitUntil:'networkidle',timeout:120000});
 assert.equal(await page.locator('[data-testid="product-card"]').count(),manifest.length+1,'All source designs once, preserving Gato Cósmico');
 for (const p of manifest) {
  const id=p.existingId||p.id;
  const button=page.locator(`[data-action="open-product-${id}"]`);
  assert.equal(await button.count(),1,`one card: ${p.name}`);
  const card=button.locator('..');
  assert.equal(await card.locator('h3').innerText(),p.name);
  const cover=p.images.find(image=>/(?:\/|-)0?5\.[^.]+$/.test(image)) || p.images.find(image=>/(?:\/|-)0?4\.[^.]+$/.test(image)) || p.images[0];
  assert.equal(await card.locator('img').getAttribute('src'),cover);
  await button.click();
  const dialog=page.getByRole('dialog',{name:/detalle de producto/i});
  assert.equal(await dialog.locator('[data-testid="gallery-main-image"]').getAttribute("src"),cover);
  assert.equal(await dialog.locator('[data-testid="gallery-thumbnail"]').count(),p.images.length);
  await dialog.locator('[data-testid="gallery-thumbnail"]').last().click();
  assert.equal(await dialog.locator('[data-testid="gallery-main-image"]').getAttribute('src'),p.images.at(-1));
  assert.match(await dialog.locator('[data-testid="product-pricing"]').innerText(),/299[\s\S]*199/);
  assert.deepEqual(await dialog.locator('[data-testid="product-size"]').allTextContents(),['CH','M','G','EG']);
  await dialog.getByRole('button',{name:'EG',exact:true}).click();
  await dialog.locator('[data-action="add-to-cart"]').click();
  await page.locator('[data-action="open-cart"]').click();
  const cart=page.getByRole('dialog',{name:/tu bolsa/i});
  assert.equal(await cart.locator('.cart-line h3').innerText(),p.name);
  assert.match(await cart.locator('.cart-line').innerText(),/Talla EG/);
  assert.equal(await cart.locator('.cart-total strong').innerText(),'$199');
  await cart.locator(`[data-action="decrease-cart-${id}"]`).click();
  await page.keyboard.press('Escape');
  const assets=[];
  for(const image of p.images){const r=await page.request.get(base+image);assert.equal(r.status(),200,image);assets.push({url:image,status:r.status()});}
  results.push({id,name:p.name,gallery:p.images.length,price:199,compareAtPrice:299,sizes:['CH','M','G','EG'],cart:'passed',assets});
  fs.writeFileSync(`${reportDir}/browser-verification.json`,JSON.stringify({base,results,errors},null,2));
 }
 const search=page.getByRole('searchbox',{name:'Buscar diseños'});
 await search.fill(manifest[0].name);assert.equal(await page.locator('[data-testid="product-card"]').count(),1);
 await search.fill('');await page.locator('[data-action="filter-catálogo"]').click();assert.equal(await page.locator('[data-testid="product-card"]').count(),manifest.length);
 await page.locator('[data-action="filter-todos"]').click();
 for (const [label,viewport] of [['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]]) {
  // Search is desktop-only in the existing UI; filter before resizing.
  await page.setViewportSize({width:1440,height:1000});
  await search.fill(manifest[0].name);
  await page.setViewportSize(viewport);
  await page.locator(`[data-action="open-product-${manifest[0].id}"]`).click();
  await page.locator('[data-testid="gallery-thumbnail"]').last().click();
  assert.ok(await page.locator('[data-action="add-to-cart"]').isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${reportDir}/${label}-gallery.png`});
  await page.locator('[data-action="add-to-cart"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${reportDir}/${label}-purchase.png`});
  await page.keyboard.press('Escape');
 }
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({status:'ok',products:results.length,assets:results.reduce((sum,p)=>sum+p.assets.length,0),errors}));
} finally {await browser.close();}
