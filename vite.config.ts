
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    port: 8080, // Set the port to 8080 as required
    host: true,
    cors: true,
    allowedHosts: 'all', // Fix the type error by using 'all' instead of a string array
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'ethers': 'ethers/dist/ethers.min.js',
      'stream': 'stream-browserify',
      'zlib': 'browserify-zlib',
      'https': 'agent-base',
      'http': 'agent-base',
      'util': 'util',
      'path': 'path-browserify',
      'buffer': 'buffer/',
      'process': 'process/browser',
      'querystring': 'query-string',
      'url': 'url',
      'string_decoder': 'string_decoder',
      'punycode': 'punycode',
      'assert': 'assert',
      'fs': 'memfs',
      'os': 'os-browserify/browser',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  base: '/',
});
