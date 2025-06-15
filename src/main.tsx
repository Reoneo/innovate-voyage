
// Polyfill Buffer first - before any other imports
import { Buffer } from 'buffer';

// Make Buffer globally available
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  console.log("Main: Buffer polyfill initialized:", !!window.Buffer);
}

import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Double-check Buffer is available
if (typeof window !== 'undefined' && !window.Buffer) {
  console.error("Buffer polyfill failed to load!");
  // Try to set it one more time
  window.Buffer = Buffer;
  console.log("Main: Buffer retry result:", !!window.Buffer);
} else {
  console.log("Main: Buffer is available:", !!window.Buffer);
}

// Workaround to make Buffer globally available for dependencies that use it
// @ts-ignore - deliberately setting global object property
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  // @ts-ignore - setting window.global
  window.global = window;
  // @ts-ignore - ensure global.Buffer exists too
  if (window.global && !window.global.Buffer) {
    window.global.Buffer = window.Buffer;
  }
}

// Global error logging for blank screen debugging
if (typeof window !== 'undefined') {
  window.onerror = function (message, source, lineno, colno, error) {
    console.error("Global error:", { message, source, lineno, colno, error });
    const errorDiv = document.createElement('div');
    errorDiv.style.background = "#fee2e2";
    errorDiv.style.color = "#dc2626";
    errorDiv.style.padding = "16px";
    errorDiv.style.position = "fixed";
    errorDiv.style.top = "20px";
    errorDiv.style.right = "20px";
    errorDiv.style.zIndex = "9999";
    errorDiv.style.fontFamily = "monospace";
    errorDiv.innerText = "Global error: " + message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 15000);
    return false; // Let browser log as well
  };
  window.onunhandledrejection = function (event) {
    console.error("Unhandled promise rejection:", event.reason);
    const errorDiv = document.createElement('div');
    errorDiv.style.background = "#fee2e2";
    errorDiv.style.color = "#dc2626";
    errorDiv.style.padding = "16px";
    errorDiv.style.position = "fixed";
    errorDiv.style.top = "46px";
    errorDiv.style.right = "20px";
    errorDiv.style.zIndex = "9999";
    errorDiv.style.fontFamily = "monospace";
    errorDiv.innerText = "Unhandled rejection: " + (event.reason && event.reason.toString ? event.reason.toString() : "Unknown error");
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 15000);
  };
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
