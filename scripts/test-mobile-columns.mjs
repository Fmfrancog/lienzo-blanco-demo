import assert from 'node:assert/strict';
import {chromium as pw} from 'playwright';
import chromium from '@sparticuz/chromium';
const browser=await pw.launch({args:chromium.args,executablePath:await chromium.executablePath()});
try {
 const page=await browser.newPage();
 for(const width of [320,390,430,520,1440]) {
  await page.setViewportSize({width,height:900});
  await page.goto(process.env.BASE_URL||'http://127.0.0.1:3011',{waitUntil:'networkidle'});
  const layout=await page.locator('.product-grid').evaluate(el=>({columns:getComputedStyle(el).gridTemplateColumns.split(' ').length,overflow:document.documentElement.scrollWidth>innerWidth}));
  assert.equal(layout.columns,width<=520?2:4,`columns at ${width}`);
  assert.equal(layout.overflow,false,`overflow at ${width}`);
  if(width===390){await page.locator('[data-testid="product-card"]').first().scrollIntoViewIfNeeded();await page.waitForFunction(()=>Array.from(document.querySelectorAll('.product-card img')).slice(0,2).every(img=>img.complete && img.naturalWidth>0));await page.screenshot({path:'/opt/data/plur-mobile-two-columns.png'});}
  console.log(JSON.stringify({width,...layout}));
 }
}finally{await browser.close();}
