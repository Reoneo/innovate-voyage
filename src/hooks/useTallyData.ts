
import { useState, useEffect } from 'react';

interface TallyData {
  votingPower: string;
  delegations: number;
  daoName: string;
}

export function useTallyData(walletAddress?: string) {
  const [tallyData, setTallyData] = useState<TallyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTallyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // This would normally be an actual API call to Tally
        // For now, we're using mock data based on the provided screenshot
        // In a real implementation, you'd replace this with an actual API call

        // Sample response format based on the address provided
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));

        if (walletAddress === "823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988") {
          setTallyData({
            votingPower: "<0.01 (0.00%)",
            delegations: 1,
            daoName: "ENS"
          });
        } else {
          // Default data for other addresses
          setTallyData({
            votingPower: "0.00 (0.00%)",
            delegations: 0,
            daoName: "ENS"
          });
        }
      } catch (err) {
        console.error('Error fetching Tally data:', err);
        setError('Failed to fetch DAO data');
        setTallyData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTallyData();
  }, [walletAddress]);

  return { tallyData, isLoading, error };
}
