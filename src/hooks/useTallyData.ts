
import { useState, useEffect } from 'react';
import { TallyData } from '@/types/tally';
import { fetchTallyData } from '@/services/tallyService';

export function useTallyData(walletAddress?: string) {
  const [tallyData, setTallyData] = useState<TallyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      console.log('🔍 No wallet address provided to useTallyData');
      setTallyData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      console.log('🎬 useTallyData: Starting fetch for:', walletAddress);
      setIsLoading(true);
      setError(null);
      
      try {
        const tallyKey = '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988';
        const data = await fetchTallyData(tallyKey, walletAddress);
        
        console.log('📦 useTallyData: Data received:', data);
        setTallyData(data);
        
        if (!data) {
          console.log('⚠️ useTallyData: No governance data found');
          setError("No governance data found for this address");
        } else {
          console.log('✅ useTallyData: Successfully set data');
        }
      } catch (err) {
        console.error("💥 useTallyData: Error fetching data:", err);
        setError("Failed to fetch governance data from Tally");
        setTallyData(null);
      } finally {
        setIsLoading(false);
        console.log('🏁 useTallyData: Fetch completed');
      }
    };
    
    fetchData();
    
  }, [walletAddress]);

  return { tallyData, isLoading, error };
}
