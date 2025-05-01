
import { useState, useEffect } from 'react';

interface TallyData {
  daoName: string;
  daoSymbol: string;
  daoIcon?: string;
  votingPower: string;
  receivedDelegations: string;
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
        // This is a placeholder implementation since we don't have a real API
        // In a real implementation, you would fetch data from Tally's API
        // For now, we'll just wait for a moment and return mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Using the provided key as a parameter
        const tallyKey = '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988';
        
        // Generate dynamic mock data based on wallet address
        // Use the last 4 characters of the address to create some variation
        const addressSuffix = walletAddress.slice(-4);
        const addressNum = parseInt(addressSuffix, 16) % 100; // Convert to number between 0-99
        
        // Pick a DAO based on wallet address
        const daoOptions = [
          {
            name: "ENS",
            symbol: "ENS",
            icon: "https://raw.githubusercontent.com/ensdomains/media/master/icons/ENS.png"
          },
          {
            name: "Uniswap",
            symbol: "UNI",
            icon: "https://cryptologos.cc/logos/uniswap-uni-logo.png"
          },
          {
            name: "Aave",
            symbol: "AAVE",
            icon: "https://cryptologos.cc/logos/aave-aave-logo.png"
          }
        ];
        
        const daoIndex = parseInt(addressSuffix.substring(0, 2), 16) % daoOptions.length;
        const selectedDao = daoOptions[daoIndex];
        
        // Generate voting power based on wallet address
        const votingPower = addressNum < 10 ? 
          `${(addressNum / 100).toFixed(2)} (${addressNum}%)` : 
          `<0.01 (0.00%)`;
        
        // Generate delegation data based on wallet
        const delegationsCount = (parseInt(addressSuffix.substring(2, 4), 16) % 5);
        
        // Generate list of delegators (people delegating to this wallet)
        const delegators = Array.from({ length: delegationsCount }).map((_, index) => {
          const randomPower = ((Math.random() * 0.01) + 0.001).toFixed(4);
          const randomPercentage = (Math.random() * 0.1).toFixed(2);
          return {
            address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
            votingPower: `${randomPower} (${randomPercentage}%)`
          };
        });
        
        const receivedDelegations = delegationsCount === 0 ? 
          "No delegations" : 
          `${delegationsCount} addresses delegating`;
        
        // Generate list of delegations (addresses this wallet is delegating to)
        const delegationCount = parseInt(addressSuffix.substring(0, 1), 16) % 3;
        const delegations = Array.from({ length: delegationCount }).map((_, index) => {
          const randomPower = ((Math.random() * 0.01) + 0.001).toFixed(4);
          const randomPercentage = (Math.random() * 0.1).toFixed(2);
          return {
            address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
            votingPower: `${randomPower} (${randomPercentage}%)`
          };
        });
        
        // Sometimes add delegating to info
        const hasDelegation = delegationCount > 0;
        const delegatingTo = hasDelegation ? 
          `0x${addressSuffix}...${addressSuffix.substring(0, 4)}` : 
          undefined;
        
        setTallyData({
          daoName: selectedDao.name,
          daoSymbol: selectedDao.symbol,
          daoIcon: selectedDao.icon,
          votingPower,
          receivedDelegations,
          delegatingTo,
          delegators: delegators.length > 0 ? delegators : undefined,
          delegations: delegations.length > 0 ? delegations : undefined
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
    
  }, [walletAddress]); // Only depend on walletAddress to trigger refresh

  return { tallyData, isLoading, error };
}
