
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

console.log('Wagmi: Initializing configuration');

// Enhanced project ID handling with better fallback
const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID || '0000000000000000000000000000000000000000';

console.log('Wagmi config initialized with project ID:', projectId);

try {
  export const config = getDefaultConfig({
    appName: 'Recruitment.box',
    projectId: projectId,
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: false,
  });
  
  console.log('Wagmi: Configuration created successfully');
} catch (error) {
  console.error('Wagmi: Error creating configuration:', error);
  
  // Create a minimal fallback config
  import { createConfig, http } from 'wagmi';
  
  export const config = createConfig({
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
  });
  
  console.log('Wagmi: Using fallback configuration');
}
