import { projects } from './content.js';

export const routes = ['', 'about', 'portfolio', 'services', 'contacts', ...projects.map(project => `portfolio/${project.slug}`)];
