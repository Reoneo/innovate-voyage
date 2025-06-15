
// Polyfill Buffer IMMEDIATELY - before any other imports
import { Buffer } from 'buffer';

// Set up Buffer globally before anything else
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).global = globalThis;
}

if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = globalThis;
  (window as any).process = { env: {} };
}

// Ensure process is available
(globalThis as any).process = { env: {} };

// Log to confirm setup
console.log("Buffer polyfill setup complete:", {
  globalThis: !!(globalThis as any).Buffer,
  window: !!(window as any)?.Buffer,
  bufferFrom: typeof Buffer?.from === 'function'
});

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
