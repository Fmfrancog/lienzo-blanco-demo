import assert from 'node:assert/strict';
import {chromium} from 'playwright';import c from '@sparticuz/chromium';
const browser=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:3044';
const session={access_token:'test-only-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,token_type:'bearer',user:{id:'user-a',email:'buyer@example.test',aud:'authenticated',app_metadata:{},user_metadata:{}}};
try{
 const p=await browser.newPage();await p.addInitScript(s=>sessionStorage.setItem('sb-zniawtkrdnbevyojewdi-auth-token',JSON.stringify(s)),session);
 await p.route('**/account/health',r=>r.fulfill({json:{version:'accounts-v1',ready:true}}));
 let release; const held=new Promise(resolve=>release=resolve);let started;const requested=new Promise(resolve=>started=resolve);
 await p.route('**/account/orders',async r=>{started();await held;await r.fulfill({json:{orders:[{orderId:'late-private-order',status:'registered',quantity:1,totalCents:39800,createdAt:'2026-01-01',items:[]}],hasMore:false}}).catch(()=>{});});
 await p.route('**/auth/v1/logout**',r=>r.fulfill({json:{}}));
 await p.goto(base);await p.locator('[data-action="open-account"]').click();await requested;await p.getByRole('button',{name:'Cerrar sesión',exact:true}).click();release();await p.getByRole('button',{name:'Continuar con Google',exact:true}).waitFor();assert.equal(await p.getByText('late-private-order',{exact:true}).count(),0);await p.close();
 const q=await browser.newPage();await q.addInitScript(()=>localStorage.setItem('plur-link-order-attempt-v1',JSON.stringify({key:'test-key',token:'test-token',fingerprint:'test-fingerprint',accountId:'another-account',orderId:'private-receipt'})));
 let recovery=0;await q.route('**/link-orders/health',r=>r.fulfill({json:{version:'link-orders-v1',ready:true}}));await q.route('**/link-orders/private-receipt',r=>{recovery++;return r.abort();});
 await q.goto(base);await q.locator('[data-action="open-cart"]').click();await q.getByRole('alert').filter({hasText:'otra cuenta'}).waitFor();assert.equal(recovery,0);assert.equal(await q.getByText('private-receipt',{exact:true}).count(),0);
 console.log('PASS delayed history cannot reappear after logout; another account receipt is never fetched or rendered');
}finally{await browser.close();}
