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
        return html.replace('%VITE_APP_TITLE%', process.env.VITE_APP_TITLE);
      }
    },
  ],
  server: {
    host: true, // Escuta em 0.0.0.0, permitindo conexões externas
    port: 5173, // Porta padrão
  },
  esbuild: {
    loader: 'jsx', // Trata arquivos .js como JSX
    include: /src\/.*\.js$/, // Inclui arquivos .js dentro da pasta src
  },
});
