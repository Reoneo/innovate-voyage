
import { defineConfig, ConfigEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const config: UserConfig = {
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean as any),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Essential polyfills only
        buffer: 'buffer',
        process: 'process/browser',
        util: 'util',
        events: 'events',
        stream: 'stream-browserify',
        string_decoder: 'string_decoder',
      },
    },
    optimizeDeps: {
      include: ['buffer', 'process'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }) as any,
          NodeModulesPolyfillPlugin() as any,
        ],
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    define: {
      global: 'globalThis',
      'process.env': {},
    },
    server: {
      host: '::',
      port: 8080
    },
  };
  
  return config;
});
