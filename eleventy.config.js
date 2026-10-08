export default function (config) {
  config.addPassthroughCopy('src/assets/**/*.{css,js,svg,webp,woff2,txt}');
  config.addWatchTarget('src/styles.css');
  config.ignores.add('src/styles.css');
  return { dir: { input: 'src', output: '_site' }, templateFormats: ['11ty.js'], pathPrefix: process.env.SITE_PATH_PREFIX || '/' };
}
