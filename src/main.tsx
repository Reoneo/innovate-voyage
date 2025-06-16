
// Import and setup Buffer polyfill FIRST
import { Buffer } from 'buffer';

console.log("main.tsx: Starting Buffer polyfill setup");

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

console.log("main.tsx: Global polyfills setup:", {
  Buffer: typeof Buffer,
  globalBuffer: typeof (globalThis as any).Buffer,
  windowBuffer: typeof (window as any)?.Buffer,
  BufferConstructor: Buffer?.constructor?.name,
});

console.log("main.tsx: About to import React and App");

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

console.log("main.tsx: Imports completed");

const rootElement = document.getElementById("root");
console.log("main.tsx: Root element found:", !!rootElement);

if (!rootElement) {
  console.error("main.tsx: Root element not found!");
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
console.log("main.tsx: Root created, about to render App");

try {
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  console.log("main.tsx: App rendered successfully");
} catch (error) {
  console.error("main.tsx: Error rendering App:", error);
  throw error;
}
