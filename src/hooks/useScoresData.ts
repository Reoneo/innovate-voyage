
import { useState, useEffect } from 'react';
import { WebacyData, ThreatLevel } from '@/components/talent/profile/components/scores/types';
import { getThreatLevel } from '@/components/talent/profile/components/scores/utils/scoreUtils';

// Create a cache to store API responses by wallet address
const responseCache = new Map<string, { webacyData: WebacyData | null, timestamp: number }>();
const CACHE_LIFETIME = 30 * 60 * 1000; // 30 minutes

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
        // Check cache first for webacy data
        const cacheKey = `webacy-${walletAddress}`;
        const now = Date.now();
        const cachedData = responseCache.get(cacheKey);
        
        // Use cached data if available and not expired
        if (cachedData && (now - cachedData.timestamp < CACHE_LIFETIME)) {
          console.log("Using cached Webacy data for", walletAddress);
          setWebacyData(cachedData.webacyData);
        } else {
          // Fetch fresh Webacy data
          await fetchWebacyData();
        }
        
        // Fetch other scores in parallel
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

    // Updated Webacy data fetch with optimized retry logic
    const fetchWebacyData = async () => {
      try {
        // Updated API endpoint with chain parameter
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
          let riskItems = [];
          try {
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
            
            if (riskItemsResponse.ok) {
              const riskData = await riskItemsResponse.json();
              console.log('Webacy Risk Items:', riskData);
              riskItems = riskData.data || [];
            }
          } catch (err) {
            console.error("Error fetching risk items:", err);
          }
          
          if (data) {
            // Make sure we properly extract the score from the data
            const threatLevel = getThreatLevel(data.score || 0);
            
            const webacyResult: WebacyData = {
              riskScore: data.score !== undefined ? data.score : null,
              threatLevel: threatLevel,
              walletAddress,
              approvals: {
                count: data.numApprovals || 0,
                riskyCount: data.numRiskyApprovals || 0
              },
              quickProfile: {
                transactions: data.numTransactions || 0,
                contracts: data.numContracts || 0,
                riskLevel: threatLevel
              },
              riskItems: riskItems,
              riskHistory: data.riskHistory || []
            };
            
            // Store in cache
            responseCache.set(`webacy-${walletAddress}`, {
              webacyData: webacyResult,
              timestamp: Date.now()
            });
            
            setWebacyData(webacyResult);
          }
        } else {
          console.error(`Webacy API error: ${response.status} - ${response.statusText}`);
          throw new Error(`Webacy API error: ${response.status}`);
        }
      } catch (err) {
        console.error("Failed to fetch Webacy data:", err);
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

  return { score, webacyData, txCount, loading };
}
