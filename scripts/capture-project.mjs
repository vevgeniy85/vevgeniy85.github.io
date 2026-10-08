import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { projects } from '../src/lib/content.js';
const project = projects.find(p=>p.real && p.slug === (process.argv[2] || 'poehalisnami'));
if (!project) throw new Error('Unknown live project');
const browser = await chromium.launch({channel:'msedge',headless:true});
try {
  const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  await page.goto(project.url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.evaluate(async()=>{ await Promise.race([Promise.all([document.fonts.ready, ...[...document.images].filter(img=>img.getBoundingClientRect().top<innerHeight).map(img=>img.decode().catch(()=>{}))]), new Promise(resolve=>setTimeout(resolve,10000))]); });
  console.log('Title:',await page.title());
  console.log('Shopify detected:',await page.evaluate(()=>Boolean(window.Shopify)));
  const dismiss = page.getByText(/No thanks.*full price/i);
  if (await dismiss.isVisible()) {
    await dismiss.click({timeout:5000});
    await dismiss.waitFor({state:'hidden',timeout:5000});
  }
  await page.screenshot({path:`src/assets/${project.slug}-original.png`});
  await sharp(`src/assets/${project.slug}-original.png`).resize(1200).webp({quality:85}).toFile(`src/assets/${project.slug}.webp`);
} finally { await browser.close(); }
