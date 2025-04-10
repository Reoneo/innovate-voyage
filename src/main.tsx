
// Polyfill Buffer first - before any other imports
import { Buffer } from 'buffer';

// Make Buffer globally available
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  console.log("Buffer polyfill initialized:", !!window.Buffer);
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Double-check Buffer is available
if (typeof window !== 'undefined' && !window.Buffer) {
  console.error("Buffer polyfill failed to load!");
} else {
  console.log("Buffer is available:", !!window.Buffer);
}

createRoot(document.getElementById("root")!).render(<App />);
