
import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig((config: ConfigEnv): UserConfig => {
  const { mode } = config;
  return {
    plugins: [
      react(),
      mode === 'development' ? componentTagger() : null,
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        'node-fetch': 'isomorphic-fetch',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    build: {
      rollupOptions: {
        plugins: [
          // Cast the plugin to any to bypass TypeScript's type checking
          // This is necessary because of the incompatible types between what Vite expects and what the plugin provides
          rollupNodePolyFill() as any
        ],
      },
      sourcemap: true,
    },
    server: {
      host: true,
      port: 8080,
      strictPort: true,
      cors: true,
      hmr: {
        clientPort: 8080,
        host: 'localhost',
      },
    },
  };
});
