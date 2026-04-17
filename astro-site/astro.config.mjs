// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://howtousepsychedelics.com',
  adapter: netlify(),
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
});
