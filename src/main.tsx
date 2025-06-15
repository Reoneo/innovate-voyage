
// Polyfill Buffer first - before any other imports
import { Buffer } from 'buffer';

// Make Buffer globally available immediately before any other code runs
(function() {
  if (typeof globalThis !== 'undefined') {
    // @ts-ignore
    globalThis.Buffer = Buffer;
    // @ts-ignore
    globalThis.global = globalThis;
  }
  
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.Buffer = Buffer;
    // @ts-ignore
    window.global = window;
    // @ts-ignore
    window.global.Buffer = Buffer;
  }
  
  // Also set on the global object if it exists
  if (typeof global !== 'undefined') {
    // @ts-ignore
    global.Buffer = Buffer;
  }
})();

console.log("Main: Buffer polyfill initialized:", !!globalThis.Buffer, !!window?.Buffer);

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
