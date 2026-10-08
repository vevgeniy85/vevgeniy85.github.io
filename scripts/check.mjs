import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { projects, languages } from '../src/lib/content.js';
async function files(dir) { const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?files(path.join(dir,e.name)):path.join(dir,e.name)))).flat(); }
const pages=(await files('_site')).filter(f=>f.endsWith('.html'));
assert.equal(pages.length,(5+projects.length)*languages.length+1,'Expected main pages and all project cases in each language, plus 404');
const prefix=(process.env.SITE_PATH_PREFIX||'/').replace(/\/$/,'');
let links=0;
for(const file of pages){
  const html=await readFile(file,'utf8');
  assert.match(html,/<html lang="(en|uk|ru)">/);
  assert.match(html,/<meta name="description" content="[^"]+"/);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: single h1`);
  assert.ok(!html.includes('href="#"'),`${file}: placeholder link`);
  const ids=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const [,url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    if(/^(https?:|mailto:|data:)/.test(url))continue;
    if(url.startsWith('#')){assert.ok(ids.has(url.slice(1)),`${file}: anchor ${url}`);continue;}
    assert.ok(url.startsWith(prefix+'/'),`${file}: URL missing prefix ${url}`);
    const relative=url.slice(prefix.length).replace(/^\//,'');
    await access(path.join('_site',relative.endsWith('/')?relative+'index.html':relative)); links++;
  }
  const imageCount=(html.match(/<img /g)||[]).length;
  assert.equal((html.match(/<img [^>]*\balt="[^"]*"/g)||[]).length,imageCount,`${file}: image alt`);
}
const css=await readFile('_site/assets/site.css','utf8');
assert.ok(css.includes('.grid')&&css.includes('.bg-page')&&css.includes('.btn-primary'),'Tailwind utilities and components were compiled');
console.log(`Checked ${pages.length} HTML pages, ${links} local links/assets, metadata, anchors and compiled CSS.`);
