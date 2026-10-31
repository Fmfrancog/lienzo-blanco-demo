import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import c from '@sparticuz/chromium';
const browser=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:3044';
const id='11111111-1111-4111-8111-111111111111';
const session={access_token:'test-only-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,token_type:'bearer',user:{id:'user-a',email:'buyer@example.test',aud:'authenticated',app_metadata:{},user_metadata:{}}};
await mkdir('evidence/conversion',{recursive:true});
try {
 for (const width of [390,1440]) {
  const p=await browser.newPage({viewport:{width,height:900}}); const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(({session,id})=>{sessionStorage.setItem('sb-zniawtkrdnbevyojewdi-auth-token',JSON.stringify(session));localStorage.setItem('plur-link-order-attempt-v1',JSON.stringify({key:'test-key',token:'test-token',fingerprint:'test-fingerprint',accountId:'user-a',orderId:id}));Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copiedText=text;}}});},{session,id});
  let state='registered', historyCalls=0;
  await p.route('https://plur-pagos.fmfrancog03.workers.dev/**',r=>{
   assert.equal(r.request().method(),'GET','no live mutations');
   const path=new URL(r.request().url()).pathname;
   if(path==='/link-orders/health')return r.fulfill({json:{version:'link-orders-v1',ready:true}});
   if(path==='/account/health')return r.fulfill({json:{version:'accounts-v1',ready:true}});
   if(path==='/account/orders'){historyCalls++;assert.equal(r.request().headers().authorization,'Bearer test-only-token');return r.fulfill({json:{orders:['registered','paid','cancelled','future_state'].map((status,i)=>({orderId:'history-'+i,status,quantity:1,totalCents:39800,createdAt:'2026-01-01',items:[]})),hasMore:false}});}
   assert.equal(path,'/link-orders/'+id);
   return r.fulfill({json:{orderId:id,status:state,quantity:1,totalCents:39800,...(state==='registered'?{paymentUrl:'https://mpago.la/2xwcTmy'}:{})}});
  });
  await p.route('https://mpago.la/**',()=>{throw Error('Payment navigation forbidden');});
  await p.goto(base+'?status=approved'); await p.locator('[data-action="open-cart"]').click();
  await p.getByRole('heading',{name:'Pedido registrado',exact:true}).waitFor();
  assert.equal(await p.getByRole('heading',{name:'Tu bolsa está vacía',exact:true}).isVisible(),false,'receipt must not be mixed with empty-cart messaging');
  assert.equal(await p.getByLabel('Folio del pedido').evaluate(el=>el.scrollWidth<=el.clientWidth),true,'full folio must fit without horizontal clipping');
  await p.getByRole('button',{name:'Copiar folio',exact:true}).click({timeout:3000});
  assert.equal(await p.evaluate(()=>window.copiedText),id);
  await p.getByRole('status').filter({hasText:'Folio copiado'}).waitFor();
  assert.match(await p.locator('[data-testid="order-receipt"]').innerText(),/El registro no es una confirmación de pago/);
  assert.equal(await p.getByText('Pago verificado por PLUR',{exact:true}).count(),0);
  assert.match(await p.locator('#receipt-payment-warning').innerText(),/no vuelvas a hacerlo/);
  assert.equal(await p.locator('a[aria-describedby="receipt-payment-warning"]').getAttribute('href'),'https://mpago.la/2xwcTmy');
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await p.locator('.modal__head').evaluate(el=>getComputedStyle(el).position),'sticky');
  await p.locator('.modal').evaluate(el=>{el.scrollTop=0;});
  await p.screenshot({path:`evidence/conversion/receipt-${width}.png`});
  await p.getByRole('button',{name:'Preparar un pedido diferente',exact:true}).scrollIntoViewIfNeeded();
  await p.screenshot({path:`evidence/conversion/receipt-actions-${width}.png`});
  await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}},configurable:true}));
  await p.getByRole('button',{name:'Copiar folio',exact:true}).click();
  await p.getByRole('status').filter({hasText:'Selecciona y copia el folio'}).waitFor();
  assert.equal(await p.getByLabel('Folio del pedido').inputValue(),id);
  assert.equal(await p.getByLabel('Folio del pedido').evaluate(el=>document.activeElement===el&&el.selectionEnd===el.value.length),true);
  await p.getByRole('button',{name:'Ver mis pedidos',exact:true}).click();
  await p.getByRole('heading',{name:'Mis pedidos',exact:true}).waitFor();
  await p.getByText(/Estado no reconocido · consulta a PLUR/).waitFor();
  assert.equal(historyCalls,1);
  assert.match(await p.getByRole('dialog').innerText(),/Registrado · pago pendiente de verificar/);
  assert.match(await p.getByRole('dialog').innerText(),/Pago verificado/);
  for(const next of ['paid','cancelled']) {
   state=next;await p.locator('[data-action="close-dialog"]').click();await p.locator('[data-action="open-cart"]').click();
   await p.getByRole('heading',{name:next==='paid'?'Pago verificado por PLUR':'Pedido cancelado',exact:true}).waitFor();
   assert.equal(await p.locator('a[href^="https://mpago.la/"]').count(),0);
  }
  p.once('dialog',d=>d.dismiss());await p.getByRole('button',{name:'Preparar un pedido diferente',exact:true}).click();assert.ok(await p.evaluate(()=>localStorage.getItem('plur-link-order-attempt-v1')));
  p.once('dialog',d=>d.accept());await p.getByRole('button',{name:'Preparar un pedido diferente',exact:true}).click();assert.equal(await p.evaluate(()=>localStorage.getItem('plur-link-order-attempt-v1')),null);
  assert.deepEqual(errors,[]);await p.close();
 }
 console.log('PASS receipt mobile/desktop; clipboard success/fallback; account navigation and real statuses; return URL never confirms payment; confirmed new-order reset. Mocked backend only.');
}finally{await browser.close();}
