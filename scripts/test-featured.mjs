import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import c from '@sparticuz/chromium';
const b=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
try {
 for(const width of [390,1440]) {
  const p=await b.newPage({viewport:{width,height:900},reducedMotion:'reduce'}); const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.route('https://plur-pagos.fmfrancog03.workers.dev/**',r=>r.fulfill({json:{version:'link-orders-v1',ready:true}}));
  await p.goto(process.env.BASE_URL||'http://127.0.0.1:3044');
  const section=p.getByRole('region',{name:'Destacados',exact:true});
  assert.equal(await section.count(),1,'featured carousel must exist');
  assert.equal(await section.locator('[data-testid="featured-card"]').count(),6);
  assert.doesNotMatch(await section.innerText(),/más vendidos|más vistos/i);
  const track=section.locator('#featured-track');
  await section.scrollIntoViewIfNeeded();
  await section.getByRole('button',{name:'Siguientes destacados'}).click();
  await p.waitForFunction(()=>document.querySelector('#featured-track').scrollLeft>0);
  await section.getByRole('button',{name:'Destacados anteriores'}).click();
  await p.waitForFunction(()=>document.querySelector('#featured-track').scrollLeft<2);
  const cards=section.getByTestId('featured-card');
  for(let i=0;i<6;i++){
   const card=cards.nth(i);const name=await card.locator('h3').innerText();
   assert.match(await card.innerText(),/199/);
   assert.match(await card.locator('img').getAttribute('src'),/(05|04)\.webp/);
   await card.getByRole('button',{name:'Ver diseño',exact:false}).click();
   assert.equal(await p.getByRole('dialog').locator('h2').innerText(),name);
   assert.equal(await p.locator('[data-action="add-to-cart"]').isDisabled(),true);
   await p.keyboard.press('Escape');
  }
  await track.evaluate(el=>el.scrollTo(0,0));
  await section.scrollIntoViewIfNeeded();
  await p.waitForFunction(()=>[...document.querySelectorAll('#featured-track img')].every(i=>i.complete&&i.naturalWidth>0));
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await mkdir('evidence/featured',{recursive:true});await p.screenshot({path:`evidence/featured/${width}.png`});
  assert.deepEqual(errors,[]);console.log(JSON.stringify({width,featured:6,arrows:true,products:true,overflow:false,errors}));await p.close();
 }
} finally {await b.close();}
