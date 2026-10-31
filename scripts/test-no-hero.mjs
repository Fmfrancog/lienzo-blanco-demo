import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import c from '@sparticuz/chromium';
const browser=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
try {
 for(const width of [390,1440]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:3044');
  assert.equal(await page.locator('main .hero').count(),0,'introductory hero block must be removed');
  assert.doesNotMatch(await page.locator('main').innerText(),/No pases desapercibido|Gráficas que hablan por ti/);
  assert.equal(await page.getByRole('region',{name:'Destacados',exact:true}).count(),1);
  assert.equal(await page.getByRole('searchbox',{name:'Buscar diseños'}).isVisible(),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  console.log(JSON.stringify({width,heroRemoved:true,featuredAndSearchPreserved:true}));await page.close();
 }
}finally{await browser.close();}
