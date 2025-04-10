
// Import Buffer polyfill first
import { Buffer } from 'buffer';

// Make Buffer available globally before any other imports
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure Buffer is definitely available before rendering
if (typeof window !== 'undefined') {
  console.log("Buffer polyfill loaded:", !!window.Buffer);
}

createRoot(document.getElementById("root")!).render(<App />);
