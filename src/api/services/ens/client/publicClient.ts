
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Create a public client for ENS resolution
export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://ethereum-rpc.publicnode.com')
});

// URL for ENS API - updated to use the deployed API URL
export const ENS_API_URL = 'https://ens-api.vercel.app';
