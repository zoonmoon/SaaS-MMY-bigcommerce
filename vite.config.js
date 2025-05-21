import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default defineConfig(({ command, mode }) => {

  return {
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.NEXT_PUBLIC_STORE_HASH': JSON.stringify(''),
    'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL), // use production url
  },
  plugins: [react({ jsxRuntime : 'automatic' })],
  build: {
    lib: {
      entry: 'src/app/_expose-to-js/index.jsx',
      name: 'YmmSelectorWidget',
      fileName: () => `main.js`,
      formats: ['iife'], // Immediately Invoked Function Expression (global usage)
    },
    outDir: `./public/${process.env.YMM_SCRIPTS_FOLDER}`,
    copyPublicDir:false
  },
}
})