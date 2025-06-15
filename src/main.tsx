
// Import and setup Buffer polyfill FIRST
import { Buffer } from 'buffer';

// Set up global polyfills immediately and aggressively
(globalThis as any).Buffer = Buffer;
(globalThis as any).global = globalThis;
(globalThis as any).process = {
  env: {},
  version: 'v18.0.0',
  browser: true,
  nextTick: (fn: Function) => setTimeout(fn, 0)
};

// Also set on window for extra safety
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

// Force Buffer to be available in all contexts
Object.defineProperty(globalThis, 'Buffer', {
  value: Buffer,
  writable: false,
  configurable: false
});

console.log("Global polyfills setup:", {
  Buffer: typeof Buffer,
  globalBuffer: typeof (globalThis as any).Buffer,
  windowBuffer: typeof (window as any)?.Buffer,
  BufferConstructor: Buffer?.constructor?.name,
});

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
