import { chromium } from 'playwright';
import c from '@sparticuz/chromium';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.BASE_URL||'http://127.0.0.1:3044';
const dir=process.env.EVIDENCE_DIR||'/opt/data/plur-info-evidence/local';fs.mkdirSync(dir,{recursive:true});
const slugs=['sobre-nosotros','contacto','aviso-de-privacidad','politica-de-devoluciones','terminos-y-condiciones','politica-de-cookies','envios'];
const rows=[];
const b=await chromium.launch({args:c.args,executablePath:await c.executablePath(),headless:true});
try{
 const context=await b.newContext();const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const width of [390,1440]){
 await p.setViewportSize({width,height:900});
 for(const slug of slugs){
 const response=await p.goto(`${base}/${slug}/`,{waitUntil:'networkidle'});assert.equal(response.status(),200);
 assert.equal(await p.locator('h1').count(),1);assert.ok(await p.locator('h1').isVisible());
 assert.equal(await p.locator('nav[aria-label="Información de PLUR"] a').count(),7);
 assert.equal(await p.locator('a[href="mailto:atencion@plur.com.mx"]').count(),1);
 assert.equal(await p.locator('a[href="https://wa.me/525574615455"]').count(),1);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${slug} ${width}`);
 const title=await p.locator('h1').innerText();rows.push({slug,width,status:response.status(),title});
 fs.writeFileSync(`${dir}/results.json`,JSON.stringify({base,rows,errors},null,2));
 if(['sobre-nosotros','contacto'].includes(slug))await p.screenshot({path:`${dir}/${slug}-${width}.png`,fullPage:true});
 }
 await p.goto(base,{waitUntil:'networkidle'});for(const slug of slugs)assert.equal(await p.locator(`footer a[href="/${slug}/"]`).count(),1);
 await p.locator('footer a[href="/contacto/"]').click();await p.waitForURL('**/contacto/');assert.equal(await p.locator('h1').innerText(),'Contacto');
 }
 assert.equal(rows.length,14);assert.deepEqual(errors,[]);console.log(JSON.stringify({base,pages:7,viewportCases:rows.length,footerLinks:true,errors}));
}finally{await b.close();}
