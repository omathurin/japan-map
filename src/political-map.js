import {politicalSnapshot,ryukyuStatus,territoryColor,prefectureNames,palette,circuits,regionNames,sources} from './politics.js';
export const project=(lon,lat)=>lat<30.5&&lon<133?[40+(lon-122)*19,535-(lat-24)*13]:[70+(lon-128)*30,505-(lat-30)*30];
export function geoPath(geometry){const polygons=geometry.type==='MultiPolygon'?geometry.coordinates:[geometry.coordinates];return polygons.map(poly=>poly.map(ring=>ring.map(([lon,lat],i)=>{const [x,y]=project(lon,lat);return `${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`}).join(' ')+'Z').join(' ')).join(' ')}
export function createPoliticalMap(provinces,prefectures){
 let lastKey='',selectedId=null,visible=true,currentYear=1831,features=[],snapshot;
 const island=prefectures.features.find(f=>Number(f.properties.id)===47);
 const ryukyu={...island,properties:{id:'ryukyu',name:'Ryūkyū',ja:'琉球',center:[127.68,26.21]}};
 document.querySelector('#geography').innerHTML=prefectures.features.map(f=>`<path d="${geoPath(f.geometry)}" fill="#c0cbb7" stroke="#edf0e6" stroke-width=".4"/>`).join('')+`<path d="M25 445H215V548H25Z" fill="#e8eee4" fill-opacity=".8" stroke="#a6b6a0" stroke-dasharray="4 4"/><text x="34" y="458" class="inset-label">RYŪKYŪ · ÉCHELLE DISTINCTE</text><text x="34" y="473" class="inset-label">Îles déplacées sur la carte</text>`;
 function renderContext(){
 const old=snapshot.kind!=='prefectures';
 const f=features.find(f=>String(f.properties.id)===String(selectedId));
 const p=f?.properties;
 const isRyukyu=p&&(p.id==='ryukyu'||(!old&&Number(p.id)===47));
 const label=p?(isRyukyu?'Okinawa · Ryūkyū':old?p.name:prefectureNames[Number(p.id)]):'Cliquez sur un territoire';
 const description=!p?'Explorez une province ou une préfecture pour identifier son nom et sa place dans ce cadre politique. Les losanges repèrent des sièges de pouvoir ; les points rouges ouvrent les récits.':isRyukyu?ryukyuStatus(currentYear):old?`${p.ja} · ${p.circuit==='Ezo'?(currentYear>=1869?'Hokkaidō depuis 1869 ; fond Ezo antérieur à la réforme.':'Ezo : territoires aïnous et emprise de Matsumae au sud. Le remplissage n’implique pas un contrôle uniforme de l’État japonais.'):'Province du circuit '+p.circuit+'. Les droits et domaines pouvaient se superposer à cette géographie.'}`:`${p.nam_ja} · Préfecture de ${label}. Contours contemporains simplifiés, utilisés comme repère géographique.`;
 document.querySelector('#political-heading').textContent=snapshot.title;
 document.querySelector('#political-system').textContent=snapshot.system;
 document.querySelector('#political-description').textContent=snapshot.text;
 document.querySelector('#territory-name').textContent=label;
 document.querySelector('#territory-description').textContent=description;
 document.querySelector('#territory-source').href=isRyukyu||!old?sources.modern:sources.old;
 document.querySelector('#political-reference').textContent=old?'Fond provincial : référence 1868 · limites simplifiées, non annuelles.':'Fond préfectoral : tracé contemporain simplifié.';
 document.querySelector('#political-legend').innerHTML=snapshot.kind==='circuits'?circuits.map((n,i)=>`<span><i style="background:${palette[i]}"></i>${n}</span>`).join(''):snapshot.kind==='prefectures'?regionNames.map((n,i)=>`<span><i style="background:${i===8?territoryColor(island,snapshot,currentYear):palette[i]}"></i>${n}</span>`).join(''):'<span>Une couleur par province voisine · les teintes ne représentent pas les possessions des clans.</span>';
 document.querySelector('#ryukyu-status').textContent=ryukyuStatus(currentYear);
 document.querySelector('#map-boundary-note').textContent=old?'Provinces : référence 1868':'Préfectures : tracé contemporain';
 document.querySelectorAll('[data-territory]').forEach(el=>el.classList.toggle('territory-selected',String(el.dataset.territory)===String(selectedId)));
 }
 function render(year){currentYear=year;snapshot=politicalSnapshot(year);const key=`${snapshot.start}-${ryukyuStatus(year)}`;
 if(lastKey!==key){selectedId=null;lastKey=key;features=snapshot.kind==='prefectures'?prefectures.features:[...provinces.features,ryukyu];
 document.querySelector('#territories').innerHTML=features.map(f=>{const p=f.properties,name=p.id==='ryukyu'?ryukyuStatus(year):snapshot.kind==='prefectures'?prefectureNames[Number(p.id)]:p.name;return `<path data-territory="${p.id}" role="button" tabindex="0" aria-label="${name}" d="${geoPath(f.geometry)}" fill="${territoryColor(f,snapshot,year)}"><title>${name}</title></path>`}).join('');
 document.querySelector('#power-centers').innerHTML=snapshot.centers.map((c,i)=>{const[x,y]=project(c.lon,c.lat);return `<g transform="translate(${x},${y})"><path class="power-diamond" d="M0 -6L6 0L0 6L-6 0Z"/><text x="${i%2?10:-10}" y="${i%2?17:-12}" text-anchor="${i%2?'start':'end'}">${c.name}</text><title>${c.kind} : ${c.name}</title></g>`}).join('');
 document.querySelector('#political-jump').value=String(snapshot.start);
 }
 renderContext();}
 function select(e){const p=e.target.closest('[data-territory]');if(!p||!visible)return;selectedId=p.dataset.territory;renderContext()}
 document.querySelector('#map').addEventListener('click',select);
 document.querySelector('#map').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-territory]')){e.preventDefault();select(e)}});
 document.querySelector('#toggle-politics').onclick=()=>{visible=!visible;document.querySelector('#territories').style.display=visible?'':'none';document.querySelector('#power-centers').style.display=visible?'':'none';document.querySelector('#toggle-politics').setAttribute('aria-pressed',visible);document.querySelector('#toggle-politics').textContent=visible?'Divisions politiques ✓':'Afficher les divisions'};
 return {render};
}
