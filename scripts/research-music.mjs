// Curated Commons recordings: verify source rights, archive metadata, then transcode locally.
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {EnvHttpProxyAgent,fetch} from 'undici';
import {plainText,licenceFor} from './image-rights.mjs';
const root=resolve(import.meta.dirname,'..');
const selections=JSON.parse(await readFile(resolve(root,'scripts/music-selections.json'),'utf8'));
const dispatcher=new EnvHttpProxyAgent();
const headers={'User-Agent':'TabiJapanHistoryAtlas/0.3 (https://github.com/omathurin/japan-map; music attribution research)','Accept':'application/json'};
const temp=await mkdtemp('/tmp/tabi-music-import-');
try{
 const url=new URL('https://commons.wikimedia.org/w/api.php');
 for(const[k,v]of Object.entries({action:'query',prop:'imageinfo',iiprop:'url|extmetadata|mime|size|timestamp|sha1',titles:selections.map(s=>'File:'+s.file).join('|'),format:'json',formatversion:2}))url.searchParams.set(k,v);
 const response=await fetch(url,{dispatcher,headers,signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw new Error(`Commons metadata HTTP ${response.status}`);
 const data=await response.json();if(!data.query?.pages)throw new Error('Missing Commons metadata');
 const tracks=[];
 await mkdir(resolve(root,'public/audio'),{recursive:true});
 for(const selection of selections){
  const page=data.query.pages.find(p=>p.title==='File:'+selection.file);
  const info=page?.imageinfo?.[0];if(!info)throw new Error(`Missing source: ${selection.file}`);
  const sourcePage=info.descriptionurl;
  const rights=licenceFor(info,sourcePage);if(!rights)throw new Error(`Unapproved licence: ${selection.file}`);
  const artist=plainText(info.extmetadata?.Artist?.value);if(!artist)throw new Error('Missing author');
  const remote=new URL(info.url);remote.search='';
  if(remote.protocol!=='https:'||remote.hostname!=='upload.wikimedia.org'||info.size>15000000)throw new Error('Unapproved media download');
  const media=await fetch(remote,{dispatcher,headers:{'User-Agent':headers['User-Agent'],'Accept':'audio/*,video/webm'},signal:AbortSignal.timeout(45000)});
  if(!media.ok)throw new Error(`Media HTTP ${media.status}`);
  const chunks=[];let size=0;for await(const chunk of media.body){size+=chunk.length;if(size>15000000)throw new Error('Media too large');chunks.push(chunk)}
  const bytes=Buffer.concat(chunks);
  if(createHash('sha1').update(bytes).digest('hex')!==BigInt('0x'+info.sha1).toString(16).padStart(40,'0'))throw new Error('Source SHA1 mismatch');
  const original=resolve(temp,selection.id+(info.mime==='video/webm'?'.webm':'.ogg'));
  await writeFile(original,bytes);
  const src=`./audio/${selection.id}.mp3`,destination=resolve(root,'public',src);
  execFileSync('ffmpeg',['-y','-v','error','-i',original,'-vn',...(selection.gainDb?['-af',`volume=${selection.gainDb}dB`]:[]),'-map_metadata','-1','-codec:a','libmp3lame','-b:a','96k',destination]);
  const converted=await readFile(destination);
  const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','json',destination],{encoding:'utf8'}));
  tracks.push({...selection,src,mime:'audio/mpeg',bytes:converted.length,sha256:createHash('sha256').update(converted).digest('hex'),duration:Number(probe.format.duration),artist,attribution:plainText(info.extmetadata?.Attribution?.value)||artist,...rights,sourcePage,originalUrl:remote.href,sourceDate:plainText(info.extmetadata?.DateTimeOriginal?.value),sourceFileTimestamp:info.timestamp,sourceFileSha1:info.sha1,credit:plainText(info.extmetadata?.Credit?.value),copyright:plainText(info.extmetadata?.Copyright?.value),restrictions:plainText(info.extmetadata?.Restrictions?.value),modifications:(selection.gainDb?`Volume relevé de ${selection.gainDb} dB. `:'')+(info.mime==='video/webm'?'Piste sonore extraite de la vidéo et transcodée en MP3 à 96 kbit/s ; aucune coupe ni ajout musical.':'Transcodage en MP3 à 96 kbit/s ; aucune coupe ni ajout musical.'),verifiedAt:new Date().toISOString()});
  console.log(`${selection.id}: ${Math.round(converted.length/1024)} KiB, ${rights.license}`);
 }
 await writeFile(resolve(root,'src/music-manifest.js'),'// Commons source rights verified by scripts/research-music.mjs.\nexport const musicTracks = '+JSON.stringify(tracks,null,2)+';\n');
 await writeFile(resolve(root,'public/audio/research.json'),JSON.stringify({verifiedAt:new Date().toISOString(),method:'Curated Commons media; source rights and SHA1 checked; local MP3 audio-only transcodes.',sources:data,tracks},null,2)+'\n');
 const credits=['# Musiques : sources et licences','','Les fichiers sonores conservent leurs licences individuelles, indépendamment du code de Tabi. La lecture en boucle et le volume sont contrôlés dans le navigateur. Les périodes correspondent à des traditions ou à une œuvre ; la date de l’enregistrement est distincte de celle du curseur.',''];
 for(const t of tracks)credits.push(`## ${t.title}`,'',`- Fichier : [${t.id}.mp3](${t.id}.mp3)`,`- Auteur / crédit : ${t.artist}. Attribution : ${t.attribution}.`,`- Licence : [${t.license}](${t.licenseUrl}).`,`- Source : [${t.file}](${t.sourcePage}).`,`- Enregistrement : ${t.recording}.`,`- ${t.context}`,`- Contexte : ${t.reference}`,`- Modifications : ${t.modifications}`,`- Métadonnées vérifiées le ${t.verifiedAt.slice(0,10)}. SHA-256 : ${t.sha256}.`,'');
 await writeFile(resolve(root,'public/audio/CREDITS.md'),credits.join('\n'));
}finally{dispatcher.destroy();await rm(temp,{recursive:true,force:true})}
