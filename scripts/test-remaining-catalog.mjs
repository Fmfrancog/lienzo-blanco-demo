import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getCoverImageIndex} from '../src/lib/product-cover.ts';
const expected=JSON.parse(fs.readFileSync(new URL('../docs/catalog-remaining-manifest.json',import.meta.url)));
const products=JSON.parse(fs.readFileSync(new URL('../src/data/drive-products.json',import.meta.url)));
assert.equal(expected.length,24);
assert.equal(products.length,196);
assert.equal(new Set(products.map(p=>p.id)).size,products.length);
for(const source of expected){
 const p=products.find(p=>p.id===source.id);assert.ok(p,source.name);
 assert.equal(p.name,source.name);assert.deepEqual(p.images,source.images);
 assert.equal(p.price,199);assert.equal(p.compareAtPrice,299);assert.deepEqual(p.sizes,['CH','M','G','EG']);
 const sequences=p.images.map(url=>Number(url.match(/-(\d+)\.webp$/)[1]));
 assert.deepEqual(sequences,source.sequences);
 assert.equal(sequences[getCoverImageIndex(p.images)],sequences.includes(5)?5:4);
 for(const image of p.images)assert.ok(fs.existsSync(new URL('../public'+image,import.meta.url)),image);
}
console.log(JSON.stringify({status:'ok',products:expected.length,assets:expected.reduce((n,p)=>n+p.images.length,0)}));
