import {eras} from './data.js';
// Equal space per period keeps both deep prehistory and recent centuries usable.
export const timelineStep=1000;
export const timelineMax=eras.length*timelineStep;
export function formatYear(year){return year<0?`${Math.abs(year).toLocaleString('fr-FR')} av. J.-C.`:String(year)}
export function yearPosition(year){const index=eras.findIndex(e=>year>=e.start&&year<=e.end);if(index<0)return year<eras[0].start?0:timelineMax;const era=eras[index];return Math.round((index+(year-era.start)/(era.end-era.start+1))*timelineStep)}
export function positionYear(position){const index=Math.min(eras.length-1,Math.max(0,Math.floor(position/timelineStep)));const era=eras[index];const fraction=Math.max(0,Math.min(1,position/timelineStep-index));const year=Math.min(era.end,Math.round(era.start+fraction*(era.end-era.start+1)));return year===0?1:year}
export function validYear(value){if(String(value).trim()==='')return null;const n=Math.round(Number(value));return Number.isFinite(n)?Math.max(eras[0].start,Math.min(eras.at(-1).end,n===0?1:n)):null}
