
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { addEnsContracts } from '@ensdomains/ensjs';

// Create a simple, clean ENS client
export const ensClient = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http('https://cloudflare-eth.com'),
});

// Fallback client for reliability
export const fallbackEnsClient = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http('https://ethereum.publicnode.com'),
});
