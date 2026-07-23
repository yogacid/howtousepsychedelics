// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://howtousepsychedelics.com',
  trailingSlash: 'always',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4322 },
  adapter: netlify(),
  // /guide/ is parked: still reachable, but noindex'd and kept out of the
  // sitemap so Google stops treating it as a page to index.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/guide/') })],
  build: {
    format: 'directory',
  },
});
