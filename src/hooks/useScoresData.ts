
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
      
      // Create an array of promises for parallel fetching
      const fetchPromises = [
        // Fetch Talent Protocol Score
        fetch(
          `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
          {
            headers: {
              "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
            },
            cache: "no-cache"
          }
        ),
        
        // Fetch Webacy Data - adding chain parameter
        fetch(`https://api.webacy.com/addresses/${walletAddress}?chain=eth`, {
          headers: {
            'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'accept': 'application/json',
            'Key-ID': 'eujjkt9ao5'
          },
          cache: "no-cache"
        }),
        
        // Fetch Webacy Quick Profile with chain parameter
        fetch(`https://api.webacy.com/quick-profile/${walletAddress}?chain=eth`, {
          headers: {
            'x-api-key': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
            'accept': 'application/json',
            'Key-ID': 'eujjkt9ao5'
          },
          cache: "no-cache"
        }),
        
        // Fetch Transaction Count with improved error handling
        fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM`,
          { cache: "no-cache" }
        )
      ];

      try {
        const [talentResp, webacyAddrResp, webacyProfileResp, etherscanResp] = await Promise.all(fetchPromises);
        
        // Process Talent Protocol response
        if (talentResp.ok) {
          const talentData = await talentResp.json();
          console.log("Talent Protocol data:", talentData);
          setScore(talentData.score?.points ?? null);
        } else {
          console.error('Failed to fetch Talent Protocol data:', talentResp.status);
          // Retry once with a delay for Talent Protocol
          setTimeout(async () => {
            try {
              const retryResp = await fetch(
                `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
                {
                  headers: {
                    "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
                  }
                }
              );
              if (retryResp.ok) {
                const retryData = await retryResp.json();
                setScore(retryData.score?.points ?? null);
              }
            } catch (err) {
              console.error('Retry for Talent Protocol failed:', err);
            }
          }, 2000);
        }

        // Process Webacy address response
        let webacyRiskScore;
        if (webacyAddrResp.ok) {
          const webacyDataJson = await webacyAddrResp.json();
          webacyRiskScore = webacyDataJson.data?.riskScore;
        }

        // Process Webacy quick profile response
        let quickProfile;
        if (webacyProfileResp.ok) {
          const webacyProfileData = await webacyProfileResp.json();
          console.log("Webacy Profile data:", webacyProfileData);
          
          quickProfile = {
            transactions: webacyProfileData.numTransactions || 0,
            contracts: webacyProfileData.numContracts || 0,
            riskLevel: webacyProfileData.riskLevel || getThreatLevel(webacyRiskScore)
          };
        }
        
        // Set Webacy data with all the information we have
        setWebacyData({
          riskScore: webacyRiskScore,
          threatLevel: getThreatLevel(webacyRiskScore),
          walletAddress,
          approvals: {
            count: 0,
            riskyCount: 0
          },
          quickProfile: quickProfile || {
            transactions: 0,
            contracts: 0,
            riskLevel: getThreatLevel(webacyRiskScore)
          }
        });

        // Process Etherscan response with improved error handling
        if (etherscanResp.ok) {
          const etherscanData = await etherscanResp.json();
          if (etherscanData.status === '1') {
            setTxCount(etherscanData.result.length);
          } else {
            // If Etherscan API returns an error, retry once with a delay
            setTimeout(async () => {
              try {
                const retryResp = await fetch(
                  `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM`
                );
                if (retryResp.ok) {
                  const retryData = await retryResp.json();
                  if (retryData.status === '1') {
                    setTxCount(retryData.result.length);
                  }
                }
              } catch (err) {
                console.error('Retry for Etherscan failed:', err);
              }
            }, 1000);
          }
        }

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
