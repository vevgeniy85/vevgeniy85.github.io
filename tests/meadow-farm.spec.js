import { test, expect } from '@playwright/test';

test('Meadow Farm routes, images, anchors and mobile navigation', async ({page}) => {
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  for (const width of [375,425,768,1440]) {
    await page.setViewportSize({width,height:900});
    for (const route of ['', 'about/', 'farm-store-list/', 'visit-us/', 'f-a-q-s/', '404.html']) {
      await page.goto('/previews/meadow-farm/'+route);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.title()).toContain('Meadow Farm');
      for (const href of await page.locator('a[href]').evaluateAll(links=>links.map(a=>a.getAttribute('href')))) {
        if (/^(https?:|mailto:|tel:)/.test(href)) expect(href).toMatch(/^(https:\/\/www\.google\.com\/maps$|mailto:hello@example\.com$|tel:\+14165550147$)/);
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await page.locator('img').evaluateAll(async imgs=>{await Promise.all(imgs.map(img=>{img.loading='eager';return img.decode();}));});
      for (const href of await page.locator('a[href*="#list-"]').evaluateAll(links=>links.map(a=>a.href))) {
        expect(href).not.toContain('undefined');
      }
      if(route==='about/' && width<=425) {
        const ratio=await page.locator('img.card-photo').first().evaluate(img=>img.getBoundingClientRect().width/img.getBoundingClientRect().height);
        expect(ratio).toBeCloseTo(4/3,1);
      }
    }
    await page.goto('/previews/meadow-farm/farm-store-list/');
    for(const id of ['eggs','beef','chicken','honey','apothecary','pork','lamb','turkey','beef','eggs']) {
      await page.locator(`[data-category-nav] a[href="#list-${id}"]`).click();
      await expect.poll(async()=>page.evaluate(id=>Math.abs(document.querySelector(`#list-${id}`).getBoundingClientRect().top-document.querySelector('[data-category-nav]').getBoundingClientRect().bottom),id), {message:`Anchor ${id} at ${width}px`}).toBeLessThanOrEqual(2);
    }
    await page.goto('/previews/meadow-farm/about/');
    await page.locator('article a[href$="#list-honey"]').first().click();
    await expect(page).toHaveURL(/#list-honey$/);
    await expect.poll(async()=>page.evaluate(()=>Math.abs(document.querySelector('#list-honey').getBoundingClientRect().top-document.querySelector('[data-category-nav]').getBoundingClientRect().bottom))).toBeLessThanOrEqual(2);
    if(width===1440) {
      await expect.poll(()=>page.locator('#list-honey').evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
      await page.screenshot({path:'test-results/meadow-catalog.png'});
      await page.goto('/previews/meadow-farm/about/');
      await page.locator('img[alt="Our Bees — illustrative photograph"]').scrollIntoViewIfNeeded();
      await expect.poll(()=>page.locator('img[alt="Our Bees — illustrative photograph"]').evaluate(img=>getComputedStyle(img.closest('section')).opacity)).toBe('1');
      await page.locator('img[alt="Our Bees — illustrative photograph"]').evaluate(img=>img.decode());
      await page.screenshot({path:'test-results/meadow-about.png'});
    }
    if(width<768) {
      const burger=await page.locator('[data-menu-toggle]').boundingBox();
      await page.locator('[data-menu-toggle]').click();
      await expect(page.locator('#mobile-menu')).toHaveClass(/is-open/);
      await expect.poll(async()=>Math.abs((await page.locator('[data-menu-close]').boundingBox()).x-burger.x)).toBeLessThan(0.5);
      const close=await page.locator('[data-menu-close]').boundingBox();
      expect(close.x).toBeCloseTo(burger.x,0);
      expect(close.y).toBeCloseTo(burger.y,0);
      await page.locator('#mobile-menu a').filter({hasText:'Our Story'}).click();
      await expect(page).toHaveURL(/\/about\/$/);
      await page.locator('[data-menu-toggle]').click();
      await page.keyboard.press('Escape');
      await expect(page.locator('#mobile-menu')).not.toBeVisible();
    }
  }
  expect(errors).toEqual([]);
});
