import assert from 'node:assert/strict';
import fs from 'node:fs';
const content = fs.readFileSync(new URL('../src/data/store-content.ts', import.meta.url),'utf8');
assert.ok(content.includes('CATÁLOGO FOTOGRÁFICO Y DISEÑOS DE MUESTRA'),'Identify the mixed real/demo catalog accurately');
assert.ok(!content.includes('Todo el contenido, inventario y proceso de compra es sintético.'),'Do not describe imported photography as synthetic');
assert.ok(!content.includes('algodón sintético de muestra'),'Do not attribute an unverified material globally');
assert.ok(!content.includes('Productos, disponibilidad, precios y pedidos son totalmente sintéticos.'),'Do not deny real imported products');
console.log('Catalog provenance copy: passed');
