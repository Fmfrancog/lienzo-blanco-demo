import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import c from '@sparticuz/chromium';
const b=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
try{for(const width of [390,1440]){
 const p=await b.newPage({viewport:{width,height:900}});
 await p.goto(process.env.BASE_URL||'http://127.0.0.1:3044');
 assert.equal(await p.locator('#colecciones').count(),0,'collections module must be absent');
 assert.equal(await p.getByRole('button',{name:'Colecciones',exact:true}).count(),0);
 assert.equal(await p.getByRole('region',{name:'Destacados',exact:true}).count(),1);
 const total=await p.getByTestId('product-card').count();assert.ok(total>0);
 await p.locator('[data-action="filter-calaveras"]').click();
 const filtered=await p.getByTestId('product-card').count();assert.ok(filtered>0&&filtered<total);
 await p.locator('[data-action="filter-todos"]').click();assert.equal(await p.getByTestId('product-card').count(),total);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 console.log(JSON.stringify({width,collectionsRemoved:true,featuredPreserved:true,categoryFiltering:true,total}));await p.close();
}}finally{await b.close();}
