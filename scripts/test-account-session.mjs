import assert from 'node:assert/strict';
import {chromium} from 'playwright';import c from '@sparticuz/chromium';
const b=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:3044';
const session={access_token:'test-only-access-token',refresh_token:'test-only-refresh',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,token_type:'bearer',user:{id:'user-a',email:'buyer@example.test',aud:'authenticated',app_metadata:{provider:'google'},user_metadata:{},created_at:'2026-01-01'}};
try {
 const p=await b.newPage();
 await p.addInitScript(s=>{if(!sessionStorage.getItem('test-seeded')){sessionStorage.setItem('sb-zniawtkrdnbevyojewdi-auth-token',JSON.stringify(s));sessionStorage.setItem('test-seeded','yes');}},session);
 await p.route('**/account/health',r=>r.fulfill({json:{version:'accounts-v1',ready:true}}));
 await p.route('**/account/orders',r=>{assert.equal(r.request().headers().authorization,'Bearer test-only-access-token');return r.fulfill({json:{orders:[{orderId:'private-order-a',status:'registered',quantity:1,totalCents:39800,createdAt:'2026-01-01T00:00:00Z',items:[{id:'gato-cosmico',name:'Gato Cósmico',size:'G',quantity:1,unitPriceCents:19900}]}],hasMore:true}});});
 await p.route('**/auth/v1/logout**',r=>r.fulfill({json:{}}));
 await p.goto(base);await p.locator('[data-action="open-account"]').click();
 await p.getByText('Sesión iniciada: buyer@example.test',{exact:true}).waitFor();
 await p.getByText('private-order-a',{exact:true}).waitFor({timeout:5000});
 assert.match(await p.getByRole('dialog').innerText(),/Solo.*vinculad/i);
 await p.getByRole('button',{name:'Actualizar historial'}).click();
 await p.getByText('private-order-a',{exact:true}).waitFor();
 await p.getByRole('button',{name:'Cerrar sesión',exact:true}).click();
 await p.getByRole('button',{name:'Continuar con Google',exact:true}).waitFor();
 assert.equal(await p.getByText('private-order-a',{exact:true}).count(),0);
 assert.equal(await p.evaluate(()=>sessionStorage.getItem('sb-zniawtkrdnbevyojewdi-auth-token')),null);
 console.log('PASS private authenticated history, refresh, honest linking copy, logout clears identity/history');
} finally {await b.close();}
