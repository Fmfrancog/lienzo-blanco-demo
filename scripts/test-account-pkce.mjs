import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import c from '@sparticuz/chromium';
const base=process.env.BASE_URL||'http://127.0.0.1:3044';
const browser=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
try {
 for(const scenario of (process.env.SCENARIO ? [process.env.SCENARIO] : ['successful-callback','missing-verifier','rejected-code'])) {
  const p=await browser.newPage();let authorize;let exchanges=0;let posts=0;
  const logs=[];p.on('console',m=>logs.push(m.text()));p.on('pageerror',e=>logs.push(e.message));
  await p.route('**/auth/v1/authorize**',r=>{authorize=new URL(r.request().url());return r.fulfill({contentType:'text/html',body:'Test-only authorization interception. No Google identity used.'});});
  await p.route('**/auth/v1/token**',r=>{exchanges++;assert.equal(r.request().postDataJSON().auth_code,'synthetic-code');assert.ok(r.request().postDataJSON().code_verifier);return r.fulfill(scenario==='rejected-code'?{status:400,headers:{'x-supabase-api-version':'2024-01-01','access-control-expose-headers':'x-supabase-api-version'},json:{code:'flow_state_expired',msg:'PRIVATE_REJECTION_SENTINEL'}}:{json:{access_token:'test-only-token',refresh_token:'test-only-refresh',expires_in:3600,token_type:'bearer',user:{id:'user-a',email:'buyer@example.test',aud:'authenticated',app_metadata:{provider:'google'},user_metadata:{}}}});});
  await p.route('**/account/health',r=>r.fulfill({json:{version:'accounts-v1',ready:true}}));
  await p.route('**/account/orders',r=>r.fulfill({json:{orders:[],hasMore:false}}));
  await p.route('**/link-orders/health',r=>r.fulfill({json:{version:'link-orders-v1',ready:true}}));
  await p.route('**/link-orders',r=>{posts++;return r.abort();});
  await p.goto(base);await p.locator('[data-action="open-product-gato-cosmico"]').click();await p.locator('[data-action="add-to-cart"]').click();await p.locator('[data-action="open-cart"]').click();
  await p.getByRole('button',{name:'Iniciar sesión con Google antes de comprar',exact:true}).click();
  await p.waitForURL('**/auth/v1/authorize**');assert.equal(authorize.searchParams.get('provider'),'google');assert.equal(authorize.searchParams.get('code_challenge_method'),'s256');
  const callback=new URL(authorize.searchParams.get('redirect_to'));assert.equal(callback.origin,base);callback.searchParams.set('code','synthetic-code');callback.searchParams.set('keep','yes');
  if(scenario==='missing-verifier') {await p.goto(base);await p.evaluate(()=>{for(const k of Object.keys(sessionStorage))if(k.includes('code-verifier'))sessionStorage.removeItem(k);});}
  await p.goto(callback.href);await p.locator('[data-action="open-account"]').click();
  if(scenario==='successful-callback')await p.getByText('Sesión iniciada: buyer@example.test',{exact:true}).waitFor();else await p.getByRole('button',{name:'Continuar con Google',exact:true}).waitFor();
  if(scenario!=='successful-callback') await p.getByRole('alert').filter({hasText:scenario==='missing-verifier'?'PLUR-AUTH-VERIFIER':'PLUR-AUTH-EXPIRED'}).waitFor({timeout:10000});
  assert.equal(new URL(p.url()).searchParams.get('code'),null);
  const account=await p.getByRole('dialog').innerText();await p.keyboard.press('Escape');await p.locator('[data-action="open-cart"]').click();await p.getByRole('heading',{name:'Datos de tu pedido'}).waitFor();
  const checkout=await p.getByRole('dialog').innerText();assert.match(checkout,/Gato/);assert.match(checkout,scenario==='successful-callback'?/Este pedido se vinculará a buyer@example.test/:/Iniciar sesión con Google antes de comprar/);
  assert.equal(exchanges,scenario==='missing-verifier'?0:1);assert.equal(posts,0);
  if(scenario==='successful-callback'){assert.equal(new URL(p.url()).searchParams.get('code'),null);await p.reload();await p.locator('[data-action="open-cart"]').click();await p.getByText('Este pedido se vinculará a buyer@example.test.',{exact:false}).waitFor();}
  const exposed=await p.evaluate(()=>JSON.stringify({dom:document.body.innerText,local:{...localStorage},session:{...sessionStorage},url:location.href}));assert.ok(!exposed.includes('PRIVATE_REJECTION_SENTINEL'));assert.ok(!exposed.includes('synthetic-code'));
  assert.ok(!logs.join('').includes('PRIVATE_REJECTION_SENTINEL'));
  assert.ok(!logs.join('').includes('synthetic-code'));
  console.log(JSON.stringify({scenario,exchanges,noOrderPosts:posts===0,accountShowsError:/PLUR-AUTH-/.test(account),checkoutRecognizesSession:scenario==='successful-callback',codeStillInURL:new URL(p.url()).searchParams.has('code')}));await p.close();
 }
}finally{await browser.close();}
