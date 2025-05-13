
import { useState, useEffect } from 'react';
import { TallyData } from '@/types/tally';
import { fetchTallyData } from '@/services/tallyService';

export function useTallyData(walletAddress?: string) {
  const [tallyData, setTallyData] = useState<TallyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the provided API key
        const tallyKey = '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988';
        
        const data = await fetchTallyData(tallyKey, walletAddress);
        setTallyData(data);
      } catch (err) {
        console.error("Error fetching Tally data:", err);
        setError("Failed to fetch DAO data");
        setTallyData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
  }, [walletAddress]);

  return { tallyData, isLoading, error };
}
