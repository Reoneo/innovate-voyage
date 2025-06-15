
// Enhanced Buffer polyfill for production compatibility
import { Buffer } from 'buffer';

// More robust Buffer polyfill initialization
if (typeof window !== 'undefined') {
  if (!window.Buffer) {
    window.Buffer = Buffer;
    console.log("Main: Buffer polyfill initialized");
  }
  
  // Ensure global is available for web3 libraries
  if (typeof (window as any).global === 'undefined') {
    (window as any).global = window;
  }
  
  // Ensure process.env exists
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = { env: {} };
  }
}

import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (error) {
  console.error('Failed to initialize app:', error);
  // Fallback render
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
      <div style="text-align: center; padding: 20px;">
        <h2>App failed to load</h2>
        <p>Please refresh the page</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; border: 1px solid #ccc; border-radius: 4px; background: #fff; cursor: pointer;">
          Reload
        </button>
      </div>
    </div>
  `;
}
