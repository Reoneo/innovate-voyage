
import { Buffer } from 'buffer';

// Make Buffer globally available
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  console.log("Main: Buffer polyfill initialized:", !!window.Buffer);
}

import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import App from './App.tsx';
import './index.css';

// Double-check Buffer is available
if (typeof window !== 'undefined' && !window.Buffer) {
  console.error("Buffer polyfill failed to load!");
  window.Buffer = Buffer;
  console.log("Main: Buffer retry result:", !!window.Buffer);
} else {
  console.log("Main: Buffer is available:", !!window.Buffer);
}

// Workaround to make Buffer globally available for dependencies that use it
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  // @ts-ignore - setting window.global
  window.global = window;
  // @ts-ignore - ensure global.Buffer exists too
  if (window.global && !window.global.Buffer) {
    window.global.Buffer = window.Buffer;
  }
}

// WalletConnect v2 Project ID
const projectId = import.meta.env.VITE_WC_PROJECT_ID || "YOUR_PROJECT_ID_FROM_cloud.walletconnect.com";

// Create wagmi config using getDefaultConfig from RainbowKit
const wagmiConfig = getDefaultConfig({
  appName: 'Recruitment.box',
  projectId,
  chains: [mainnet, goerli],
});

const root = createRoot(document.getElementById("root")!);
root.render(
  <WagmiProvider config={wagmiConfig}>
    <RainbowKitProvider>
      <App />
    </RainbowKitProvider>
  </WagmiProvider>
);
