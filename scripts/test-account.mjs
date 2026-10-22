import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import c from '@sparticuz/chromium';
const browser = await chromium.launch({args:c.args.filter(a=>a!=='--single-process'), executablePath:await c.executablePath(),headless:true});
const base = process.env.BASE_URL || 'http://127.0.0.1:3044';
try {
  const page = await browser.newPage();
  await page.goto(base);
  await page.locator('[data-action="open-account"]').click();
  assert.equal(await page.locator('[data-action="simulate-login"]').count(),0,'Demo login must be removed');
  await page.getByRole('button',{name:'Continuar con Google',exact:true}).waitFor();
  let authorize;
  await page.route('https://zniawtkrdnbevyojewdi.supabase.co/auth/v1/authorize**',r=>{authorize=new URL(r.request().url());return r.fulfill({body:'External provider intercepted only in test'});});
  await page.getByRole('button',{name:'Continuar con Google',exact:true}).click();
  await page.waitForURL('**/auth/v1/authorize**');
  assert.equal(authorize.searchParams.get('provider'),'google');
  assert.equal(authorize.searchParams.get('redirect_to'),base+'/');
  assert.equal(authorize.searchParams.get('code_challenge_method'),'s256');
  assert.ok(authorize.searchParams.get('code_challenge'));
  console.log('PASS real Google OAuth PKCE redirect, no demo');
} finally { await browser.close(); }
