import { defineConfig } from 'vite';

// base './' keeps the build working under https://USER.github.io/REPO/
export default defineConfig({
  base: './',
  build: { outDir: 'dist', target: 'es2020', sourcemap: false }
});
