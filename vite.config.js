import {defineConfig} from 'vite';
import {resolve} from 'node:path';

// Relative assets also work when GitHub Pages hosts this project in a subfolder.
export default defineConfig({
  base:'./',
  build:{rollupOptions:{input:{main:resolve(import.meta.dirname,'index.html'),celebracion:resolve(import.meta.dirname,'celebracion.html')}}}
});
