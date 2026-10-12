import assert from 'node:assert/strict';
import fs from 'node:fs';
const slugs=['sobre-nosotros','contacto','aviso-de-privacidad','politica-de-devoluciones','terminos-y-condiciones','politica-de-cookies','envios'];
for(const slug of slugs){const path=`out/${slug}/index.html`;assert.ok(fs.existsSync(path),`Falta página ${slug}`);const html=fs.readFileSync(path,'utf8');assert.match(html,/<h1/);assert.ok(html.includes('atencion@plur.com.mx'));for(const other of slugs)assert.ok(html.includes(`href="/${other}/"`),`${slug} enlace ${other}`);assert.ok(!html.includes('el envío se considera entregado'));}
const home=fs.readFileSync('out/index.html','utf8');for(const slug of slugs)assert.ok(home.includes(`href="/${slug}/"`),`Inicio enlace ${slug}`);
assert.match(fs.readFileSync('out/sobre-nosotros/index.html','utf8'),/Misión/);
assert.match(fs.readFileSync('out/sobre-nosotros/index.html','utf8'),/Visión/);
assert.match(fs.readFileSync('out/envios/index.html','utf8'),/Entrega de 2 a 5 días hábiles a partir de tu compra/);
assert.match(fs.readFileSync('out/contacto/index.html','utf8'),/https:\/\/wa.me\/525574615455/);
console.log(JSON.stringify({pages:slugs.length,slugs,navigation:'passed',missionVision:'passed',contacts:'passed'}));
