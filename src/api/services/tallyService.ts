
import { delay } from '../jobsApi';

export interface TallyDaoData {
  dao: {
    name: string;
    logo?: string;
  };
  votingPower: {
    value: string;
    percentage: string;
  };
  delegations: {
    count: number;
    label: string;
  };
}

export async function fetchTallyDaoData(address: string): Promise<TallyDaoData[] | null> {
  try {
    // API key
    const apiKey = "823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988";
    
    // Endpoints to fetch data
    const url = `https://api.tally.xyz/query?api-key=${apiKey}`;
    
    // Fetch relevant DAO data for the address
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query DelegateVotes($address: Address!) {
            delegate(address: $address) {
              governances {
                name
                tokenSymbol
                delegatedVotes
                delegatedVotesRaw
                delegators {
                  totalCount
                }
                governance {
                  name
                  id
                }
              }
            }
          }
        `,
        variables: {
          address: address
        }
      })
    });

    const data = await response.json();
    
    // If there's no data or an error occurred
    if (!data.data || !data.data.delegate || !data.data.delegate.governances) {
      console.log("No Tally DAO data found for address:", address);
      await delay(500);
      
      // Return mock data for testing/demo purposes
      return [{
        dao: {
          name: "ENS",
          logo: "https://assets.coingecko.com/coins/images/19785/standard/acatxTm8_400x400.jpg"
        },
        votingPower: {
          value: "<0.01",
          percentage: "(0.00%)"
        },
        delegations: {
          count: 1,
          label: "addresses delegating"
        }
      }];
    }

    // Process the actual data
    return data.data.delegate.governances.map((gov: any) => ({
      dao: {
        name: gov.governance.name || gov.tokenSymbol,
        logo: getTallyDaoLogo(gov.governance.name || gov.tokenSymbol)
      },
      votingPower: {
        value: formatVotingPower(gov.delegatedVotesRaw),
        percentage: "(0.00%)" // This would need additional API data for the percentage calculation
      },
      delegations: {
        count: gov.delegators?.totalCount || 0,
        label: "addresses delegating"
      }
    }));
    
  } catch (error) {
    console.error("Error fetching Tally DAO data:", error);
    return null;
  }
}

function formatVotingPower(value: string): string {
  if (!value) return "0";
  
  const numValue = parseFloat(value);
  if (numValue < 0.01) return "<0.01";
  if (numValue < 1000) return numValue.toFixed(2);
  if (numValue < 1000000) return (numValue / 1000).toFixed(1) + "K";
  return (numValue / 1000000).toFixed(1) + "M";
}

function getTallyDaoLogo(daoName: string): string {
  const logoMap: Record<string, string> = {
    "ENS": "https://assets.coingecko.com/coins/images/19785/standard/acatxTm8_400x400.jpg",
    "Uniswap": "https://assets.coingecko.com/coins/images/12504/standard/uni.jpg",
    "Aave": "https://assets.coingecko.com/coins/images/12645/standard/AAVE.png",
    "Compound": "https://assets.coingecko.com/coins/images/10775/standard/COMP.png",
    "MakerDAO": "https://assets.coingecko.com/coins/images/1364/standard/Mark_Maker.png",
  };
  
  const lowerDaoName = daoName.toLowerCase();
  
  for (const [key, value] of Object.entries(logoMap)) {
    if (lowerDaoName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Default logo for unknown DAOs
  return "https://substackcdn.com/image/fetch/w_1360,c_limit,f_webp,q_auto:best,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F16e04a51-6718-44ad-b41e-01598da994b6_1280x1280.png";
}
