import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const eras=[710,794,1185,1333,1573,1603,1868,1912,1926,1989];
const lenses=['politique','guerres','religion','culture','arts','cuisine'];
async function goToYear(page,year){await page.locator('#time').evaluate((el,year)=>{el.value=year;el.dispatchEvent(new Event('input',{bubbles:true}))},year)}

test('All sixty era/theme combinations show narratives and clickable hotspots',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('.marker')).toHaveCount(19);
 for(const year of eras){
  await goToYear(page,year);
  for(const lens of lenses){
   await page.locator(`[data-lens="${lens}"]`).click();
   expect(await page.locator('.marker').count(),`${year} ${lens}`).toBeGreaterThan(0);
   await expect(page.locator('#story h2')).not.toBeEmpty();
   await expect(page.locator('#story a.read-more')).toHaveAttribute('href',/^https:\/\/en\.wikipedia\.org\/wiki\//);
   await expect(page.locator('#story .reference-meta')).toContainText('article en anglais');
   expect(await page.locator('.catalog-reference').count()).toBe(await page.locator('.catalog-story').count());
  }
 }
 expect(errors).toEqual([]);
});
test('The map changes political contexts, names territories and distinguishes occupation',async({page})=>{
 await page.goto('/');
 await expect(page.locator('[data-territory]')).toHaveCount(70);
 await page.locator('[data-territory="34"]').focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('#territory-name')).toHaveText('Yamato');
 await expect(page.locator('#political-reference')).toContainText('1868');
 // A genuine pointer click, away from story markers, must select a territory too.
 const pos=await page.locator('#map').evaluate(el=>{const p=new DOMPoint(490,115).matrixTransform(el.getScreenCTM());return{x:p.x,y:p.y}});
 await page.mouse.click(pos.x,pos.y);
 await expect(page.locator('#territory-name')).toHaveText('Ezo');
 await page.locator('#political-jump').selectOption('1336');
 await expect(page.locator('#political-heading')).toContainText('Deux cours');
 await page.locator('#political-jump').selectOption('1871');
 await expect(page.locator('#political-description')).toContainText('ne sont pas disponibles');
 await page.locator('#political-jump').selectOption('1945');
 await expect(page.locator('[data-territory]')).toHaveCount(47);
 await page.locator('[data-territory="47"]').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#territory-description')).toContainText('américaine');
 await page.locator('#political-jump').selectOption('1972');
 await page.locator('[data-territory="47"]').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#territory-description')).toContainText('japonaise');
 await page.locator('#toggle-politics').click();
 await expect(page.locator('#territories')).toBeHidden();
 await page.locator('#toggle-politics').click();
 await expect(page.locator('#territories')).toBeVisible();
});
test('Search crosses periods, opens a narrative, and timeline chooses a new dated default',async({page})=>{
 await page.goto('/');
 await page.locator('#search-stories').fill('Hiroshima');
 expect(await page.locator('.catalog-story').count()).toBeGreaterThanOrEqual(2);
 await page.locator('.catalog-story').filter({hasText:'mémoire pour horizon'}).locator('.catalog-open').click();
 await expect(page.locator('#year')).toHaveText('1945');
 await expect(page.locator('#story h2')).toContainText('Hiroshima');
 await page.locator('#search-stories').fill('zzzintrouvable');
 await expect(page.locator('.no-results')).toBeVisible();
 await page.locator('#search-stories').fill('');
 await page.locator('[data-lens="all"]').click();
 await goToYear(page,1603);
 await expect(page.locator('#story .story-meta')).toContainText('1603');
 await goToYear(page,1831);
 await expect(page.locator('#story h2')).toContainText('monde flottant');
 await page.locator('#play').click();await expect(page.locator('#year')).not.toHaveText('1831');await page.locator('#play').click();
 await page.locator('#zoom-in').click();await expect(page.locator('#territories')).toHaveAttribute('transform',/scale\(1.25\)/);
 await page.locator('#reset-map').click();await expect(page.locator('#territories')).toHaveAttribute('transform',/scale\(1\)/);
 await page.locator('#about').click();await expect(page.locator('dialog')).toBeVisible();await page.locator('.close').click();
 await page.locator('#sound').click();await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','true');await page.locator('#sound').click();
 await page.locator('.brand').click();await expect(page.locator('#year')).toHaveText('1831');await expect(page.locator('#story h2')).toContainText('monde flottant');
});
test('Map, cards and controls fit mobile and tablet viewports',async({page})=>{
 await page.goto('/');
 for(const width of [390,768]){
  await page.setViewportSize({width,height:844});
  const sizes=await page.evaluate(()=>[...document.querySelectorAll('.explorer,.map-panel,.story-panel,.political-context,.territory-card,.catalog')].map(el=>{const r=el.getBoundingClientRect();return{left:r.left,right:r.right}}));
  for(const s of sizes){expect(s.left).toBeGreaterThanOrEqual(0);expect(s.right).toBeLessThanOrEqual(width)}
 }
});
test('Standalone HTML works with all external requests blocked',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.abort());
 await page.setContent(await readFile(new URL('../Tabi.html',import.meta.url),'utf8'));
 await expect(page.locator('[data-territory]')).toHaveCount(70);
 await expect(page.locator('#story .documentary-image')).toHaveAttribute('src',/^data:image\//);
 await page.locator('#story .documentary-image').evaluate(img=>img.decode());
 await page.locator('[data-lens="cuisine"]').click();
 await expect(page.locator('#story h2')).toContainText('sushi');
 await page.locator('#political-jump').selectOption('1972');
 await expect(page.locator('[data-territory]')).toHaveCount(47);
 expect(errors).toEqual([]);
});


