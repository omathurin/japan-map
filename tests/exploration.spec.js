import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const eras=[710,794,1185,1333,1573,1603,1868,1912,1926,1989];
const lenses=['politique','guerres','religion','culture','arts','cuisine'];
async function goToYear(page,year){await page.locator('#time').evaluate((el,year)=>{el.value=year;el.dispatchEvent(new Event('input',{bubbles:true}))},year)}

test('All sixty era/theme combinations show narratives and clickable hotspots',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.locator('.marker')).toHaveCount(15);
 for(const year of eras){
  await goToYear(page,year);
  for(const lens of lenses){
   await page.locator(`[data-lens="${lens}"]`).click();
   expect(await page.locator('.marker').count(),`${year} ${lens}`).toBeGreaterThan(0);
   await expect(page.locator('#story h2')).not.toBeEmpty();
   await expect(page.locator('#story a.read-more')).toHaveAttribute('href',/^https:/);
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
 await page.locator('.catalog-story').filter({hasText:'mémoire pour horizon'}).click();
 await expect(page.locator('#year')).toHaveText('1945');
 await expect(page.locator('#story h2')).toContainText('Hiroshima');
 await page.locator('#search-stories').fill('zzzintrouvable');
 await expect(page.locator('.no-results')).toBeVisible();
 await page.locator('#search-stories').fill('');
 await page.locator('[data-lens="all"]').click();
 await goToYear(page,1603);
 await expect(page.locator('#story h2')).toContainText('shogunat Tokugawa');
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
 await page.locator('[data-lens="cuisine"]').click();
 await expect(page.locator('#story h2')).toContainText('sushi');
 await page.locator('#political-jump').selectOption('1972');
 await expect(page.locator('[data-territory]')).toHaveCount(47);
 expect(errors).toEqual([]);
});
