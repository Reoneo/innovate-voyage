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
      
      // Fetch all data in parallel
      try {
        const [talentResp, webacyResp, etherscanResp] = await Promise.all([
          fetch(
            `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
            {
              headers: {
                "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
              },
              cache: "no-store" // Force fresh data
            }
          ),
          fetch(`https://api.webacy.com/addresses/${walletAddress}`, {
            headers: {
              'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'accept': 'application/json',
              'Key-ID': 'eujjkt9ao5'
            },
            cache: "no-store"
          }),
          fetch(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM`,
            { cache: "no-store" }
          )
        ]);

        // Process Talent Protocol response
        if (talentResp.ok) {
          const data = await talentResp.json();
          setScore(data.score?.points ?? null);
        }

        // Process Webacy response
        if (webacyResp.ok) {
          const webacyDataJson = await webacyResp.json();
          const riskScore = webacyDataJson.data?.riskScore;
          setWebacyData({
            riskScore,
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
        }

        // Process Etherscan response
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
