
import { defineConfig, ConfigEnv, UserConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import nodePolyfills from 'rollup-plugin-node-polyfills';

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
        // Polyfills for web3 compatibility; do NOT alias anything that could break @safe-global/safe-apps-sdk
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        events: 'rollup-plugin-node-polyfills/polyfills/events',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
        process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
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
        // Explicitly mark all Safe SDK entries as external to avoid resolution/rewriting issues
        external: [
          '@safe-global/safe-apps-sdk',
          '@safe-window/safe-apps-sdk',
          '@safe-window/safe-apps-provider'
        ],
        plugins: [
          // Enable rollup polyfills plugin for production bundling
          nodePolyfills() as Plugin,
        ],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            web3: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
          },
        },
        // Suppress rollup warnings about unresolved Safe SDK imports (these are external and expected)
        onwarn(warning, warn) {
          if (
            warning.code === 'UNRESOLVED_IMPORT' &&
            (warning.message.includes('@safe-global/safe-apps-sdk') || 
             warning.message.includes('@safe-window/safe-apps-sdk') ||
             warning.message.includes('@safe-window/safe-apps-provider'))
          ) {
            return;
          }
          warn(warning);
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    define: {
      // Only define globals required for polyfills; do not insert any string rewrite that affects import paths
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
