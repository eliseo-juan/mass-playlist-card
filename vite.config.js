import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.js'),
      fileName: 'mass-coverwall-card',
      formats: ['es'],
    },
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'mass-coverwall-card.js',
      },
    },
  },
});
