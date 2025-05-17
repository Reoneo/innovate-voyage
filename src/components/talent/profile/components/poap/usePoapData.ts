
import { useState, useEffect } from 'react';
import { fetchPoapsByAddress, fetchPoapEventOwners, type Poap } from '@/api/services/poapService';

export function usePoapData(walletAddress?: string) {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPoap, setSelectedPoap] = useState<Poap | null>(null);
  const [poapOwners, setPoapOwners] = useState<any[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [currentPoapIndex, setCurrentPoapIndex] = useState(0);

  // Fetch POAPs for a wallet address
  useEffect(() => {
    if (!walletAddress) return;
    
    const loadPoaps = async () => {
      setIsLoading(true);
      try {
        const fetchedPoaps = await fetchPoapsByAddress(walletAddress);
        const sortedPoaps = [...fetchedPoaps].sort((a, b) => {
          const aSupply = a.event.supply ?? 999999;
          const bSupply = b.event.supply ?? 999999;
          return aSupply - bSupply;
        });
        setPoaps(sortedPoaps);
      } catch (error) {
        console.error('Error loading POAPs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPoaps();
  }, [walletAddress]);

  // Load POAP owners
  const loadPoapOwners = async (eventId: number) => {
    if (!eventId) return;
    setLoadingOwners(true);
    try {
      const owners = await fetchPoapEventOwners(eventId);
      if (owners && owners.length > 0) {
        setPoapOwners(owners);
      } else {
        setPoapOwners([]);
      }
    } catch (error) {
      console.error('Error loading POAP owners:', error);
      setPoapOwners([]);
    } finally {
      setLoadingOwners(false);
    }
  };

  return {
    poaps,
    isLoading,
    currentPoapIndex,
    setCurrentPoapIndex,
    selectedPoap,
    setSelectedPoap,
    poapOwners,
    loadingOwners,
    loadPoapOwners
  };
}
