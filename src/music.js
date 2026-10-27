import {eras} from './data.js';
import {musicTracks} from './music-manifest.js';
import {escapeMarkup} from './illustrations.js';
export function trackForEra(era){const oldIndex=['Nara','Heian','Kamakura','Muromachi','Azuchi–Momoyama','Edo','Meiji','Taishō','Shōwa','Contemporain'].indexOf(eras[era]?.name);return oldIndex<0?undefined:musicTracks.find(track=>track.eras.includes(oldIndex))}
export function installMusic(root){
 const button=root.querySelector('#sound');
 const host=document.createElement('div');host.className='sound-controls';button.before(host);host.append(button);
 host.insertAdjacentHTML('beforeend',`<details class="music-info"><summary aria-label="Musique : titre, volume et crédits" title="Musique : titre, volume et crédits">i</summary><div class="music-panel"><div class="eyebrow">LE VOYAGE EN MUSIQUE</div><strong id="music-title"></strong><p id="music-status" role="status"></p><label class="music-volume" for="music-volume">Volume <input id="music-volume" type="range" min="0" max="100" value="25"></label><p id="music-recording"></p><p id="music-context"></p><p id="music-credit"></p><p id="music-modifications"></p><a id="music-reference" target="_blank" rel="noopener noreferrer">Découvrir cette tradition ↗</a></div></details>`);
 const audio=document.createElement('audio');audio.id='ambience-audio';audio.preload='none';audio.loop=true;audio.volume=.25;host.append(audio);
 const status=root.querySelector('#music-status');
 let current,loaded,enabled=false,revision=0,switchTimer;
 const showStatus=message=>{status.textContent=message};
 function reflect(){button.setAttribute('aria-pressed',String(Boolean(enabled&&current)));button.querySelector('span').textContent=enabled?'Couper l’ambiance':'Ambiance sonore'}
 function failed(){loaded=null;enabled=false;reflect();audio.pause();showStatus('Lecture indisponible. Cliquez sur « Ambiance sonore » pour réessayer.');}
 async function play(){
  if(!enabled||!current)return;
  const attempt=++revision;
  if(loaded!==current.id){audio.pause();audio.src=current.src;loaded=current.id;audio.load()}
  showStatus('Chargement de la musique…');
  try{await audio.play();if(attempt===revision&&enabled)showStatus('À l’écoute · lecture en boucle');}
  catch(error){if(attempt===revision&&enabled&&error.name!=='AbortError')failed()}
 }
 audio.addEventListener('error',()=>{if(enabled&&!switchTimer)failed()});
 button.addEventListener('click',()=>{
  enabled=!enabled;clearTimeout(switchTimer);switchTimer=null;reflect();
  if(enabled)play();else{revision++;audio.pause();showStatus('En pause · activez l’ambiance pour écouter');}
 });
 root.querySelector('#music-volume').addEventListener('input',event=>{audio.volume=Number(event.target.value)/100});
 const details=host.querySelector('details');
 root.addEventListener('pointerdown',event=>{if(!host.contains(event.target))details.open=false});
 root.addEventListener('keydown',event=>{if(event.key==='Escape'&&details.open){details.open=false;details.querySelector('summary').focus()}});
 return {setEra(era){
  const next=trackForEra(era);if(next===current)return;clearTimeout(switchTimer);switchTimer=null;revision++;audio.pause();current=next;button.disabled=!next;reflect();
  if(!next){root.querySelector('#music-title').textContent='Les sons des premières sociétés';showStatus('Aucune musique sélectionnée pour cette période.');root.querySelector('#music-recording').textContent='Les enregistrements disponibles ne documentent pas directement ces époques.';root.querySelector('#music-context').textContent='Le voyage continue en silence. L’ambiance choisie reprendra aux périodes documentées si vous l’aviez activée.';root.querySelector('#music-credit').textContent='';root.querySelector('#music-modifications').textContent='';root.querySelector('#music-reference').hidden=true;button.title='Aucun enregistrement sélectionné pour cette période';return;}root.querySelector('#music-reference').hidden=false;
  current=next;
  root.querySelector('#music-title').textContent=current.title;
  button.title=`${current.title} · ${current.recording}`;
  root.querySelector('#music-recording').textContent=`Enregistrement : ${current.recording}.`;
  root.querySelector('#music-context').textContent=current.context;
  root.querySelector('#music-credit').innerHTML=`${escapeMarkup(current.attribution)} · <a href="${escapeMarkup(current.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeMarkup(current.license)}</a> · <a href="${escapeMarkup(current.sourcePage)}" target="_blank" rel="noopener noreferrer">Wikimedia Commons ↗</a>`;
  root.querySelector('#music-modifications').textContent=current.modifications;
  root.querySelector('#music-reference').href=current.reference;
  clearTimeout(switchTimer);switchTimer=null;
  if(enabled){revision++;audio.pause();showStatus('Changement d’époque…');switchTimer=setTimeout(()=>{switchTimer=null;play()},180)}
  else showStatus('En pause · activez l’ambiance pour écouter');
 }};
}
