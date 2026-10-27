import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stories,eras,lenses} from '../src/data.js';
import {politicalSnapshot,ryukyuStatus} from '../src/politics.js';

test('The historical collection covers every era and theme with valid, sourced narratives',()=>{
 assert.ok(stories.length>=100);
 assert.equal(new Set(stories.map(s=>s.id)).size,stories.length);
 for(let era=0;era<eras.length;era++)for(const [lens] of lenses.slice(1)){
  if((era===0&&['religion','guerres'].includes(lens))||(era===1&&lens==='guerres'))continue;
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

test('Illustrations require complete, safe attribution and render untrusted metadata as text',async()=>{
 const {validIllustration,illustrationMarkup}=await import('../src/illustrations.js');
 const media={title:'Document de test',artist:'Auteur de test',license:'CC BY-SA 4.0',licenseFamily:'CC BY-SA',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',sourcePage:'https://commons.wikimedia.org/wiki/File:Test.png',src:'./images/test-asset.png',mime:'image/png',sha256:'a'.repeat(64),verifiedAt:'2026-10-27T00:00:00Z'};
 assert.ok(validIllustration(media));
 for(const change of [{artist:''},{license:''},{licenseFamily:'fair use'},{licenseUrl:'https://creativecommons.org/licenses/by/4.0/'},{sourcePage:'javascript:alert(1)'},{src:'https://unverified.example/test.png'},{src:'./images/../../private.png'},{sha256:'fake'}])assert.equal(validIllustration({...media,...change}),false);
 assert.equal(illustrationMarkup(stories[0],{media:null}),'');
 const markup=illustrationMarkup(stories[0],{media:{...media,artist:'Auteur <script>alert(1)</script>',description:'<img src=x onerror="alert(1)">',credit:'Institution propriétaire',copyright:'Notice de droits de test'}});
 assert.ok(!markup.includes('<script>'));assert.ok(!markup.includes('<img src=x'));
 assert.match(markup,/Auteur &lt;script&gt;/);assert.match(markup,/CC BY-SA 4.0/);assert.match(markup,/Institution propriétaire/);assert.match(markup,/Notice de droits de test/);
});
test('Rights selection rejects non-free, ambiguous and incompatible licences',async()=>{
 const {licenceFor,rasterType,plainText}=await import('../scripts/image-rights.mjs');
 const info=(label,url,copyrighted='True')=>({extmetadata:{LicenseShortName:{value:label},LicenseUrl:{value:url},Copyrighted:{value:copyrighted}}});
 const source='https://commons.wikimedia.org/wiki/File:Test.png';
 assert.equal(licenceFor(info('Fair use',''),source),null);
 assert.equal(licenceFor(info('CC BY-NC 4.0','https://creativecommons.org/licenses/by-nc/4.0/'),source),null);
 assert.equal(licenceFor(info('CC BY-SA 4.0','https://unverified.example/license'),source),null);
 assert.equal(licenceFor(info('Public domain','','True'),source),null);
 assert.equal(licenceFor(info('Public domain','','False'),source).licenseFamily,'PD');
 assert.equal(licenceFor(info('CC0',''),source).licenseFamily,'CC0');
 assert.equal(licenceFor(info('CC BY-SA 3.0','http://creativecommons.org/licenses/by-sa/3.0/de/'),source).licenseUrl,'https://creativecommons.org/licenses/by-sa/3.0/de/');
 assert.equal(plainText('<a href="https://example.org">Auteur &amp; Musée</a>'),'Auteur & Musée');
 assert.equal(rasterType(Buffer.from('<html>not an image</html>')),null);
 assert.equal(rasterType(Buffer.from([137,80,78,71,13,10,26,10])).mime,'image/png');
});
test('All narratives have attributed local illustrations with verified checksums',async()=>{
 const {storyImages}=await import('../src/image-manifest.js');const {validIllustration}=await import('../src/illustrations.js');const {createHash}=await import('node:crypto');
 assert.equal(Object.keys(storyImages).length,stories.length);
 for(const[id,image]of Object.entries(storyImages)){
  assert.ok(stories.some(s=>s.id===Number(id)));assert.ok(validIllustration(image));
  const bytes=await readFile(new URL('../public/'+image.src,import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),image.sha256);
 }
 const report=JSON.parse(await readFile(new URL('../public/data/image-research.json',import.meta.url)));
 assert.equal(report.records.length,stories.length);
 assert.ok(report.records.every(r=>r.status&&stories.some(s=>s.id===r.storyId)));
 assert.equal(report.summary.illustrated,Object.keys(storyImages).length);
 assert.ok(report.records.every(r=>r.status==='included'));
 const credits=await readFile(new URL('../public/images/CREDITS.md',import.meta.url),'utf8');
 for(const image of Object.values(storyImages))assert.ok(credits.includes(image.sha256.slice(0,20)));
});

test('Every era has a licensed local music recording with audited source and intact bytes',async()=>{
 const {musicTracks}=await import('../src/music-manifest.js');
 const {trackForEra}=await import('../src/music.js');
 const {createHash}=await import('node:crypto');
 assert.equal(musicTracks.length,5);
 for(let era=0;era<eras.length;era++)if(eras[era].start>=710)assert.ok(trackForEra(era),`Music missing: ${eras[era].name}`);else assert.equal(trackForEra(era),undefined);
 const assigned=musicTracks.flatMap(t=>t.eras);assert.equal(new Set(assigned).size,assigned.length);
 for(const track of musicTracks){
  assert.match(track.src,/^\.\/audio\/[a-z-]+\.mp3$/);
  const bytes=await readFile(new URL('../public/'+track.src,import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),track.sha256);
  assert.ok(track.artist&&track.attribution&&track.recording&&track.context&&track.modifications);
  assert.ok(track.duration>15&&track.duration<400);
  assert.equal(new URL(track.sourcePage).hostname,'commons.wikimedia.org');
  assert.ok(['CC BY','CC BY-SA','PD'].includes(track.licenseFamily));
  if(track.licenseFamily!=='PD')assert.equal(new URL(track.licenseUrl).hostname,'creativecommons.org');
 }
});

test('Deep chronology preserves old story identities, BC dates and the absence of invented borders',async()=>{
 const {formatYear,yearPosition,positionYear,timelineMax,validYear}=await import('../src/timeline.js');
 assert.equal(stories.length,200);assert.equal(eras.length,15);
 assert.equal(stories.filter(s=>s.year<710).length,55);
 assert.equal(stories.find(s=>s.id===5).title,'Les images du monde flottant');
 assert.equal(eras[stories.find(s=>s.id===5).era].name,'Edo');
 assert.equal(formatYear(-500),'500 av. J.-C.');assert.equal(formatYear(57),'57');
 assert.equal(validYear(0),1);assert.equal(positionYear(timelineMax),2025);
 let previous=-Infinity;
 for(let p=0;p<=timelineMax;p++){
  const year=positionYear(p);assert.ok(year>=previous);assert.notEqual(year,0);previous=year;
 }
 for(const era of eras){assert.equal(positionYear(yearPosition(era.start)),era.start)}
 for(const year of [-38000,-14000,-900,250,592,645,672,694,701,709])assert.equal(politicalSnapshot(year).kind,'archaeology');
 assert.equal(politicalSnapshot(710).kind,'circuits');
});
