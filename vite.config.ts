
import { defineConfig, ConfigEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const config: UserConfig = {
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      // Use vite-plugin-node-polyfills for automatic polyfill handling
      nodePolyfills(),
    ].filter(Boolean as any),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Remove manual polyfill aliases - let vite-plugin-node-polyfills handle them
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
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
      rollupOptions: {
        external: [
          '@safe-global/safe-apps-sdk',
          '@safe-window/safe-apps-sdk',
          '@safe-window/safe-apps-provider'
        ],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
        // Handle optional dependencies that might not be available
        onwarn(warning, warn) {
          // Suppress warnings about missing optional dependencies
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
      'global': 'globalThis',
      'process.env': {},
    },
    server: {
      host: '::',
      port: 8080
    },
  };
  
  return config;
});
