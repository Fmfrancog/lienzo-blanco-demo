import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import ts from 'typescript';
const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const fixture = JSON.parse(read('scripts/fixtures/catalog-integrity.json'));
assert.equal(crypto.createHash('sha256').update(read('src/data/drive-products.json')).digest('hex'), fixture.driveSha256);
const file = new URL('src/data/product-copy.json', root);
assert(fs.existsSync(file), 'Reviewed visual copy overlay must exist for all 197 IDs');
const copy = JSON.parse(fs.readFileSync(file));
const taxonomy = JSON.parse(read('src/data/product-taxonomy.json'));
assert.deepEqual(Object.keys(copy), taxonomy.map(p => p.id));
assert.equal(Object.keys(copy).length, 197);
assert.equal(new Set(Object.values(copy)).size, 197, 'Every description must be unique');
for (const [id, text] of Object.entries(copy)) {
  assert.equal(typeof text, 'string');
  assert(text.length >= 80 && text.length <= 160, `${id}: ${text.length} characters`);
  assert(!/catálogo fotográfico|agrupación técnica|algodón|calidad|existencias|oficial|licenciad/i.test(text), id);
}
const compiled = ts.transpile(read('src/data/store-content.ts'), { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true });
const loaded = { exports: {} };
new Function('require', 'exports', compiled)(p => JSON.parse(read('src/data/' + p.replace('./', ''))), loaded.exports);
const products = loaded.exports.storeContent.products;
const source = [fixture.legacy, ...JSON.parse(read('src/data/drive-products.json'))];
assert.equal(products.length, 197);
for (const [i, p] of products.entries()) {
  for (const key of ['id', 'name', 'price', 'compareAtPrice', 'sizes', 'images']) assert.deepEqual(p[key], source[i][key], `${p.id} ${key}`);
  assert.equal(p.description, copy[p.id]);
  assert.equal(p.story, '', 'Discard unsupported stories');
  assert.equal(p.collection, taxonomy[i].category);
  assert.deepEqual(p.tags, taxonomy[i].tags);
}
console.log('PASS: 197 unique visual descriptions; source, identity, commerce, gallery and taxonomy preserved');
