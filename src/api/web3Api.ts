
import { delay } from './jobsApi';

// Mock data for ENS records
const mockEnsRecords = [
  { 
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 
    ensName: 'vitalik.eth',
    avatar: 'https://storage.googleapis.com/ethereum-hackmd/upload_7a91319e830e3961cc56e1bfeb4926b5.png',
    skills: ['Ethereum', 'Solidity', 'Smart Contracts', 'Blockchain Architecture'],
    socialProfiles: {
      twitter: '@VitalikButerin',
      github: 'vbuterin',
      linkedin: 'vitalik-buterin'
    }
  },
  { 
    address: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF', 
    ensName: 'cdixon.eth',
    avatar: 'https://pbs.twimg.com/profile_images/697435015398657024/nT39NRRv_400x400.jpg',
    skills: ['Web3', 'Venture Capital', 'Crypto Economics', 'DeFi'],
    socialProfiles: {
      twitter: '@cdixon',
      github: 'cdixon',
      linkedin: 'chrisdixon'
    }
  },
  { 
    address: '0x9C4eb242AcEbc6bfC068Ca16B8c851920Dd7BF11', 
    ensName: 'naval.eth',
    avatar: 'https://pbs.twimg.com/profile_images/1627829933296627712/jgxkmNW9_400x400.jpg',
    skills: ['Angel Investing', 'Crypto', 'Startups', 'Philosophy'],
    socialProfiles: {
      twitter: '@naval',
      github: 'naval',
      linkedin: 'navalr'
    }
  },
  { 
    address: '0x99C85bb64564D9eF9A99621301f22C9993Cb4E3F', 
    ensName: 'jessewldn.eth',
    avatar: 'https://pbs.twimg.com/profile_images/1607385686160293888/FeAzCiBF_400x400.jpg',
    skills: ['Crypto UX', 'Product Design', 'NFTs', 'DeFi'],
    socialProfiles: {
      twitter: '@jessewldn',
      github: 'jwolden',
      linkedin: 'jessewolden'
    }
  },
  { 
    address: '0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678', 
    ensName: 'brantly.eth',
    avatar: 'https://pbs.twimg.com/profile_images/1718396752026128384/oVMy4IgI_400x400.jpg',
    skills: ['ENS', 'Identity', 'Web3 Governance', 'Blockchain Domains'],
    socialProfiles: {
      twitter: '@brantlymillegan',
      github: 'brantlymillegan',
      linkedin: 'brantlymillegan'
    }
  }
];

// Mock data for Skill NFTs
const mockSkillNfts = [
  {
    tokenId: '1',
    name: 'Solidity Expert',
    issuer: 'Ethereum Foundation',
    issuedDate: '2023-01-15',
    description: 'Awarded for exceptional Solidity programming skills',
    image: 'https://storage.opensea.io/files/fc916076f64c9a2d18afe16b9b611a33.svg',
    owners: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F']
  },
  {
    tokenId: '2',
    name: 'Web3 Security Specialist',
    issuer: 'OpenZeppelin',
    issuedDate: '2023-03-22',
    description: 'Certified Web3 security auditor',
    image: 'https://storage.opensea.io/files/7ed465857d1b915f279a686713e2a9b4.svg',
    owners: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', '0x9C4eb242AcEbc6bfC068Ca16B8c851920Dd7BF11']
  },
  {
    tokenId: '3',
    name: 'DeFi Protocol Developer',
    issuer: 'Aave',
    issuedDate: '2023-05-10',
    description: 'Expertise in developing DeFi protocols',
    image: 'https://ipfs.io/ipfs/QmTiqc23TibYLcvVxZK2FS6LLqBRFzkGsjQST5ER7B3JzX',
    owners: ['0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF']
  },
  {
    tokenId: '4',
    name: 'NFT Creator',
    issuer: 'Foundation',
    issuedDate: '2023-06-18',
    description: 'Accomplished NFT artist and creator',
    image: 'https://ipfs.io/ipfs/QmRPJKEJmKmHYkA7L3iVuswijzD3yzjXbnjw3xrc1GvpNK',
    owners: ['0x99C85bb64564D9eF9A99621301f22C9993Cb4E3F']
  },
  {
    tokenId: '5',
    name: 'DAO Governance Expert',
    issuer: 'Aragon',
    issuedDate: '2023-07-29',
    description: 'Mastery in DAO governance mechanisms',
    image: 'https://ipfs.io/ipfs/QmPSZVVRWTwXU8VYrGUqZhQNGVYwc8CbBY3eexpwsQsVhN',
    owners: ['0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678']
  }
];

export interface ENSRecord {
  address: string;
  ensName: string;
  avatar: string;
  skills: string[];
  socialProfiles: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface SkillNFT {
  tokenId: string;
  name: string;
  issuer: string;
  issuedDate: string;
  description: string;
  image: string;
  owners: string[];
}

export interface Web3Credentials {
  ensRecord: ENSRecord | null;
  skillNfts: SkillNFT[];
}

export const web3Api = {
  // Lookup ENS record by address
  getEnsByAddress: async (address: string): Promise<ENSRecord | null> => {
    await delay(300); // Simulate network delay
    const record = mockEnsRecords.find(record => record.address.toLowerCase() === address.toLowerCase());
    return record || null;
  },
  
  // Reverse lookup address by ENS name
  getAddressByEns: async (ensName: string): Promise<ENSRecord | null> => {
    await delay(300); // Simulate network delay
    const record = mockEnsRecords.find(record => record.ensName.toLowerCase() === ensName.toLowerCase());
    return record || null;
  },
  
  // Get skill NFTs by address
  getSkillNftsByAddress: async (address: string): Promise<SkillNFT[]> => {
    await delay(500); // Simulate network delay
    return mockSkillNfts.filter(nft => 
      nft.owners.some(owner => owner.toLowerCase() === address.toLowerCase())
    );
  },
  
  // Get all Web3 credentials (ENS + Skill NFTs) by address
  getWeb3CredentialsByAddress: async (address: string): Promise<Web3Credentials> => {
    await delay(700); // Simulate network delay
    
    const [ensRecord, skillNfts] = await Promise.all([
      web3Api.getEnsByAddress(address),
      web3Api.getSkillNftsByAddress(address)
    ]);
    
    return {
      ensRecord,
      skillNfts
    };
  },

  // Get all available ENS records (for demo purposes)
  getAllEnsRecords: async (): Promise<ENSRecord[]> => {
    await delay(400);
    return [...mockEnsRecords];
  },
  
  // Get all available skill NFTs (for demo purposes)
  getAllSkillNfts: async (): Promise<SkillNFT[]> => {
    await delay(400);
    return [...mockSkillNfts];
  }
};
