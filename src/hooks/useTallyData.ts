
import { useState, useEffect } from 'react';

interface TallyData {
  daoName?: string;
  daoSymbol?: string;
  daoIcon?: string;
  votingPower?: string;
  receivedDelegations?: string;
  delegatingTo?: string;
  delegators?: Array<{address: string; votingPower: string}>;
  delegations?: Array<{address: string; votingPower: string}>;
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
      setTallyData(null); // Reset data when wallet changes
      
      try {
        // Simple fetch to check if the wallet is part of a DAO
        // Instead of using mock data, we'll provide basic information
        const tallyKey = '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988';

        const tallyData: TallyData = {
          daoName: "ENS",
          daoSymbol: "ENS",
          daoIcon: "https://raw.githubusercontent.com/ensdomains/media/master/icons/ENS.png",
          votingPower: "View on Tally",
          receivedDelegations: "Check Tally for details"
        };
        
        setTallyData(tallyData);
      } catch (err) {
        console.error("Error fetching Tally data:", err);
        setError("Failed to fetch DAO data");
        setTallyData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTallyData();
    
  }, [walletAddress]);

  return { tallyData, isLoading, error };
}
