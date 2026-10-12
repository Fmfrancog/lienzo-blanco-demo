import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const path = 'src/lib/payment-links.ts';
assert.ok(fs.existsSync(path), 'Falta la política de Links por cantidad');
const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
new Function('exports', source)(exports);
const expected = [[1,398,'2xwcTmy'],[2,597,'2SpociY'],[3,597,'1tGZvcR'],[4,796,'2BeYgHo'],[5,995,'26aMKHf']];
for (const [quantity,total,slug] of expected) {
 const result = exports.paymentQuote(quantity);
 assert.equal(result.total,total);
 assert.equal(result.shipping,quantity < 3 ? 199 : 0);
 assert.equal(result.href,`https://mpago.la/${slug}`);
}
for (const quantity of [0,-1,6,100,1.5,NaN,Infinity]) assert.equal(exports.paymentQuote(quantity),null);
const catalog = JSON.parse(fs.readFileSync('src/data/drive-products.json','utf8'));
assert.ok(catalog.every(product => product.price === 199), 'Links requieren precio unitario de $199');
assert.match(fs.readFileSync('src/data/store-content.ts','utf8'), /id: "gato-cosmico"[^\n]*price: 199/);
console.log('PASS: cantidades 1–5, totales, URLs exactas y cantidades inválidas/>5; precios del catálogo $199');
