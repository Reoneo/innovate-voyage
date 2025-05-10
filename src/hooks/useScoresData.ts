
import { useState, useEffect } from 'react';

export function useScoresData(walletAddress: string) {
  const [score, setScore] = useState<number | null>(null);
  const [txCount, setTxCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch in parallel to improve performance
        await Promise.all([
          fetchTalentScore(),
          fetchEtherscanData()
        ]);
      } catch (error) {
        console.error('Error fetching scores data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch Talent Protocol Score
    const fetchTalentScore = async () => {
      try {
        const response = await fetch(
          `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
          {
            headers: {
              "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
            },
            cache: 'no-store'  // Ensure no caching
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log("Talent Protocol data:", data);
          setScore(data.score?.points ?? null);
        } else {
          console.error(`Talent Protocol API error: ${response.status}`);
        }
      } catch (err) {
        console.error("Failed to fetch talent score:", err);
      }
    };

    // Fetch Transaction Count
    const fetchEtherscanData = async () => {
      try {
        const etherscanResp = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM`,
          { cache: "no-cache" }
        );

        if (etherscanResp.ok) {
          const etherscanData = await etherscanResp.json();
          if (etherscanData.status === '1') {
            setTxCount(etherscanData.result.length);
          }
        } else {
          console.error("Etherscan API error:", etherscanResp.status);
        }
      } catch (err) {
        console.error("Failed to fetch transaction count:", err);
      }
    };

    fetchData();
  }, [walletAddress]);

  return { score, txCount, loading };
}
