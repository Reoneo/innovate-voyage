
import { getEnsData } from '@/utils/ensResolver';
import { EfpPerson } from '@/hooks/useEfpStats';

export async function resolveUserDetails(addresses: string[]): Promise<EfpPerson[]> {
  const results: EfpPerson[] = [];
  
  // Process in chunks to avoid overwhelming the API
  const chunkSize = 5;
  for (let i = 0; i < addresses.length; i += chunkSize) {
    const chunk = addresses.slice(i, i + chunkSize);
    const promises = chunk.map(async (addr) => {
      const { ensName, avatar } = await getEnsData(addr);
      return { address: addr, ensName, avatar };
    });
    
    const resolvedChunk = await Promise.all(promises);
    results.push(...resolvedChunk);
  }
  
  return results;
}
