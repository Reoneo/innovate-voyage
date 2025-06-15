
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

// This will be dynamically updated with the project ID from Supabase
export const createWagmiConfig = (projectId: string) => {
  return getDefaultConfig({
    appName: 'Recruitment.box',
    projectId: projectId,
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: false,
  });
};

// Fallback config for initial render
export const config = getDefaultConfig({
  appName: 'Recruitment.box',
  projectId: 'fallback-project-id',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});