test('A new cultural story opens its topical reference and original sources remain available',async({page})=>{
 await page.goto('/');
 await page.locator('#search-stories').fill('Takarazuka');
 const card=page.locator('.catalog-story').filter({hasText:'autre scène musicale'});
 await expect(card.locator('.catalog-reference')).toHaveAttribute('href','https://en.wikipedia.org/wiki/Takarazuka_Revue');
 await expect(card.locator('.catalog-reference')).toHaveAttribute('target','_blank');
 await card.locator('.catalog-open').click();
 await expect(page.locator('#year')).toHaveText('1914');
 await expect(page.locator('#story h2')).toContainText('Takarazuka');
 await expect(page.locator('#story .read-more')).toHaveAttribute('href','https://en.wikipedia.org/wiki/Takarazuka_Revue');
 await expect(page.locator('#story .read-more')).toContainText('La revue Takarazuka');
 await page.locator('.brand').click();
 await expect(page.locator('#story .context-source')).toHaveAttribute('href','https://www.metmuseum.org/art/collection/search/45434');
 await expect(page.locator('#story .context-source')).toContainText('The Metropolitan Museum of Art');
});

test('Illustrations display source, author, licence and a readable failure state',async({page})=>{
 // Synthetic fixture verifies UI only; it is never included as a claimed historical image.
 const media={title:'Document de test',artist:'Auteur de test',license:'CC BY-SA 4.0',licenseFamily:'CC BY-SA',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',sourcePage:'https://commons.wikimedia.org/wiki/File:Test.png',src:'./images/test-asset.png',mime:'image/png',sha256:'a'.repeat(64),verifiedAt:'2026-10-27T00:00:00Z',description:'Description de test',copyright:'Notice de droits de test'};
 await page.route('**/src/image-manifest.js*',route=>route.fulfill({contentType:'application/javascript',body:`export const storyImages = ${JSON.stringify({5:media})};`}));
 await page.route('**/images/test-asset.png',route=>route.abort());
 await page.goto('/');
 await expect(page.locator('#story .image-attribution')).toContainText('Auteur de test');
 await expect(page.locator('#story .image-attribution a')).toHaveAttribute('href',media.licenseUrl);
 await expect(page.locator('#story .image-source')).toHaveAttribute('href',media.sourcePage);
 await expect(page.locator('#story .image-failure')).toBeVisible();
 await page.locator('#story .image-info-toggle').click();
 await page.locator('#story .image-details summary').click();
 await expect(page.locator('#story .image-details')).toContainText('Notice de droits de test');
 await page.setViewportSize({width:390,height:844});
 const card=await page.locator('#story').boundingBox();expect(card.x+card.width).toBeLessThanOrEqual(390);
 await page.locator('#search-stories').fill('monde flottant');
 await expect(page.locator('.catalog-story .image-attribution')).toContainText('Auteur de test');
 await page.locator('.catalog-story .image-preview').click();
 await expect(page.locator('#story h2')).toContainText('monde flottant');
});


test('Real local illustrations load for every story, with credits, under the configured site base path',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('./');
 for(const year of eras){
  await goToYear(page,year);await page.locator('[data-lens="all"]').click();
  const count=await page.locator('.catalog-story').count();
  await expect(page.locator('.catalog-story .documentary-image')).toHaveCount(count);
  await expect(page.locator('.catalog-story .image-attribution')).toHaveCount(count);
  const decoded=await page.locator('.documentary-image').evaluateAll(async images=>{
   images.forEach(img=>img.loading='eager');return Promise.all(images.map(async img=>{await img.decode();return img.naturalWidth>0}));
  });expect(decoded.every(Boolean)).toBe(true);
 }
 expect(errors).toEqual([]);
});


