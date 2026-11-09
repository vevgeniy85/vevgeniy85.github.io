import { languages } from './lib/content.js';
import { routes } from './lib/routes.js';
import { escape, href } from './lib/ui.js';

export default class {
  data() { return { permalink: 'sitemap.xml', eleventyExcludeFromCollections: true }; }

  render({ site }) {
    const urls = languages.flatMap(lang => routes.map(route => {
      const url = new URL(href(lang, route), site.origin).href;
      return `  <url><loc>${escape(url)}</loc></url>`;
    }));
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  }
}
