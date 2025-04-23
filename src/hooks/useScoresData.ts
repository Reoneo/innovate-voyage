
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
        // Fetch Talent Protocol Score
        const talentResp = await fetch(
          `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
          {
            headers: {
              "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
            },
            cache: "no-cache" // Force fetch fresh data
          }
        );
        
        if (talentResp.ok) {
          const data = await talentResp.json();
          setScore(data.score?.points ?? null);
        }

        // Fetch Webacy Data with the correct API key and endpoint: /addresses/{address}
        try {
          const webacyResp = await fetch(`https://api.webacy.com/addresses/${walletAddress}`, {
            headers: {
              'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'accept': 'application/json'
            },
            cache: "no-cache"
          });

          if (webacyResp.ok) {
            const webacyDataJson = await webacyResp.json();
            // API returns structure: { data: { address, riskScore, ... }, status }
            const riskScore = webacyDataJson.data?.riskScore;
            setWebacyData({
              riskScore: riskScore,
              threatLevel: getThreatLevel(riskScore),
              approvals: {
                count: 0,
                riskyCount: 0
              },
              quickProfile: {
                transactions: 0,
                contracts: 0,
                riskLevel: getThreatLevel(riskScore)
              }
            });
          } else {
            setWebacyData(null);
          }
        } catch (webacyError) {
          console.error('Error fetching Webacy data:', webacyError);
        }

        // Fetch Transaction Count from Etherscan
        const etherscanResp = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM`,
          { cache: "no-cache" }
        );
        
        if (etherscanResp.ok) {
          const data = await etherscanResp.json();
          if (data.status === '1') {
            setTxCount(data.result.length);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress]);

  return { score, webacyData, txCount, loading };
}
