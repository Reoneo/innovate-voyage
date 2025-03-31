
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3Utils';
import { request, gql } from 'graphql-request';
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
    
    // Try to get domains from ENS subgraph
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

// Get all ENS domains for display in the ID Network visualization
export async function getIdNetworkEnsDomains(address: string): Promise<ENSRecord[]> {
  try {
    if (!address) return [];
    
    // Get all domain names first (no mock data)
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
