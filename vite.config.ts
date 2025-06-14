
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
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        sys: 'util',
        events: 'rollup-plugin-node-polyfills/polyfills/events',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
        punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
        url: 'rollup-plugin-node-polyfills/polyfills/url',
        // This ensures the path is always correct no matter the environment:
        string_decoder: require.resolve('rollup-plugin-node-polyfills/polyfills/string-decoder.js'),
        http: 'rollup-plugin-node-polyfills/polyfills/http',
        https: 'rollup-plugin-node-polyfills/polyfills/http',
        os: 'rollup-plugin-node-polyfills/polyfills/os',
        assert: 'rollup-plugin-node-polyfills/polyfills/assert',
        constants: 'rollup-plugin-node-polyfills/polyfills/constants',
        _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
        _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
        _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
        _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
        _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
        timers: 'rollup-plugin-node-polyfills/polyfills/timers',
        console: 'rollup-plugin-node-polyfills/polyfills/console',
        vm: 'rollup-plugin-node-polyfills/polyfills/vm',
        zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
        tty: 'rollup-plugin-node-polyfills/polyfills/tty',
        domain: 'rollup-plugin-node-polyfills/polyfills/domain',
        buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
        process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      },
    },
    optimizeDeps: {
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
        external: [
          '@safe-global/safe-apps-sdk',
          '@safe-window/safe-apps-sdk',
          '@safe-window/safe-apps-provider'
        ],
        plugins: [
          nodePolyfills() as Plugin,
        ],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
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
      'global': 'window',
      'process.env': {},
    },
    server: {
      host: '::',
      port: 8080
    },
  };
  
  return config;
});
