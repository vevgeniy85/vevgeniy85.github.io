export default class Manifest {
  data() { return { permalink: 'manifest.webmanifest', eleventyExcludeFromCollections: true }; }

  render({ site }) {
    return JSON.stringify({
      id: './',
      name: site.name,
      short_name: site.name,
      start_url: './',
      scope: './',
      display: 'standalone',
      background_color: '#080b0f',
      theme_color: '#080b0f',
      icons: [
        { src: 'assets/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
      ]
    }, null, 2);
  }
}
