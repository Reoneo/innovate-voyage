
import { useState, useEffect } from 'react';
import { WebacyData, ThreatLevel } from '@/components/talent/profile/components/scores/types';
import { getThreatLevel } from '@/components/talent/profile/components/scores/utils/scoreUtils';

export function useScoresData(walletAddress: string) {
  const [score, setScore] = useState<number | null>(null);
  const [webacyData, setWebacyData] = useState<WebacyData | null>(null);
  const [txCount, setTxCount] = useState<number | null>(null);
  const [githubPoints, setGithubPoints] = useState<number | undefined>(undefined);
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
                
                // Extract GitHub points from score breakdown
                if (data.score?.breakdown) {
                  const githubBreakdown = data.score.breakdown.find(
                    (item: any) => item.source === 'github'
                  );
                  
                  if (githubBreakdown) {
                    console.log("GitHub score breakdown:", githubBreakdown);
                    // If we have GitHub points data, save it
                    setGithubPoints(githubBreakdown.points || 0);
                  } else {
                    // If no GitHub breakdown found, set to 0
                    setGithubPoints(0);
                  }
                } else {
                  // If no breakdown data at all, set to undefined to show loading state
                  setGithubPoints(0);
                }
                
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

        // Updated Webacy data fetch with correct endpoint and headers
        const fetchWebacyData = async (retries = 2) => {
          for (let i = 0; i <= retries; i++) {
            try {
              // Updated API endpoint without v2 prefix
              const response = await fetch(`https://api.webacy.com/quick-profile/${walletAddress}?chain=eth`, {
                method: 'GET',
                headers: {
                  'accept': 'application/json',
                  'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
                  'Key-ID': 'eujjkt9ao5'
                },
                cache: 'no-store' // Ensure no caching
              });

              if (response.ok) {
                const data = await response.json();
                console.log('Webacy Address Data:', data);
                
                // Fetch risk items if available
                const riskItemsResponse = await fetch(
                  `https://api.webacy.com/addresses/${walletAddress}/risk-items?chain=eth`,
                  {
                    method: 'GET',
                    headers: {
                      'accept': 'application/json',
                      'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
                      'Key-ID': 'eujjkt9ao5'
                    },
                    cache: 'no-store'
                  }
                );
                
                let riskItems = [];
                if (riskItemsResponse.ok) {
                  const riskData = await riskItemsResponse.json();
                  console.log('Webacy Risk Items:', riskData);
                  riskItems = riskData.data || [];
                }
                
                if (data) {
                  setWebacyData({
                    riskScore: data.score || 0,
                    threatLevel: getThreatLevel(data.score || 0),
                    walletAddress,
                    approvals: {
                      count: data.numApprovals || 0,
                      riskyCount: data.numRiskyApprovals || 0
                    },
                    quickProfile: {
                      transactions: data.numTransactions || 0,
                      contracts: data.numContracts || 0,
                      riskLevel: getThreatLevel(data.score || 0)
                    },
                    riskItems: riskItems,
                    riskHistory: data.riskHistory || []
                  });
                  return;
                }
              }
              
              if (i < retries) {
                console.error(`Attempt ${i + 1} failed for Webacy, retrying...`);
                await new Promise(r => setTimeout(r, 1000 * (i + 1)));
              }
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

  return { score, webacyData, txCount, githubPoints, loading };
}
