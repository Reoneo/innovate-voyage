
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Polyfill Buffer for browser compatibility with XMTP
import { Buffer as BufferPolyfill } from 'buffer';

// Make Buffer globally available before any other imports that might need it
(window as any).Buffer = BufferPolyfill;
(globalThis as any).Buffer = BufferPolyfill;
(globalThis as any).global = globalThis;

// Also ensure process is available for some dependencies
(window as any).process = { env: {} };
(globalThis as any).process = { env: {} };

console.log("Buffer polyfill initialized:", !!(window as any).Buffer, !!(globalThis as any).Buffer);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
