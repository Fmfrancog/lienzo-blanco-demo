import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium as pw } from 'playwright';
import chromium from '@sparticuz/chromium';
const removed=['sol-lento','orbita-03','marea-interior','herbario-nocturno','haz-espacio','modulo-libre','ojo-claro','cumbre-quieta','alien-amable','hecho-a-mano','luna-nueva','fruta-rara'];
const manifest=JSON.parse(fs.readFileSync(new URL('../src/data/drive-products.json',import.meta.url),'utf8'));
const browser=await pw.launch({args:chromium.args,executablePath:await chromium.executablePath()});
try {
 const page=await browser.newPage();
 await page.goto(process.env.BASE_URL||'http://127.0.0.1:3011',{waitUntil:'networkidle'});
 assert.equal(await page.locator('[data-testid="product-card"]').count(),173);
 for(const id of removed) assert.equal(await page.locator(`[data-action="open-product-${id}"]`).count(),0,id);
 for(const id of ['gato-cosmico',...manifest.map(p=>p.id)]) assert.equal(await page.locator(`[data-action="open-product-${id}"]`).count(),1,id);
 console.log(JSON.stringify({status:'ok',removed:removed.length,remaining:173,allPhotographicProductsPreserved:true}));
} finally { await browser.close(); }
