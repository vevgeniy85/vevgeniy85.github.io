import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  workers: 1,
  use: { baseURL: 'http://localhost:8080', browserName: 'chromium', channel: 'msedge', headless: true },
  webServer: { command: 'npx eleventy --serve', url: 'http://localhost:8080', reuseExistingServer: !process.env.CI },
  reporter: 'list'
});
