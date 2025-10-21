import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    'import.meta.env.VITE_ASSOCIATION_LOGO': JSON.stringify(process.env.VITE_ASSOCIATION_LOGO || '/logoSou.png'),
    'import.meta.env.VITE_ASSOCIATION_LOGO_MENU': JSON.stringify(process.env.VITE_ASSOCIATION_LOGO_MENU || '/logo-menu.png'),
    'import.meta.env.VITE_ASSOCIATION_LOGO_SIZE': JSON.stringify(process.env.VITE_ASSOCIATION_LOGO_SIZE || '250px'),
    'import.meta.env.VITE_ASSOCIATION_NAME': JSON.stringify(process.env.VITE_ASSOCIATION_NAME || 'Sou Cannabis'),
    'import.meta.env.VITE_ASSOCIATION_PHONE': JSON.stringify(process.env.VITE_ASSOCIATION_PHONE || '556298364889'),
    'import.meta.env.VITE_DIRECTUS_API_TOKEN': JSON.stringify(process.env.VITE_DIRECTUS_API_TOKEN || ''),
    'import.meta.env.VITE_DIRECTUS_API_URL': JSON.stringify(process.env.VITE_DIRECTUS_API_URL || ''),
    'import.meta.env.VITE_DOCUSEAL_URL': JSON.stringify(process.env.VITE_DOCUSEAL_URL || ''),
    'import.meta.env.VITE_NEWRELIC_APPLICATIONID': JSON.stringify(process.env.VITE_NEWRELIC_APPLICATIONID || ''),
    'import.meta.env.VITE_NEWRELIC_LICENSEKEY': JSON.stringify(process.env.VITE_NEWRELIC_LICENSEKEY || ''),
    'import.meta.env.VITE_PASS_ENCRYPT': JSON.stringify(process.env.VITE_PASS_ENCRYPT || ''),
    'import.meta.env.VITE_SERVER_API_TOKEN': JSON.stringify(process.env.VITE_SERVER_API_TOKEN || ''),
    'import.meta.env.VITE_SERVER_PORT': JSON.stringify(process.env.VITE_SERVER_PORT || '8055'),
    'import.meta.env.VITE_SERVER_URL': JSON.stringify(process.env.VITE_SERVER_URL || 'http://localhost:8055'),
    'import.meta.env.VITE_URL': JSON.stringify(process.env.VITE_URL || ''),
    'import.meta.env.VITE_CONTACT_URL': JSON.stringify(process.env.VITE_CONTACT_URL || ''),
    'import.meta.env.VITE_WELCOME_TEXT': JSON.stringify(process.env.VITE_WELCOME_TEXT || 'na Associação Sou Cannabis'),
    'import.meta.env.WDS_SOCKET_PORT': JSON.stringify(process.env.WDS_SOCKET_PORT || '0'),
  },
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html        
      }
    },
    react({
      babel: {
        presets: ['@babel/preset-react'], // Suporte para JSX
      },
    }),
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
