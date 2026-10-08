# Extended Solution

Multilingual developer portfolio built with Eleventy and Tailwind CSS.

## Development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

## Build and checks

```sh
npm run build
npm run check
npm test
```

Generated files are in `_site/`. Browser checks use Microsoft Edge.

## Editing

- `src/_data/site.js`: contact details and site configuration.
- `src/lib/content.js`: projects and translations (EN / UK / RU).
- `src/pages.11ty.js` and `src/lib/ui.js`: page templates and shared components.
- `src/styles.css`: styles and the default `--color-accent`.

Message delivery is disabled until `formEndpoint` is configured.

## Publishing

GitHub Pages deployment runs automatically on pushes to `main` using `.github/workflows/pages.yml`.