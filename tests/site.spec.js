import { test, expect } from '@playwright/test';
import { projects } from '../src/lib/content.js';
test('all routes render without errors, missing images or horizontal overflow', async ({page}) => {
  const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  const routes=['','about/','portfolio/','services/','contacts/',...projects.map(p=>'portfolio/'+p.slug+'/')];
  for(const width of [375,430,768,1024,1440]){
    await page.setViewportSize({width,height:900});
    for(const lang of ['','uk/','ru/'])for(const route of routes){
      await page.goto('/'+lang+route);
      await page.locator('img').evaluateAll(async images => { await Promise.all(images.map(img => { img.loading = 'eager'; return img.decode(); })); });
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}: ${lang}${route}`).toBe(true);
      expect(await page.locator('img').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
test('filters show the expected projects and reset',async({page})=>{
  await page.goto('/portfolio/');
  for(const filter of ['wordpress','shopify','landing','store','all']){
    const count = projects.filter(p=>filter==='all'||p.filters.includes(filter)).length;
    await page.locator(`[data-filter="${filter}"]`).click();
    await expect(page.locator('[data-project]:visible')).toHaveCount(count);
    await expect(page.locator(`[data-filter="${filter}"]`)).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('#filter-status')).toHaveText(`${count} projects shown`);
  }
});
test('mobile menu closes with Escape and language links preserve a case',async({page})=>{
  await page.setViewportSize({width:375,height:812});
  await page.goto('/portfolio/travel-agency/');
  const logoBox = await page.locator('.header-brand').boundingBox();
  const toggleBox = await page.locator('#menu-toggle').boundingBox();
  expect(Math.abs(logoBox.y + logoBox.height / 2 - toggleBox.y - toggleBox.height / 2)).toBeLessThan(2);
  await page.locator('#menu-toggle').click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(page.locator('#menu-toggle')).toBeFocused();
  await page.locator('#menu-toggle').click();
  await page.locator('#menu-close').click();
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await page.locator('#menu-toggle').click();
  await page.mouse.click(5, 400);
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await page.locator('#menu-toggle').click();
  await page.locator('#mobile-menu a[hreflang="uk"]').click();
  await expect(page).toHaveURL(/\/uk\/portfolio\/travel-agency\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang','uk');
});
test('form validates and never reports a disconnected submission as successful',async({page})=>{
  const requests=[];page.on('request',r=>{if(r.method()==='POST')requests.push(r.url());});
  await page.goto('/contacts/');
  await page.locator('[type="submit"]').click();
  await expect(page.locator('#name-error')).toBeVisible();
  await expect(page.locator('#name')).toBeFocused();
  await page.locator('#name').fill('Demo visitor');
  await page.locator('#email').fill('invalid');
  await page.locator('#message').fill('A demo project enquiry.');
  await page.locator('[type="submit"]').click();
  await expect(page.locator('#email-error')).toHaveText('Enter a valid email address.');
  await page.locator('#email').fill('demo@example.com');
  await page.locator('[type="submit"]').click();
  await expect(page.locator('#form-status')).toHaveText('Delivery is not connected. Your message has not been sent.');
  expect(requests).toEqual([]);
  await expect(page.locator('#message')).toHaveValue('A demo project enquiry.');
});
test('connected adapter requires explicit confirmation and handles failure',async({page})=>{
  await page.goto('/contacts/');
  await page.locator('#name').fill('Demo visitor');
  await page.locator('#email').fill('demo@example.com');
  await page.locator('#message').fill('Demo enquiry');
  await page.locator('#contact-form').evaluate(form=>form.dataset.endpoint='/test-delivery');
  await page.route('**/test-delivery',route=>route.fulfill({status:200,contentType:'application/json',body:'{"success":false}'}));
  await page.locator('[type="submit"]').click();
  await expect(page.locator('#form-status')).toHaveText('Could not send your message. Please try again later.');
  await expect(page.locator('#message')).toHaveValue('Demo enquiry');
  await page.unroute('**/test-delivery');
  await page.route('**/test-delivery',route=>route.fulfill({status:200,contentType:'application/json',body:'{"success":true}'}));
  await page.locator('[type="submit"]').click();
  await expect(page.locator('#form-status')).toHaveText('Your message has been sent.');
  await expect(page.locator('#message')).toHaveValue('');
});
test('capture desktop and mobile previews',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});await page.goto('/');
  await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(img=>{img.loading='eager';return img.decode();}));});
  await page.screenshot({path:'test-results/home-desktop.png',fullPage:true});
  await page.setViewportSize({width:375,height:812});await page.goto('/ru/');
  await page.locator('img').evaluateAll(async images=>{await Promise.all(images.map(img=>{img.loading='eager';return img.decode();}));});
  await page.screenshot({path:'test-results/home-mobile.png',fullPage:true});
});
test('color picker applies all presets and remembers the selection across pages and languages', async ({page,context}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  await page.locator('[popovertarget="theme-picker"]').click();
  for (const color of ['blue','green','yellow','red','purple']) {
    await page.locator(`#theme-picker [data-accent-choice="${color}"]`).click();
    await expect(page.locator('html')).toHaveAttribute('data-ui-accent',color);
    await expect(page.locator(`#theme-picker [data-accent-choice="${color}"]`)).toHaveAttribute('aria-pressed','true');
  }
  await page.locator('#theme-picker [data-accent-choice="yellow"]').click();
  const saved = (await context.cookies()).find(cookie=>cookie.name==='xt-ui-accent');
  expect(saved.value).toBe('yellow'); expect(saved.sameSite).toBe('Lax');
  expect(saved.expires).toBeGreaterThan(Date.now()/1000+300*86400);
  await page.goto('/uk/portfolio/');
  await expect(page.locator('html')).toHaveAttribute('data-ui-accent','yellow');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-ui-accent','yellow');
  await page.setViewportSize({width:375,height:812});
  await page.locator('#menu-toggle').click();
  await expect(page.locator('#mobile-menu [data-accent-choice="yellow"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('#mobile-menu [data-accent-choice="blue"]').click();
  await page.goto('/ru/contacts/');
  await expect(page.locator('html')).toHaveAttribute('data-ui-accent','blue');
});
