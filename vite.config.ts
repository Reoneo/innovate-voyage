
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
        // Simplified polyfills for web3 compatibility
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
          // global: 'globalThis', // This is now handled by NodeGlobalsPolyfillPlugin
        },
        // Enable esbuild polyfill plugins
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
      target: 'esnext', // Updated to support modern JavaScript features
      rollupOptions: {
        external: [
          '@safe-global/safe-apps-sdk',
          '@safe-window/safe-apps-sdk',
          '@safe-window/safe-apps-provider',
          '@safe-globalThis/safe-apps-sdk',
          '@safe-globalThis/safe-apps-provider',
        ],
        plugins: [
          nodePolyfills() as Plugin,
        ],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            web3: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
          },
        },
        onwarn(warning, warn) {
          if (
            warning.code === 'UNRESOLVED_IMPORT' &&
            (
              warning.message.includes('@safe-global/safe-apps-sdk') ||
              warning.message.includes('@safe-window/safe-apps-sdk') ||
              warning.message.includes('@safe-window/safe-apps-provider') ||
              warning.message.includes('@safe-globalThis/safe-apps-sdk') ||
              warning.message.includes('@safe-globalThis/safe-apps-provider')
            )
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
      // 'global': 'globalThis', // This is now handled by NodeGlobalsPolyfillPlugin
      'process.env': {},
    },
    server: {
      host: '::',
      port: 8080
    },
  };
  
  return config;
});
