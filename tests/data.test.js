import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stories,eras,lenses} from '../src/data.js';
import {politicalSnapshot,ryukyuStatus} from '../src/politics.js';

test('The historical collection covers every era and theme with valid, sourced narratives',()=>{
 assert.ok(stories.length>=100);
 assert.equal(new Set(stories.map(s=>s.id)).size,stories.length);
 for(let era=0;era<eras.length;era++)for(const [lens] of lenses.slice(1)){
  assert.ok(stories.some(s=>s.era===era&&s.lens===lens),`${eras[era].name}: missing ${lens}`);
 }
 for(const s of stories){
  assert.ok(s.title&&s.text.length>100,`Missing editorial content: ${s.title}`);
  assert.ok(s.lat>=24&&s.lat<=46&&s.lon>=122&&s.lon<=146,`Coordinates: ${s.title}`);
  assert.ok(new URL(s.source).protocol==='https:');
  // Sekigahara is explicitly included as background to the Edo settlement.
  assert.ok(s.id===10||(s.year>=eras[s.era].start&&s.year<=eras[s.era].end),`Date/era mismatch: ${s.title}`);
 }
});
test('Temporal map distinguishes provincial references, prefectural transition and modern divisions',()=>{
 assert.equal(politicalSnapshot(710).kind,'circuits');
 assert.match(politicalSnapshot(1336).title,/Deux cours/);
 assert.match(politicalSnapshot(1603).system,/pas les limites des han/);
 assert.match(politicalSnapshot(1871).text,/ne sont pas disponibles/);
 assert.equal(politicalSnapshot(1889).kind,'prefectures');
 assert.match(ryukyuStatus(1550),/^Royaume des Ryūkyū$/);
 assert.match(ryukyuStatus(1700),/Satsuma/);
 assert.match(ryukyuStatus(1960),/américaine/);
 assert.match(ryukyuStatus(1972),/japonaise/);
});
test('Cartographic assets contain valid historical and contemporary areas',async()=>{
 for(const [file,count] of [['provinces-1868.geojson',69],['prefectures.geojson',47]]){
  const data=JSON.parse(await readFile(new URL(`../public/data/${file}`,import.meta.url)));
  assert.equal(data.features.length,count);
  assert.equal(new Set(data.features.map(f=>f.properties.id)).size,count);
  for(const f of data.features){
   assert.ok(['Polygon','MultiPolygon'].includes(f.geometry.type));
   assert.ok(f.geometry.coordinates.length);
  }
 }
});


test('Every narrative has a titled Wikipedia reading reference and every era has expanded cultural coverage',()=>{
 assert.ok(stories.length>=145);
 for(let era=0;era<eras.length;era++)assert.ok(stories.filter(s=>s.era===era&&s.lens==='culture').length>=5,`Cultural coverage: ${eras[era].name}`);
 for(const s of stories){
  const ref=s.reference;assert.ok(ref,`No reference: ${s.title}`);
  assert.ok(ref.title.length>3,`Untitled reference: ${s.title}`);
  const url=new URL(ref.url);assert.equal(url.protocol,'https:');assert.equal(url.hostname,'en.wikipedia.org');
  assert.ok(url.pathname.startsWith('/wiki/')&&url.pathname.length>6);
  assert.equal(ref.publisher,'Wikipédia');assert.equal(ref.language,'en');
 }
});
