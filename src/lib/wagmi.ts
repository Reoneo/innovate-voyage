
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

// Use Vite environment variable (must be defined in .env or Vercel dashboard)
const rainbowkitProjectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
  import.meta.env.VITE_RAINBOWKIT_PROJECT_ID ||
  'YOUR_PROJECT_ID';

let config: any;

const isMissingOrInvalidProjectId =
  !rainbowkitProjectId ||
  rainbowkitProjectId === 'YOUR_PROJECT_ID' ||
  typeof rainbowkitProjectId !== 'string' ||
  (rainbowkitProjectId.trim().length < 10); // Extra check: WalletConnect project IDs are >10 chars

if (isMissingOrInvalidProjectId) {
  // Only warn in the browser, not during SSR
  if (typeof window !== 'undefined') {
    if (!(window as any).__RAINBOWKIT_WARNED__) {
      (window as any).__RAINBOWKIT_WARNED__ = true;
      const msg = [
        'RainbowKit critical error:',
        'Missing or invalid WalletConnect Project ID in src/lib/wagmi.ts.',
        'Set VITE_WALLETCONNECT_PROJECT_ID in your environment variables (.env, Vercel, or Netlify settings).',
        'Visit https://cloud.walletconnect.com to register a WalletConnect project and get a valid ID.',
        'A missing/invalid Project ID disables wallet features.',
      ].join('\n');
      console.error(msg);
      // Optional: Show warning in the DOM (visual but non-blocking)
      const div = document.createElement('div');
      div.innerText = msg;
      div.style.cssText =
        'background:#fee2e2;color:#b91c1c;padding:20px;white-space:pre;font-family:monospace;position:fixed;top:10px;left:10px;z-index:99999;border-radius:8px;';
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 20000);
    }
  }
  // Patch: Provide a config stub with the minimal API Wagmi+RainbowKit expect
  config = {
    chains: [mainnet, polygon, optimism, arbitrum, base],
    connectors: [],
    publicClient: { // fake client with dummy request so RainbowKit components won't crash
      request: async () => { throw new Error('WalletConnect config missing.'); },
    },
    webSocketPublicClient: undefined,
    ssr: false,
    // Include a fake _internal as a stub to prevent errors (fix for ._internal.ssr access)
    _internal: {
      ssr: false,
      // Add any additional minimum property as needed by new RainbowKit releases
    },
  };
} else {
  config = getDefaultConfig({
    appName: 'Recruitment.Box',
    projectId: rainbowkitProjectId,
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: false,
  });
}

export { config };

