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
        // Fetch Talent Protocol Score with retry
        const fetchTalentScore = async (retries = 2) => {
          for (let i = 0; i <= retries; i++) {
            try {
              const response = await fetch(
                `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
                {
                  headers: {
                    "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
                  }
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

        // Fetch Webacy data with chain parameter
        const fetchWebacyData = async (retries = 2) => {
          for (let i = 0; i <= retries; i++) {
            try {
              const [profileResp, addressResp] = await Promise.all([
                fetch(`https://api.webacy.com/quick-profile/${walletAddress}?chain=eth`, {
                  headers: {
                    'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
                    'accept': 'application/json',
                    'Key-ID': 'eujjkt9ao5'
                  }
                }),
                fetch(`https://api.webacy.com/addresses/${walletAddress}?chain=eth`, {
                  headers: {
                    'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
                    'accept': 'application/json',
                    'Key-ID': 'eujjkt9ao5'
                  }
                })
              ]);

              if (profileResp.ok && addressResp.ok) {
                const [profileData, addressData] = await Promise.all([
                  profileResp.json(),
                  addressResp.json()
                ]);

                const riskScore = addressData.data?.riskScore;
                const threatLevel = getThreatLevel(riskScore);

                setWebacyData({
                  riskScore,
                  threatLevel,
                  walletAddress,
                  approvals: {
                    count: profileData.numContracts || 0,
                    riskyCount: 0
                  },
                  quickProfile: {
                    transactions: profileData.numTransactions || 0,
                    contracts: profileData.numContracts || 0,
                    riskLevel: threatLevel
                  }
                });
                return;
              }

              console.error(`Attempt ${i + 1} failed for Webacy`);
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
