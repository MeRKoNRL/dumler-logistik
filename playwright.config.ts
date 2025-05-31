
import { defineConfig } from '@playwright/experimental-ct-next';

export default defineConfig({
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
