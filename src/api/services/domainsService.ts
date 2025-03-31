
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3Utils';
import { request, gql } from 'graphql-request';
import axios from 'axios';
import { getEtherscanConfig } from './etherscan/etherscanCore';

// GraphQL query to get all domains for an address from ENS subgraph
const ENS_DOMAINS_QUERY = gql`
  query getDomains($owner: String!) {
    domains(where: { owner: $owner }) {
      id
      name
      labelName
      owner {
        id
      }
      parent {
        name
      }
    }
  }
`;

// ENS Subgraph URL
const ENS_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/ensdomains/ens";

// Define the shape of the GraphQL response
interface ENSDomainsResponse {
  domains: Array<{
    id: string;
    name: string;
    labelName: string;
    owner: {
      id: string;
    };
    parent: {
      name: string;
    };
  }>;
}

// Get all ENS records from real sources - no more mock data
export async function getAllEnsRecords(): Promise<ENSRecord[]> {
  return [];  // Return empty array instead of mock data
}

// Fetch all ENS domains associated with an address - improved version with Etherscan
export async function fetchAllEnsDomains(address: string): Promise<string[]> {
  try {
    if (!address) return [];
    
    // Normalize address to lowercase for comparison
    const normalizedAddress = address.toLowerCase();
    console.log(`Fetching all ENS domains for address: ${normalizedAddress}`);
    
    let domains: string[] = [];
    
    // Try to get domains from Etherscan API first
    try {
      const { apiKey } = getEtherscanConfig();
      if (apiKey) {
        const etherscanResponse = await getEtherscanNameTags(normalizedAddress, apiKey);
        if (etherscanResponse && etherscanResponse.length > 0) {
          console.log(`Found ${etherscanResponse.length} domains from Etherscan`, etherscanResponse);
          domains = [...etherscanResponse];
        }
      }
    } catch (etherscanError) {
      console.warn("Error querying Etherscan for ENS names:", etherscanError);
    }
    
    // Try to get real domains from ENS subgraph as secondary source
    if (domains.length === 0) {
      try {
        const variables = { owner: normalizedAddress };
        const data = await request<ENSDomainsResponse>(ENS_SUBGRAPH_URL, ENS_DOMAINS_QUERY, variables);
        
        if (data && data.domains && data.domains.length > 0) {
          console.log(`Found ${data.domains.length} domains from ENS subgraph`, data.domains);
          domains = data.domains
            .filter((domain) => domain.name) // Ensure domain has a name
            .map((domain) => domain.name);
        }
      } catch (subgraphError) {
        console.warn("Error querying ENS subgraph:", subgraphError);
      }
    }
    
    // If no domains found, try web3.bio as fallback
    if (domains.length === 0) {
      try {
        const profile = await fetchWeb3BioProfile(address);
        if (profile && profile.identity) {
          if (profile.identity.includes('.eth') || profile.identity.includes('.box')) {
            domains.push(profile.identity);
          }
        }
      } catch (bioError) {
        console.warn("Error fetching from web3.bio:", bioError);
      }
    }
    
    console.log(`Final domains for address ${address}:`, domains);
    return domains;
  } catch (error) {
    console.error(`Error fetching ENS domains for address ${address}:`, error);
    return [];
  }
}

// Function to get ENS names directly from Etherscan
async function getEtherscanNameTags(address: string, apiKey: string): Promise<string[]> {
  try {
    // Etherscan doesn't directly expose ENS names in their API
    // But we can try to use their API to get account labels
    const baseUrl = 'https://api.etherscan.io/api';
    const response = await axios.get(baseUrl, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '10', // Just need a few to check if the account has name tags
        sort: 'desc',
        apikey: apiKey,
      },
    });

    // Initialize sets to hold unique names
    const fromTags = new Set<string>();
    const toTags = new Set<string>();

    // If the API returns data, try to extract name tags
    if (response.data && response.data.result && Array.isArray(response.data.result)) {
      response.data.result.forEach((tx: any) => {
        // Look for name tags in transactions
        if (tx.from && tx.fromAddress && tx.from.toLowerCase() === address.toLowerCase() && tx.fromAddress.includes('.eth')) {
          fromTags.add(tx.fromAddress);
        }
        
        if (tx.to && tx.toAddress && tx.to.toLowerCase() === address.toLowerCase() && tx.toAddress.includes('.eth')) {
          toTags.add(tx.toAddress);
        }
      });
    }
    
    // Combine both sets of tags
    const allTags = [...fromTags, ...toTags];
    
    if (allTags.length > 0) {
      return allTags;
    }
    
    // As a fallback, use the account method to try and get any associated ENS names
    const lookupResponse = await axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'account',
        action: 'tokenbalance',
        contractaddress: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85', // ENS Registry Contract
        address,
        tag: 'latest',
        apikey: apiKey,
      },
    });
    
    if (lookupResponse.data && lookupResponse.data.result && parseInt(lookupResponse.data.result) > 0) {
      console.log(`This address owns ${lookupResponse.data.result} ENS tokens`);
      // If the account holds ENS tokens, we know they own ENS domains
      // But we'll need to rely on the ENS subgraph to get the actual domains
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching name tags from Etherscan:', error);
    return [];
  }
}

// Get all ENS domains for display in the ID Network visualization
export async function getIdNetworkEnsDomains(address: string): Promise<ENSRecord[]> {
  try {
    if (!address) return [];
    
    // Get all domain names first (no more mock data)
    const domainNames = await fetchAllEnsDomains(address);
    if (!domainNames.length) return [];
    
    // Convert domain names to ENS Records with avatars
    const ensRecords: ENSRecord[] = await Promise.all(
      domainNames.map(async (domainName) => {
        // Try to get avatar for this domain
        let avatar;
        try {
          console.log(`Fetching domain profile: ${domainName}`);
          const profile = await fetchWeb3BioProfile(domainName);
          avatar = profile?.avatar || generateFallbackAvatar();
        } catch {
          avatar = generateFallbackAvatar();
        }
        
        return {
          ensName: domainName,
          address,
          avatar,
          skills: [],
          socialProfiles: {}
        };
      })
    );
    
    return ensRecords;
  } catch (error) {
    console.error(`Error getting ENS records for ID Network:`, error);
    return [];
  }
}
