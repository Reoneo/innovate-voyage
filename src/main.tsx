
// Polyfill Buffer first - before any other imports
import { Buffer } from 'buffer';

// Make Buffer globally available immediately
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  // @ts-ignore - deliberately setting global object property
  window.global = window;
  // @ts-ignore - ensure global.Buffer exists too
  window.global.Buffer = Buffer;
}

// Ensure globalThis has Buffer as well
if (typeof globalThis !== 'undefined') {
  // @ts-ignore
  globalThis.Buffer = Buffer;
}

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("Main: Buffer polyfill initialized:", !!window.Buffer);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
