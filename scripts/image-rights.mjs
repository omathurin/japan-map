// Pure metadata/raster validation helpers. No network requests.
export function plainText(html){return String(html??'').replace(/<(div|span)\b[^>]*style=["'][^"']*display\s*:\s*none[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&(?:amp|quot|apos|lt|gt|nbsp);/g,s=>({'&amp;':'&','&quot;':'"','&apos;':"'",'&lt;':'<','&gt;':'>','&nbsp;':' '})[s]).replace(/\s+/g,' ').trim().slice(0,2500)}
export function licenceFor(info,sourcePage){
 const meta=info.extmetadata||{};
 const label=plainText(meta.LicenseShortName?.value),raw=plainText(meta.LicenseUrl?.value);
 if(/^public domain$/i.test(label)&&/^false$/i.test(plainText(meta.Copyrighted?.value)))return{license:'Domaine public (selon Commons)',licenseFamily:'PD',licenseUrl:sourcePage};
 if(/^CC0(?: 1\.0)?$/i.test(label))return{license:'CC0 1.0',licenseFamily:'CC0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/'};
 const match=label.match(/^CC BY(-SA)? (1\.0|2\.0|2\.5|3\.0|4\.0)$/i);
 if(!match)return null;
 let url;try{url=new URL(raw.replace(/^http:/,'https:'))}catch{return null}
 const expected=`/licenses/by${match[1]?'-sa':''}/${match[2]}/`;
 url.pathname=url.pathname.replace(/\/?$/,'/');
 if(url.hostname!=='creativecommons.org'||url.protocol!=='https:'||!url.pathname.startsWith(expected))return null;
 // Country-ported versions need their actual licence path; retain it instead of inventing a generic licence.
 return{license:label,licenseFamily:match[1]?'CC BY-SA':'CC BY',licenseUrl:url.href};
}
export function rasterType(bytes){
 if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return{extension:'jpg',mime:'image/jpeg'};
 if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return{extension:'png',mime:'image/png'};
 if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP')return{extension:'webp',mime:'image/webp'};
 return null;
}
