
import { useEffect } from 'react';
import { useEfpStats } from '@/hooks/useEfpStats';
import { getEnsLinks } from '@/utils/ens/ensLinks';

export function useDataPreloader(walletAddress?: string, ensName?: string) {
  // Preload EFP data
  const efpStats = useEfpStats(walletAddress);
  
  useEffect(() => {
    // Preload ENS social links without blocking
    if (ensName) {
      getEnsLinks(ensName).catch(console.error);
    }
  }, [ensName]);
  
  return {
    efpStats,
    preloadComplete: true
  };
}
