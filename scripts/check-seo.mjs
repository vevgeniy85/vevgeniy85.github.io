import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
async function files(dir) { return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(`${dir}/${e.name}`):`${dir}/${e.name}`))).flat(); }
const pages=(await files('_site')).filter(f=>f.endsWith('.html') && !f.replaceAll('\\','/').includes('/previews/'));
const titles=new Set(), descriptions=new Set();
const canonicalUrls = new Set();
for (const file of pages) {
  const html=await readFile(file,'utf8');
  if (file.endsWith('/404.html')) { assert.match(html,/name="robots" content="noindex, follow"/); assert.ok(!html.includes('rel="canonical"')); continue; }
  const title=html.match(/<title>(.*?)<\/title>/)[1];
  const description=html.match(/name="description" content="([^"]+)"/)[1];
  assert.ok(!titles.has(title),`Duplicate title: ${file}`); titles.add(title);
  assert.ok(!descriptions.has(description),`Duplicate description: ${file}`); descriptions.add(description);
  assert.ok(description.length>=60&&description.length<=220,`Description length: ${file}`);
  const canonical=html.match(/rel="canonical" href="([^"]+)"/)[1];
  canonicalUrls.add(canonical);
  assert.ok(canonical.startsWith('https://xt-solution.com/'));
  assert.equal((html.match(/rel="alternate" hreflang=/g)||[]).length,4);
  const json=html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1];
  const schema=JSON.parse(json); assert.equal(schema['@context'],'https://schema.org');
  const graph=schema['@graph'];const ids=new Set(graph.map(n=>n['@id']));
  assert.equal(ids.size,graph.length);
  assert.ok(graph.some(n=>n['@type']==='WebSite'));assert.ok(graph.some(n=>n['@type']==='Person'));
  const webPage=graph.find(n=>['WebPage','ProfilePage','CollectionPage','ContactPage'].includes(n['@type']));
  assert.equal(webPage.url,canonical);assert.equal(webPage.name,title.replaceAll('&amp;','&'));
  function refs(value) { if(!value||typeof value!=='object')return; if(Object.keys(value).length===1&&value['@id'])assert.ok(ids.has(value['@id']),`Unresolved ID: ${file}`); for(const child of Object.values(value))refs(child); }
  refs(graph);
  const breadcrumbs=graph.find(n=>n['@type']==='BreadcrumbList');
  if(breadcrumbs){assert.ok(breadcrumbs.itemListElement.length>=2);assert.equal(breadcrumbs.itemListElement.at(-1).item,canonical);}
}
console.log(`SEO verified: ${titles.size} unique titles/descriptions, canonical URLs, hreflang and JSON-LD graphs; 404 noindex.`);
const sitemap = await readFile('_site/sitemap.xml', 'utf8');
assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(sitemapUrls.length, new Set(sitemapUrls).size, 'Sitemap must not contain duplicate URLs');
assert.deepEqual(new Set(sitemapUrls), canonicalUrls, 'Sitemap must contain exactly the canonical indexable pages');
const robots = await readFile('_site/robots.txt', 'utf8');
const prefix = (process.env.SITE_PATH_PREFIX || '/').replace(/\/$/, '');
assert.ok(robots.includes(`Sitemap: https://xt-solution.com${prefix}/sitemap.xml`), 'robots.txt must reference the sitemap');
assert.match(robots, /User-agent: \*\nAllow: \/\n/);
console.log(`Sitemap verified: ${sitemapUrls.length} canonical URLs; robots.txt references sitemap.xml.`);
