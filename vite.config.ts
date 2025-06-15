
import { defineConfig, ConfigEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const config: UserConfig = {
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean as any),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        buffer: 'buffer',
        process: 'process/browser',
        util: 'util',
      },
    },
    define: {
      global: 'globalThis',
      'process.env': '{}',
      'process.version': '"v18.0.0"',
      'process.browser': 'true',
    },
    optimizeDeps: {
      include: [
        'buffer',
        'process',
        'util',
        '@xmtp/xmtp-js',
        'ethers',
      ],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          {
            name: 'node-globals-polyfill',
            setup(build) {
              build.onResolve({ filter: /^buffer$/ }, () => ({
                path: require.resolve('buffer'),
              }));
              build.onLoad({ filter: /.*/, namespace: 'buffer' }, () => ({
                contents: 'export { Buffer } from "buffer"',
                loader: 'js',
              }));
            },
          },
        ],
      },
    },
    build: {
      rollupOptions: {
        plugins: [],
        external: [],
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
    server: {
      host: '::',
      port: 8080
    },
  };
  
  return config;
});
