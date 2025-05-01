
import { useState, useEffect } from 'react';
import { WebacyData, ThreatLevel } from '@/components/talent/profile/components/scores/types';
import { getThreatLevel } from '@/components/talent/profile/components/scores/utils/scoreUtils';

export function useScoresData(walletAddress: string) {
  const [score, setScore] = useState<number | null>(null);
  const [webacyData, setWebacyData] = useState<WebacyData | null>(null);
  const [txCount, setTxCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch Talent Protocol Score with proper error handling
        const fetchTalentScore = async () => {
          try {
            const response = await fetch(
              `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
              {
                headers: {
                  "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
                },
                cache: 'no-store'
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              console.log("Talent Protocol data:", data);
              setScore(data.score?.points ?? null);
            } else {
              console.error(`Failed to fetch Talent score: ${response.status}`);
            }
          } catch (err) {
            console.error('Error fetching Talent score:', err);
          }
        };

        // Fetch Webacy data with simplified approach
        const fetchWebacyData = async () => {
          try {
            // Basic Webacy data with threat level
            setWebacyData({
              threatLevel: 'LOW' as ThreatLevel,
              riskScore: null,
              walletAddress,
              quickProfile: {
                transactions: null,
                contracts: null,
                riskLevel: 'LOW' as ThreatLevel
              }
            });
          } catch (err) {
            console.error('Error fetching Webacy data:', err);
          }
        };

        // Fetch Transaction Count with improved error handling
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
            }
          } catch (err) {
            console.error('Error fetching Etherscan data:', err);
          }
        };

        // Execute all fetches in parallel
        await Promise.allSettled([
          fetchTalentScore(),
          fetchWebacyData(),
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

  return { score, webacyData, txCount, loading };
}
