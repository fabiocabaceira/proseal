import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// BASE is the folder the site is served from: /proseal/ on GitHub Pages, / on the client's own domain.
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react(), tailwindcss()],
});
