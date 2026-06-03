import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, './www.pulsenova.ch');

function getHtmlInputs(dir, baseDir = dir) {
  let inputs = {};
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'dist' || file === 'node_modules') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      Object.assign(inputs, getHtmlInputs(fullPath, baseDir));
    } else if (file.endsWith('.html')) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const key = relativePath.replace(/\.html$/, '').replace(/\//g, '_');
      inputs[key] = fullPath;
    }
  });
  return inputs;
}

const htmlInputs = getHtmlInputs(rootDir);

export default defineConfig({
  root: './www.pulsenova.ch',
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 3000,
    host: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlInputs
    }
  }
});

