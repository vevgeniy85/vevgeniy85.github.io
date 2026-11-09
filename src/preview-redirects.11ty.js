import { escape, href } from './lib/ui.js';

// Keep previously published demo links working after the directory rename.
export default class {
  data() {
    return {
      pagination: { data: 'redirectPages', size: 1, alias: 'redirectPage' },
      redirectPages: ['index.html', 'privacy.html'],
      permalink: ({ redirectPage }) => `previews/schastlyva-malecha/${redirectPage}`
    };
  }

  render({ redirectPage, site }) {
    const target = `../kid-toys/${redirectPage === 'index.html' ? '' : redirectPage}`;
    const canonical = new URL(`${href('en', 'previews/kid-toys')}${redirectPage === 'index.html' ? '' : redirectPage}`, site.origin).href;
    return `<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, follow"><title>Сторінку переміщено</title><link rel="canonical" href="${escape(canonical)}"><meta http-equiv="refresh" content="0;url=${escape(target)}"><script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script></head><body><p>Сторінку переміщено. <a href="${escape(target)}">Відкрити сайт</a></p></body></html>`;
  }
}
