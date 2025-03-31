
import { ENSRecord } from '../types/web3Types';
import { delay } from '../jobsApi';
import { mockEnsRecords } from '../data/mockWeb3Data';
import { fetchWeb3BioProfile, generateFallbackAvatar } from '../utils/web3Utils';
import { request, gql } from 'graphql-request';

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

// Get all available ENS records (for demo purposes)
export async function getAllEnsRecords(): Promise<ENSRecord[]> {
  await delay(400);
  
  // Make sure all records have avatars
  await Promise.all(
    mockEnsRecords.map(async (record) => {
      if (!record.avatar) {
        // Try to fetch real avatar for this ENS
        try {
          const profile = await fetchWeb3BioProfile(record.ensName);
          if (profile && profile.avatar) {
            record.avatar = profile.avatar;
          } else {
            record.avatar = generateFallbackAvatar();
          }
        } catch (error) {
          record.avatar = generateFallbackAvatar();
        }
      }
    })
  );
  
  return [...mockEnsRecords];
}

// Fetch all ENS domains associated with an address
export async function fetchAllEnsDomains(address: string): Promise<string[]> {
  try {
    if (!address) return [];
    
    // Normalize address to lowercase for comparison
    const normalizedAddress = address.toLowerCase();
    console.log(`Fetching all ENS domains for address: ${normalizedAddress}`);
    
    let domains: string[] = [];
    
    // Try to get real domains from ENS subgraph
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
    
    // If no domains found from subgraph, try web3.bio as fallback
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
    
    // If still no domains, use mock data as last resort for demo
    if (domains.length === 0) {
      console.log("No real domains found, falling back to mock data");
      await delay(500); // Simulate API delay
      
      // Get mock records matching this address
      const mockRecords = await getAllEnsRecords();
      const mockDomains = mockRecords
        .filter(record => record.address.toLowerCase() === normalizedAddress)
        .map(record => record.ensName);
      
      domains = mockDomains;
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
    
    // Get all domain names first
    const domainNames = await fetchAllEnsDomains(address);
    if (!domainNames.length) return [];
    
    // Convert domain names to ENS Records with avatars
    const ensRecords: ENSRecord[] = await Promise.all(
      domainNames.map(async (domainName) => {
        // Try to get avatar for this domain
        let avatar;
        try {
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
