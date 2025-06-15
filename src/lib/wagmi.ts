import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

// Use Vite environment variable (must be defined in .env or Vercel dashboard)
const rainbowkitProjectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ||
  import.meta.env.VITE_RAINBOWKIT_PROJECT_ID ||
  'YOUR_PROJECT_ID';

if (
  !rainbowkitProjectId ||
  rainbowkitProjectId === 'YOUR_PROJECT_ID'
) {
  // Warn in the browser and stop app from crashing silently
  // Only warn once: guard against multiple imports
  if (!(window as any).__RAINBOWKIT_WARNED__) {
    (window as any).__RAINBOWKIT_WARNED__ = true;
    // Both dev and prod, surface in the browser console and DOM
    const msg = [
      'RainbowKit critical error:',
      'Missing or invalid WalletConnect Project ID in src/lib/wagmi.ts.',
      'Set VITE_WALLETCONNECT_PROJECT_ID in your environment variables (.env, Vercel, or Netlify settings).',
      'Visit https://cloud.walletconnect.com to register a WalletConnect project and get a valid ID.',
      'A missing/invalid Project ID causes a blank screen in production!',
    ].join('\n');
    console.error(msg);
    // Optional: show warning in the DOM for deployed app
    const div = document.createElement('div');
    div.innerText = msg;
    div.style.cssText =
      'background:#fee2e2;color:#b91c1c;padding:20px;white-space:pre;font-family:monospace;position:fixed;top:10px;left:10px;z-index:99999;border-radius:8px;';
    document.body.appendChild(div);
  }
  // Still export a dummy config so rest of app loads (UI remains unchanged)
}

export const config = getDefaultConfig({
  appName: 'Recruitment.Box',
  projectId: rainbowkitProjectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});
