
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { addEnsContracts } from '@ensdomains/ensjs';

// Create optimized viem client with ENS contracts
export const ensClient = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http('https://eth-mainnet.g.alchemy.com/v2/demo'),
  batch: {
    multicall: true,
  },
});

// Alternative RPC endpoints for fallback
export const fallbackClients = [
  createPublicClient({
    chain: addEnsContracts(mainnet),
    transport: http('https://cloudflare-eth.com'),
    batch: { multicall: true },
  }),
  createPublicClient({
    chain: addEnsContracts(mainnet),
    transport: http('https://ethereum.publicnode.com'),
    batch: { multicall: true },
  })
];
