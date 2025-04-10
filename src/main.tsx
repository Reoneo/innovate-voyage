
// Polyfill Buffer first - before any other imports
import { Buffer } from 'buffer';

// Make Buffer globally available
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  console.log("Main: Buffer polyfill initialized:", !!window.Buffer);
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Double-check Buffer is available
if (typeof window !== 'undefined' && !window.Buffer) {
  console.error("Buffer polyfill failed to load!");
  // Try to set it one more time
  window.Buffer = Buffer;
  console.log("Main: Buffer retry result:", !!window.Buffer);
} else {
  console.log("Main: Buffer is available:", !!window.Buffer);
}

createRoot(document.getElementById("root")!).render(<App />);
