import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';import {chromium} from 'playwright';import c from '@sparticuz/chromium';
const b=await chromium.launch({args:c.args.filter(a=>!['--single-process','--disable-web-security'].includes(a)),executablePath:await c.executablePath(),headless:true});
try{for(const width of [320,390,600,1440]){
 const p=await b.newPage({viewport:{width,height:1000}});await p.goto(process.env.BASE_URL||'http://127.0.0.1:3044');
 const cols=p.locator('footer .footer-column');assert.equal(await cols.count(),3);
 const boxes=await cols.evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,bottom:r.bottom,width:r.width};}));
 if(width<=600){assert.ok(boxes.every(r=>Math.abs(r.x-boxes[0].x)<1),'mobile footer groups must align in one column');for(let i=1;i<3;i++)assert.ok(boxes[i].y>=boxes[i-1].bottom&&boxes[i].y-boxes[i-1].bottom<=33,'uniform compact group gaps');}
 assert.equal(await p.locator('footer .footer-column a,footer .footer-column button').count(),9);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await p.locator('footer .footer-column').first().scrollIntoViewIfNeeded();await mkdir('evidence/footer',{recursive:true});await p.screenshot({path:`evidence/footer/${width}.png`});console.log(JSON.stringify({width,aligned:true,allLinks:9}));await p.close();
}}finally{await b.close();}
