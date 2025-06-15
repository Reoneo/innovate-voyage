
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

// Use a default project ID or handle gracefully if not provided
const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID || '0000000000000000000000000000000000000000';

console.log('Wagmi config initialized with project ID:', projectId);

export const config = getDefaultConfig({
  appName: 'Recruitment.box',
  projectId: projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});
