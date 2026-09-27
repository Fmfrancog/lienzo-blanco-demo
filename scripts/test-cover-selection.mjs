import assert from 'node:assert/strict';
import { getCoverImageIndex } from '../src/lib/product-cover.ts';
assert.equal(getCoverImageIndex(['/x-01.webp','/x-04.webp','/x-05.webp']),2);
assert.equal(getCoverImageIndex(['/x-01.webp','/x-04.webp']),1);
assert.equal(getCoverImageIndex(['/05.webp','/04.webp']),0);
assert.equal(getCoverImageIndex(['/x-01.webp']),0);
assert.equal(getCoverImageIndex([]),0);
console.log('PASS: cover 05 preferred, fallback 04, unnumbered preserved');
