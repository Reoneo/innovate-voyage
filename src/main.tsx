
// Polyfill Buffer IMMEDIATELY - before any other imports
import { Buffer } from 'buffer';

// Set up Buffer and process globally before anything else
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).global = globalThis;
  (globalThis as any).process = (globalThis as any).process || { env: {} };
}

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = globalThis;
  (window as any).process = (window as any).process || { env: {} };
}

// Double-check Buffer is available
if (typeof Buffer === 'undefined') {
  throw new Error('Buffer polyfill failed to load');
}

console.log("Buffer polyfill setup complete:", {
  Buffer: typeof Buffer,
  BufferFrom: typeof Buffer.from,
  globalBuffer: !!(globalThis as any).Buffer,
  windowBuffer: !!(window as any)?.Buffer,
});

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
