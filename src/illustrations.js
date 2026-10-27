import {storyImages} from './image-manifest.js';
export function escapeMarkup(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
export function validIllustration(image){
 if(!image||!image.title?.trim()||!image.artist?.trim()||!image.license||!image.licenseUrl||!image.sourcePage||!image.src||!/^[a-f0-9]{64}$/.test(image.sha256||'')||!Number.isFinite(Date.parse(image.verifiedAt)))return false;
 try{
  const source=new URL(image.sourcePage),license=new URL(image.licenseUrl);
  if(source.protocol!=='https:'||source.hostname!=='commons.wikimedia.org'||!source.pathname.startsWith('/wiki/File:')||source.username||source.password)return false;
  if(license.protocol!=='https:'||!['creativecommons.org','commons.wikimedia.org'].includes(license.hostname)||license.username||license.password)return false;
  if(!['PD','CC0','CC BY','CC BY-SA'].includes(image.licenseFamily))return false;
  if(image.licenseFamily==='PD'&&image.licenseUrl!==image.sourcePage)return false;
  if(image.licenseFamily==='CC0'&&license.href!=='https://creativecommons.org/publicdomain/zero/1.0/')return false;
  if(image.licenseFamily==='CC BY'&&(license.hostname!=='creativecommons.org'||!/^\/licenses\/by\/(1\.0|2\.0|2\.5|3\.0|4\.0)\//.test(license.pathname)))return false;
  if(image.licenseFamily==='CC BY-SA'&&(license.hostname!=='creativecommons.org'||!/^\/licenses\/by-sa\/(1\.0|2\.0|2\.5|3\.0|4\.0)\//.test(license.pathname)))return false;
  if(!['image/jpeg','image/png','image/webp'].includes(image.mime))return false;
  return /^\.\/images\/[a-z0-9-]+\.(jpg|png|webp)$/.test(image.src)||/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image.src);
 }catch{return false}
}
export function illustrationMarkup(story,{thumbnail=false,media=storyImages[story?.id]}={}){
 if(!story||!validIllustration(media))return '';
 const e=escapeMarkup;
 const visual=`<img class="documentary-image" src="${e(media.src)}" alt="${e(media.alt||media.title)}" ${thumbnail?'loading="lazy"':'loading="eager"'} decoding="async"><p class="image-failure" hidden>Image indisponible. Vous pouvez consulter son document source.</p>`;
 const body=thumbnail?`<button class="image-preview" data-open-story="${story.id}" aria-label="Découvrir : ${e(story.title)}">${visual}</button>`:`<a class="image-preview" href="${e(media.sourcePage)}" target="_blank" rel="noopener noreferrer" aria-label="Voir le document source : ${e(media.title)}">${visual}</a>`;
 const panelId=`image-credits-${thumbnail?'catalog':'feature'}-${story.id}`;
 return `<figure class="documentary-figure ${thumbnail?'thumbnail-figure':'feature-figure'}">${body}<button class="image-info-toggle" type="button" aria-label="Afficher les crédits de cette image" aria-expanded="false" aria-controls="${panelId}">i</button><figcaption class="image-credit-panel" id="${panelId}" hidden><button class="image-info-close" type="button" aria-label="Fermer les crédits">×</button><span class="image-title">${e(media.title)}</span><span class="image-attribution">Crédit : ${e(media.artist)} · <a href="${e(media.licenseUrl)}" target="_blank" rel="noopener noreferrer">${e(media.license)}</a></span><a class="image-source" href="${e(media.sourcePage)}" target="_blank" rel="noopener noreferrer">Wikimedia Commons · fiche et droits ↗</a><details class="image-details"><summary>Contexte et réutilisation</summary><p>Titre original : ${e(media.title)}</p><p>${e(media.context||'Document associé au sujet ; il ne représente pas nécessairement l’événement à la date du curseur.')}</p>${media.description?`<p class="original-image-description">Notice d’origine : ${e(media.description)}</p>`:''}${media.date?`<p>Date du document : ${e(media.date)}</p>`:''}${media.credit?`<p>Crédit complémentaire : ${e(media.credit)}</p>`:''}${media.copyright?`<p>Notice de droits : ${e(media.copyright)}</p>`:''}${media.usageTerms?`<p>Conditions indiquées : ${e(media.usageTerms)}</p>`:''}${media.restrictions?`<p>Restrictions signalées : ${e(media.restrictions)}</p>`:''}<p>${e(media.modifications||'Miniature fournie par Commons, affichée sans recadrage.')}</p><p>Licence relevée sur la fiche source le ${e(media.verifiedAt.slice(0,10))}.</p></details></figcaption></figure>`;
}

export function installIllustrationInteractions(root){
 const figureFor=target=>target?.closest?.('.documentary-figure');
 const setOpen=(figure,open)=>{
  const panel=figure.querySelector('.image-credit-panel');
  panel.hidden=!open;
  figure.querySelector('.image-info-toggle').setAttribute('aria-expanded',String(open));
  if(!open)delete figure.dataset.creditPinned;
 };
 const closeOthers=except=>root.querySelectorAll('.documentary-figure').forEach(f=>{if(f!==except)setOpen(f,false)});
 const open=figure=>{closeOthers(figure);setOpen(figure,true)};
 const dismiss=figure=>{figure.querySelector('.image-info-toggle').focus({preventScroll:true});setOpen(figure,false)};
 root.addEventListener('pointerover',event=>{
  if(event.pointerType!=='mouse')return;
  const figure=figureFor(event.target);
  if(!figure)return;
  if(figure.classList.contains('thumbnail-figure')){
   const trigger=event.target.closest('.image-info-toggle,.image-credit-panel');
   if(trigger&&!trigger.contains(event.relatedTarget))open(figure);
  }else if(!figure.contains(event.relatedTarget))open(figure);
 });
 root.addEventListener('pointerout',event=>{
  const figure=figureFor(event.target);
  if(figure&&!figure.contains(event.relatedTarget)&&!figure.dataset.creditPinned&&!figure.contains(document.activeElement))setOpen(figure,false);
 });
 root.addEventListener('focusin',event=>{
  const figure=figureFor(event.target);
  if(figure&&(event.target.matches('.image-info-toggle')||event.target.closest('.image-credit-panel')))open(figure);
 });
 root.addEventListener('focusout',event=>{
  const figure=figureFor(event.target);
  if(figure&&!figure.contains(event.relatedTarget)&&!figure.dataset.creditPinned)setOpen(figure,false);
 });
 root.addEventListener('click',event=>{
  const figure=figureFor(event.target);
  if(event.target.closest('.image-info-toggle')){
   if(figure.dataset.creditPinned){dismiss(figure)}else{open(figure);figure.dataset.creditPinned='true'}
  }else if(event.target.closest('.image-info-close'))dismiss(figure);
 });
 document.addEventListener('pointerdown',event=>{if(!figureFor(event.target))closeOthers(null)});
 document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  const figure=[...root.querySelectorAll('.documentary-figure')].find(f=>!f.querySelector('.image-credit-panel').hidden);
  if(figure){dismiss(figure);event.preventDefault();event.stopPropagation()}
 });
}
