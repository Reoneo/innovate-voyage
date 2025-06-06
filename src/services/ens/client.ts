
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { addEnsContracts } from '@ensdomains/ensjs';

// Create viem client with ENS contracts
export const ensClient = createPublicClient({
  chain: addEnsContracts(mainnet),
  transport: http('https://eth-mainnet.g.alchemy.com/v2/demo')
});
