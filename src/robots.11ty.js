import { href } from './lib/ui.js';

export default class {
  data() { return { permalink: 'robots.txt', eleventyExcludeFromCollections: true }; }

  render({ site }) {
    const sitemap = new URL(`${href('en')}sitemap.xml`, site.origin).href;
    return `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  }
}
