import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('src/assets/fonts', { recursive: true });
for (const subset of ['latin', 'cyrillic', 'cyrillic-ext']) {
  await copyFile(`node_modules/@fontsource-variable/manrope/files/manrope-${subset}-wght-normal.woff2`, `src/assets/fonts/manrope-${subset}.woff2`);
}
await copyFile('node_modules/@fontsource-variable/manrope/LICENSE', 'src/assets/fonts/OFL.txt');
await copyFile('node_modules/@fortawesome/free-brands-svg-icons/LICENSE.txt', 'src/assets/font-awesome-license.txt');
