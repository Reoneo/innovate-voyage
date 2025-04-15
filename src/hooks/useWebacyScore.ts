
import { useState, useEffect } from 'react';

interface WebacyScore {
  score?: number;
  approvals?: number;
  profileData?: any;
  loading: boolean;
  error: string | null;
}

export function useWebacyScore(walletAddress?: string) {
  const [data, setData] = useState<WebacyScore>({
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!walletAddress) return;

    const fetchWebacyData = async () => {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Add a cache-busting parameter to ensure fresh data
        const timestamp = new Date().getTime();
        const headers = {
          'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
          'Content-Type': 'application/json'
        };
        
        // Fetch wallet score
        const scoreResponse = await fetch(
          `https://api.webacy.com/addresses/${walletAddress}?ts=${timestamp}`, 
          { headers }
        );
        
        // Fetch approvals
        const approvalsResponse = await fetch(
          `https://api.webacy.com/addresses/${walletAddress}/approvals?ts=${timestamp}`, 
          { headers }
        );
        
        // Fetch profile data
        const profileResponse = await fetch(
          `https://api.webacy.com/quick-profile/${walletAddress}?ts=${timestamp}`, 
          { headers }
        );
        
        if (!scoreResponse.ok || !approvalsResponse.ok || !profileResponse.ok) {
          throw new Error('Failed to fetch Webacy data');
        }
        
        const scoreData = await scoreResponse.json();
        const approvalsData = await approvalsResponse.json();
        const profileData = await profileResponse.json();
        
        setData({
          score: scoreData.score,
          approvals: approvalsData.length,
          profileData: profileData,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching Webacy data:', error);
        setData({
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error fetching Webacy data'
        });
      }
    };
    
    fetchWebacyData();
  }, [walletAddress]);

  return data;
}
