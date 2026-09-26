import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: app deploys don't invalidate these caches.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/](three|@react-three)[\\/]/.test(id)) return 'vendor-three';
          if (/[\\/](gsap|@gsap)[\\/]/.test(id)) return 'vendor-gsap';
          if (/[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'vendor-motion';
          if (/[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'vendor-react';
        },
      },
    },
  },
});
