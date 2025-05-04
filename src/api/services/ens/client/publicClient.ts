
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Create a public client for ENS resolution
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://ethereum-rpc.publicnode.com')
});

// URL for ENS API - updated to use a public API endpoint
export const ENS_API_URL = 'https://api.ensideas.com/ens';
