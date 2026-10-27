import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=p=>readFile(resolve(root,p),'utf8');
const modules=['more-stories','data','politics','political-map','main'];
let code=(await Promise.all(modules.map(m=>read(`src/${m}.js`)))).map(s=>s.replace(/^import .*?;\n/gm,'').replace(/^export \{[^}]+\};?\s*$/gm,'').replace(/\bexport (const|function)\b/g,'$1')).join('\n');
const provinces=await read('public/data/provinces-1868.geojson');
const prefectures=await read('public/data/prefectures.geojson');
code=code.replace(/^const \[provinces,prefectures\]=.*$/m,`const provinces=${provinces};\nconst prefectures=${prefectures};`);
if(code.includes('await fetch')||code.includes('await Promise.all'))throw new Error('Unexpected runtime network dependency in standalone bundle');
let fonts='';
for(const [family,weight] of [['dm-sans',400],['dm-sans',500],['dm-sans',600],['libre-caslon-display',400]]){
 let css=await read(`node_modules/@fontsource/${family}/${weight}.css`);
 const urls=[...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1].replace(/["']/g,'')))];
 for(const url of urls){const bytes=await readFile(resolve(root,`node_modules/@fontsource/${family}`,url));const mime=url.endsWith('woff2')?'font/woff2':'font/woff';css=css.replaceAll(url,`data:${mime};base64,${bytes.toString('base64')}`)}
 fonts+=css;
}
const html=`<!doctype html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tabi — Le Japon à travers le temps</title><style>${fonts}\n${await read('src/style.css')}</style></head><body><div id="app"></div><script type="module">${code.replaceAll('</script','<\\/script')}</script></body></html>`;
await writeFile(resolve(root,'Tabi.html'),html);
console.log(`Standalone Tabi.html generated (${Math.round(Buffer.byteLength(html)/1024)} KiB), including local map data and fonts.`);