test('Image credits overlay is discreet, hoverable, dismissible and keyboard accessible',async({page})=>{
 await page.goto('/');
 const figure=page.locator('#story .documentary-figure'),panel=figure.locator('.image-credit-panel'),toggle=figure.locator('.image-info-toggle');
 await expect(panel).toBeHidden();await expect(toggle).toHaveAttribute('aria-expanded','false');
 const before=await figure.boundingBox();expect(before.height).toBeLessThanOrEqual(231);
 await figure.locator('.image-preview').hover({position:{x:25,y:18}});await expect(panel).toBeVisible();
 await expect(panel.locator('.image-attribution')).toContainText('Hokusai');
 await expect(panel.locator('.image-source')).toHaveAttribute('href',/^https:\/\/commons\.wikimedia\.org/);
 expect((await figure.boundingBox()).height).toBe(before.height);
 await page.locator('h1').hover();await expect(panel).toBeHidden();
 await toggle.focus();await expect(panel).toBeVisible();
 await page.keyboard.press('Escape');await expect(panel).toBeHidden();await expect(toggle).toBeFocused();
 await page.keyboard.press('Enter');await expect(panel).toBeVisible();
 await page.locator('h1').hover();await expect(panel).toBeVisible();
 await page.locator('h1').click();await expect(panel).toBeHidden();
 await toggle.click();await expect(panel).toBeVisible();await figure.locator('.image-info-close').click();await expect(panel).toBeHidden();
 const thumbnail=page.locator('.catalog-story .documentary-figure').first();
 await thumbnail.locator('.image-info-toggle').click();await expect(thumbnail.locator('.image-credit-panel')).toBeVisible();
 expect((await thumbnail.boundingBox()).height).toBeLessThanOrEqual(191);
});

test('Touch users can open and close image credits without hover',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
 await page.goto('http://127.0.0.1:5173/');
 const figure=page.locator('#story .documentary-figure'),panel=figure.locator('.image-credit-panel');
 await expect(panel).toBeHidden();await figure.locator('.image-info-toggle').tap();await expect(panel).toBeVisible();
 await expect(panel.locator('.image-attribution')).toContainText('Hokusai');
 const image=await figure.boundingBox(),overlay=await panel.boundingBox();expect(overlay.x).toBeGreaterThanOrEqual(image.x);expect(overlay.x+overlay.width).toBeLessThanOrEqual(image.x+image.width);expect(overlay.y+overlay.height).toBeLessThanOrEqual(image.y+image.height);
 await figure.locator('.image-info-close').tap();await expect(panel).toBeHidden();await context.close();
});
