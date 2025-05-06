
import { defineConfig, ConfigEnv, UserConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // Check if estree-walker exists
  const estreeWalkerPath = path.resolve(__dirname, 'node_modules/estree-walker/src/index.js');
  const estreeWalkerExists = fs.existsSync(estreeWalkerPath);
  
  console.log(`estree-walker path ${estreeWalkerPath} exists: ${estreeWalkerExists}`);
  
  // Fallback to dist version if src doesn't exist
  const estreeWalkerResolvedPath = estreeWalkerExists 
    ? estreeWalkerPath 
    : path.resolve(__dirname, 'node_modules/estree-walker/dist/esm/index.js');

  const config: UserConfig = {
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean as any),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Add alias for estree-walker to fix exports issue
        'estree-walker': estreeWalkerResolvedPath,
        // Force Rollup to resolve the published CJS builds inside node_modules
        '@web3modal/react': path.resolve(
          __dirname,
          'node_modules/@web3modal/react/dist/index.js'
        ),
        '@web3modal/ethereum': path.resolve(
          __dirname,
          'node_modules/@web3modal/ethereum/dist/index.js'
        ),
        // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
        // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
        // process and buffer are excluded because already managed by other plugins
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        sys: 'util',
        events: 'rollup-plugin-node-polyfills/polyfills/events',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
        punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
        url: 'rollup-plugin-node-polyfills/polyfills/url',
        string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
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
      // Add estree-walker and other problematic packages to force pre-bundling
      include: ['estree-walker'],
    },
    build: {
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin
          // used during production bundling
          nodePolyfills() as Plugin,
        ],
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
