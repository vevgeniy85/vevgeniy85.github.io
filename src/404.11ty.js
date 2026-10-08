import { layout, button, href, escape } from './lib/ui.js';
export default class {
  data() { return { permalink: '404.html' }; }
  render({site}) { return layout(`<section class="wrap section"><p class="eyebrow">404</p><h1>Page not found</h1><p class="mt-6 mb-8">The page may have moved, or this address may be incorrect.</p>${button('Return home',href('en'),true)}</section>`,{lang:'en',route:'',title:'Page not found',description:'Page not found — '+escape(site.name),site}); }
}
