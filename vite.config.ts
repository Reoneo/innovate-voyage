import { defineConfig, ConfigEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

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
        // Only keep essential polyfills
        buffer: 'buffer',
        process: 'process/browser',
      },
    },
    optimizeDeps: {
      include: ['buffer', 'process'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
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
            vendor: ['react', 'react-dom'],
            wagmi: ['wagmi', '@rainbow-me/rainbowkit'],
            web3: ['@web3modal/react', '@web3modal/ethereum'],
          },
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      // Increase memory limit and optimize chunks
      chunkSizeWarningLimit: 1000,
      sourcemap: false, // Disable sourcemaps for faster builds
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
