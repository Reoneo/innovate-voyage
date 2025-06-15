
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

// Add more detailed error handling for imports
console.log('Main: About to import React and App component');

let createRoot, App;

try {
  console.log('Main: Importing createRoot from react-dom/client');
  const reactDomClient = await import('react-dom/client');
  createRoot = reactDomClient.createRoot;
  console.log('Main: createRoot imported successfully');
} catch (error) {
  console.error('Main: Failed to import createRoot:', error);
  throw error;
}

try {
  console.log('Main: Importing App component');
  const appModule = await import('./App.tsx');
  App = appModule.default;
  console.log('Main: App component imported successfully');
} catch (error) {
  console.error('Main: Failed to import App component:', error);
  throw error;
}

try {
  console.log('Main: Importing CSS');
  await import('./index.css');
  console.log('Main: CSS imported successfully');
} catch (error) {
  console.error('Main: Failed to import CSS:', error);
  // Don't throw for CSS errors, just log them
}

console.log('Main: All imports complete');

// Verify Buffer is still available after imports
if (typeof window !== 'undefined' && !window.Buffer) {
  console.error('Main: Buffer was lost after imports, attempting to restore...');
  setupGlobalBuffer();
}

console.log('Main: Final Buffer check - available:', typeof window !== 'undefined' ? !!window.Buffer : 'N/A (not in browser)');

// Enhanced root element check and creation
try {
  console.log('Main: Looking for root element');
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('Main: Root element not found in DOM');
    throw new Error('Root element not found');
  }
  console.log('Main: Root element found:', rootElement);
  
  console.log('Main: Creating React root');
  const root = createRoot(rootElement);
  console.log('Main: React root created successfully');
  
  console.log('Main: About to render App component');
  
  // Wrap App in additional error boundary for main.tsx level errors
  const AppWithErrorBoundary = () => {
    try {
      return React.createElement(App);
    } catch (error) {
      console.error('Main: Error creating App element:', error);
      return React.createElement('div', { 
        style: { 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh', 
          flexDirection: 'column', 
          fontFamily: 'system-ui',
          padding: '20px',
          textAlign: 'center'
        } 
      }, [
        React.createElement('h1', { 
          key: 'title',
          style: { color: '#ef4444', marginBottom: '1rem' } 
        }, 'Application Error'),
        React.createElement('p', { 
          key: 'message',
          style: { color: '#6b7280', marginBottom: '1rem' } 
        }, 'Failed to initialize the application.'),
        React.createElement('pre', { 
          key: 'error',
          style: { 
            background: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#374151',
            maxWidth: '600px',
            overflow: 'auto'
          } 
        }, error.toString()),
        React.createElement('button', { 
          key: 'reload',
          onClick: () => window.location.reload(),
          style: { 
            padding: '0.5rem 1rem', 
            background: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.375rem', 
            cursor: 'pointer',
            marginTop: '1rem'
          } 
        }, 'Reload Page')
      ]);
    }
  };
  
  // Import React for createElement
  const React = await import('react');
  
  root.render(React.createElement(AppWithErrorBoundary));
  
  console.log('Main: App render complete');
} catch (error) {
  console.error('Main: Fatal error during app initialization:', error);
  
  // More detailed fallback error display
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; flex-direction: column; font-family: system-ui; padding: 20px;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Application Initialization Error</h1>
        <p style="color: #6b7280; margin-bottom: 1rem;">Failed to initialize the application.</p>
        <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.375rem; font-size: 0.875rem; color: #374151; max-width: 600px; overflow: auto; margin-bottom: 1rem;">${error.toString()}</pre>
        <p style="color: #6b7280; margin-bottom: 1rem; font-size: 0.875rem;">Check the browser console for more details.</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  } else {
    console.error('Main: Could not find root element for fallback display');
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; flex-direction: column; font-family: system-ui; padding: 20px;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Critical Application Error</h1>
        <p style="color: #6b7280; margin-bottom: 1rem;">The application failed to start and the root element could not be found.</p>
        <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.375rem; font-size: 0.875rem; color: #374151; max-width: 600px; overflow: auto; margin-bottom: 1rem;">${error.toString()}</pre>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}
