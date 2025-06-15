
// Enhanced Buffer polyfill - more robust for production
import { Buffer } from 'buffer';

console.log('Main.tsx: Starting application initialization');

// Enhanced global Buffer setup
const setupGlobalBuffer = () => {
  try {
    if (typeof window !== 'undefined') {
      // Set up Buffer on window
      if (!window.Buffer) {
        window.Buffer = Buffer;
        console.log('Main: Buffer polyfill set on window');
      }
      
      // Set up global on window if it doesn't exist
      if (!window.global) {
        window.global = window;
        console.log('Main: global set to window');
      }
      
      // Ensure global.Buffer exists
      if (window.global && !window.global.Buffer) {
        window.global.Buffer = Buffer;
        console.log('Main: Buffer set on global');
      }
      
      console.log('Main: Buffer setup complete - Buffer available:', !!window.Buffer);
      return true;
    }
  } catch (error) {
    console.error('Main: Error setting up Buffer polyfill:', error);
    return false;
  }
};

// Set up Buffer immediately
const bufferSetupSuccess = setupGlobalBuffer();

if (!bufferSetupSuccess) {
  console.error('Main: Failed to set up Buffer polyfill');
}

import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main: Importing React and App component complete');

// Verify Buffer is still available after imports
if (typeof window !== 'undefined' && !window.Buffer) {
  console.error('Main: Buffer was lost after imports, attempting to restore...');
  setupGlobalBuffer();
}

console.log('Main: Final Buffer check - available:', typeof window !== 'undefined' ? !!window.Buffer : 'N/A (not in browser)');

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('Main: Creating React root');
  const root = createRoot(rootElement);
  
  console.log('Main: Rendering App component');
  root.render(<App />);
  
  console.log('Main: App render complete');
} catch (error) {
  console.error('Main: Fatal error during app initialization:', error);
  
  // Fallback error display
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; flex-direction: column; font-family: system-ui;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Error</h1>
        <p style="color: #6b7280; margin-bottom: 1rem;">Failed to initialize the application.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}
