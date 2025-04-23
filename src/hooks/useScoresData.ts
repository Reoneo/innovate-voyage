
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

        // Fetch Webacy Data using the correct API endpoint with proper headers
        try {
          const webacyResp = await fetch(`https://api.webacy.com/addresses/${walletAddress}`, {
            headers: {
              'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'accept': 'application/json',
              'Key-ID': 'eujjkt9ao5' // Adding the Key-ID header as required by Webacy API
            },
            cache: "no-cache"
          });

          if (webacyResp.ok) {
            const webacyDataJson = await webacyResp.json();
            console.log("Webacy response:", webacyDataJson);
            
            // API returns structure with data property containing the actual data
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
            console.error('Webacy API error:', await webacyResp.text());
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
