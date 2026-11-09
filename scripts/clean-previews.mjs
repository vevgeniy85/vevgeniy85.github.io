import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Eleventy's passthrough copy leaves removed source files in existing builds.
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, '_site');
const previews = path.resolve(output, 'previews');
if (path.dirname(previews) !== output) throw new Error('Invalid preview output path');
await rm(previews, { recursive: true, force: true });
