
// Polyfill Buffer first - before any other imports
import { Buffer } from 'buffer';

// Make Buffer globally available
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css'; // Make sure Tailwind/global styles import is correct!

if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

// Provide global property to fix dependencies that expect "global"
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  // @ts-ignore
  window.global = window;
  // @ts-ignore
  if (window.global && !window.global.Buffer) {
    window.global.Buffer = window.Buffer;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found! App will not render.');
}
