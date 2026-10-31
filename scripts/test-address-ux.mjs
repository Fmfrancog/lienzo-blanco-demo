import assert from 'node:assert/strict';
import {chromium} from 'playwright';import c from '@sparticuz/chromium';import {mkdir} from 'node:fs/promises';
const b=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
try{for(const width of [390,1280]){
 const p=await b.newPage({viewport:{width,height:950}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.route('https://plur-pagos.fmfrancog03.workers.dev/**',r=>{assert.equal(r.request().method(),'GET');return r.fulfill({json:{version:'link-orders-v1',ready:true}});});
 await p.goto(process.env.BASE_URL||'http://127.0.0.1:3044');await p.locator('[data-action="open-product-gato-cosmico"]').click();await p.locator('[data-action="select-size-M"]').click();await p.locator('[data-action="add-to-cart"]').click();await p.locator('[data-action="open-cart"]').click();
 assert.equal(await p.getByRole('heading',{name:'Calle y números',exact:true}).count(),1);
 const f=n=>p.getByLabel(n,{exact:true});
 await f('Calle').fill('Calle de prueba');await p.getByRole('button',{name:'Usar S/N',exact:true}).click();assert.equal(await f('Número exterior').inputValue(),'S/N');
 await f('Código postal').fill('123');await f('Colonia').click();assert.equal(await f('Código postal').getAttribute('aria-invalid'),'true');
 await f('Código postal').fill('01234');await f('Colonia').fill('Centro');await f('Municipio o alcaldía').fill('Álvaro Obregón');await f('Estado').selectOption('Ciudad de México');
 const preview=p.getByTestId('address-preview');assert.match(await preview.innerText(),/Calle de prueba S\/N/);assert.match(await preview.innerText(),/01234/);
 await f('Número interior (opcional)').fill('4B');assert.match(await preview.innerText(),/Int. 4B/);
 await f('Calle').scrollIntoViewIfNeeded();await mkdir('evidence/address-ux',{recursive:true});await p.screenshot({path:`evidence/address-ux/${width}.png`});
 await preview.scrollIntoViewIfNeeded();await p.screenshot({path:`evidence/address-ux/${width}-preview.png`});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);console.log(JSON.stringify({width,groups:true,sn:true,blurValidation:true,preview:true,noOrders:true}));await p.close();
}}finally{await b.close();}
