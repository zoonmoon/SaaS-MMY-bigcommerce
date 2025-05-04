import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Read params from CLI
let storeHash = process.argv.find(arg => arg.startsWith('--store_hash='))?.split('=')[1]?.trim();

// Check if storeHash is missing and terminate the process
if (!storeHash) {
    console.error('Error: --store_hash parameter is required.');
    process.exit(1);  // Terminate the process with an error code
}

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.NEXT_PUBLIC_STORE_HASH': JSON.stringify(storeHash),
    'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL), // use production url
  },
  plugins: [react({ jsxRuntime : 'automatic' })],
  build: {
    lib: {
      entry: 'src/app/_expose-to-js/index.jsx',
      name: 'YmmSelectorWidget',
      fileName: () => `${storeHash}.js`,
      formats: ['iife'], // Immediately Invoked Function Expression (global usage)
    },
    outDir: `./public/${process.env.YMM_SCRIPTS_FOLDER}`,
    copyPublicDir:false
  },
});