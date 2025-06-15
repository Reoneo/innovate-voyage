
// Import Buffer polyfill FIRST before anything else
import { Buffer } from 'buffer';

// Set up global polyfills immediately
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).global = globalThis;
  (globalThis as any).process = {
    env: {},
    version: 'v18.0.0',
    browser: true,
    nextTick: (fn: Function) => setTimeout(fn, 0)
  };
}

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = globalThis;
  (window as any).process = {
    env: {},
    version: 'v18.0.0',
    browser: true,
    nextTick: (fn: Function) => setTimeout(fn, 0)
  };
}

// Verify Buffer is available
console.log("Buffer polyfill setup complete:", {
  Buffer: typeof Buffer,
  BufferFrom: typeof Buffer.from,
  BufferAlloc: typeof Buffer.alloc,
  globalBuffer: !!(globalThis as any).Buffer,
  windowBuffer: !!(window as any)?.Buffer,
});

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
