import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: ['@babel/preset-react'], // Suporte para JSX
      },

    }),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
        .replace('%VITE_APP_TITLE%', process.env.VITE_APP_TITLE)
        .replace('%VITE_NEWRELIC_APPLICATIONID%', process.env.VITE_NEWRELIC_APPLICATIONID || '')
        .replace('%VITE_NEWRELIC_LICENSEKEY%', process.env.VITE_NEWRELIC_LICENSEKEY || '');
    }
    },
  ],
  server: {
    host: true, 
    port: 5173, 
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/, 
  },
});
