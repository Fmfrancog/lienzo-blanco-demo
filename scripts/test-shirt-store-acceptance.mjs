import { chromium as playwright } from 'playwright';
import chromium from '@sparticuz/chromium';

const browser = await playwright.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors=[];
page.on('console', (msg) => { if (msg.type()==='error') errors.push(msg.text()); });
page.on('pageerror', (error) => errors.push(error.message));

try {
  await page.goto('http://127.0.0.1:3010', { waitUntil: 'networkidle', timeout: 120000 });
  const title=await page.title();
  if(!title.includes('Lienzo Blanco')) throw new Error(`Expected Lienzo Blanco title, received: ${title}`);

  for (const label of ['Catálogo','Colecciones','Personaliza','Nosotros','Ayuda']) {
    if(await page.getByRole('button',{name:label,exact:true}).count()===0) throw new Error(`Missing navigation button: ${label}`);
  }

  const products=page.locator('[data-testid="product-card"]');
  const productCount=await products.count();
  if(productCount<12) throw new Error(`Expected at least 12 synthetic products, received ${productCount}`);

  await page.getByRole('searchbox',{name:/buscar diseños/i}).fill('alien');
  const filtered=await products.count();
  if(filtered<1 || filtered>=productCount) throw new Error(`Search did not filter products: ${filtered}/${productCount}`);
  await page.getByRole('searchbox',{name:/buscar diseños/i}).fill('');

  await products.first().getByRole('button',{name:/ver diseño/i}).click();
  const dialog=page.getByRole('dialog',{name:/detalle de producto/i});
  await dialog.waitFor({state:'visible'});
  await dialog.getByRole('button',{name:'M',exact:true}).click();
  await dialog.getByRole('button',{name:/agregar a la bolsa/i}).click();

  const cartButton=page.getByRole('button',{name:/bolsa de compras/i});
  if(!((await cartButton.textContent())||'').includes('1')) throw new Error('Cart count did not update to 1');
  await cartButton.click();
  await page.getByRole('dialog',{name:/tu bolsa/i}).waitFor({state:'visible'});

  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:/mi cuenta/i}).click();
  await page.getByRole('dialog',{name:/cuenta de demostración/i}).waitFor({state:'visible'});

  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Ayuda',exact:true}).click();
  await page.getByRole('dialog',{name:/centro de ayuda/i}).waitFor({state:'visible'});

  if(errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
  console.log(JSON.stringify({status:'ok',productCount,filtered,title,errors}));
} finally {
  await browser.close();
}
