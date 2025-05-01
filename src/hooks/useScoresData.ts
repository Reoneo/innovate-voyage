
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
        // Fetch Talent Protocol Score
        const fetchTalentScore = async (retries = 2) => {
          for (let i = 0; i <= retries; i++) {
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
                return;
              }
              
              console.error(`Attempt ${i + 1} failed for Talent Protocol`);
              if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
            } catch (err) {
              console.error(`Attempt ${i + 1} failed:`, err);
              if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
            }
          }
        };

        // Fetch Transaction Count with improved error handling
        const fetchEtherscanData = async (retries = 2) => {
          for (let i = 0; i <= retries; i++) {
            try {
              const etherscanResp = await fetch(
                `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM`,
                { cache: "no-cache" }
              );

              if (etherscanResp.ok) {
                const etherscanData = await etherscanResp.json();
                if (etherscanData.status === '1') {
                  setTxCount(etherscanData.result.length);
                  return;
                }
              }
              console.error(`Attempt ${i + 1} failed for Etherscan`);
              if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
            } catch (err) {
              console.error(`Attempt ${i + 1} failed:`, err);
              if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
            }
          }
        };

        // Execute all fetches in parallel
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

    fetchData();
  }, [walletAddress]);

  return { score, txCount, loading };
}
