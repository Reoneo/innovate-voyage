// Polyfill Buffer first - before any other imports
import { Buffer } from 'buffer';

// Make Buffer globally available
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  console.log("Main: Buffer polyfill initialized:", !!window.Buffer);
}

import { createRoot } from 'react-dom/client';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';

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

// WalletConnect v2 Project ID
const projectId = import.meta.env.VITE_WC_PROJECT_ID || "YOUR_PROJECT_ID_FROM_cloud.walletconnect.com";

// Create wagmi config using getDefaultConfig from RainbowKit
const wagmiConfig = getDefaultConfig({
  appName: 'Recruitment.box',
  projectId,
  chains: [mainnet, goerli],
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(),
  },
});

// Create the Web3Modal "bridge" to wagmi - using the chains from wagmi config
const ethereumClient = new EthereumClient(wagmiConfig, [mainnet, goerli]);

// Initialize security measures
initializeSecurity();

const root = createRoot(document.getElementById("root")!);
root.render(
  <WagmiProvider config={wagmiConfig}>
    <RainbowKitProvider>
      <App />
    </RainbowKitProvider>
    <Web3Modal
      projectId={projectId}
      ethereumClient={ethereumClient}
      themeMode="light"
      themeColor="default"
      themeBackground="themeColor"
    />
  </WagmiProvider>
);
