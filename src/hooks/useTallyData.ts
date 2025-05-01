
import { useState, useEffect } from 'react';

interface TallyData {
  daoName: string;
  daoSymbol: string;
  daoIcon?: string;
  votingPower: string;
  receivedDelegations: string;
  delegatingTo?: string;
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
        // This is a placeholder implementation since we don't have a real API
        // In a real implementation, you would fetch data from Tally's API
        // For now, we'll just wait for a moment and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Using the provided key as a parameter
        const tallyKey = '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988';
        
        // Mock response data based on the screenshot
        setTallyData({
          daoName: "ENS",
          daoSymbol: "ENS",
          daoIcon: "https://raw.githubusercontent.com/ensdomains/media/master/icons/ENS.png",
          votingPower: "<0.01 (0.00%)",
          receivedDelegations: "1 addresses delegating"
        });
      } catch (err) {
        console.error("Error fetching Tally data:", err);
        setError("Failed to fetch DAO data");
        setTallyData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTallyData();
    
    // Don't add tallyData to the dependency array to prevent infinite loop
  }, [walletAddress]);

  return { tallyData, isLoading, error };
}
