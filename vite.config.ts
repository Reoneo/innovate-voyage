
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ].filter(Boolean),
  build: {
    outDir: 'dist',
  },
  server: {
    port: 8080,
    host: '::',
    cors: true,
    allowedHosts: ['all'],
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
}));
