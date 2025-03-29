
import { delay } from './jobsApi';

// Mock data for ENS records with the real identity names
const mockEnsRecords = [
  { 
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 
    ensName: 'vitalik.eth',
    avatar: '', // We'll fetch the real avatar
    skills: ['Ethereum Grandmaster', 'Solidity', 'Smart Contracts', 'Blockchain Architecture', 'Cryptoeconomics', 'Proof-of-Stake'],
    socialProfiles: {
      twitter: '@VitalikButerin',
      github: 'vbuterin',
      linkedin: 'vitalik-buterin',
      discord: 'vitalik#1337'
    }
  },
  { 
    address: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF', 
    ensName: 'ohms.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Community Management', 'Web3', 'Digital Marketing', 'Content Creation'],
    socialProfiles: {
      twitter: '@ohms_box',
      github: 'ohmsbox',
      linkedin: 'ohmsbox'
    }
  },
  { 
    address: '0x9C4eb242AcEbc6bfC068Ca16B8c851920Dd7BF11', 
    ensName: 'black.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['DeFi', 'NFTs', 'DAO Governance', 'Smart Contract Development'],
    socialProfiles: {
      twitter: '@black_box',
      github: 'blackbox',
      discord: 'blackbox#1234'
    }
  },
  { 
    address: '0x99C85bb64564D9eF9A99621301f22C9993Cb4E3F', 
    ensName: 'hax.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Security Auditing', 'Penetration Testing', 'Bug Bounty', 'Blockchain Security'],
    socialProfiles: {
      twitter: '@hax_box',
      github: 'haxbox',
      discord: 'haxbox#5678'
    }
  },
  { 
    address: '0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678', 
    ensName: 'phantom.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Privacy Solutions', 'Zero-Knowledge Proofs', 'Anonymity Networks', 'Cryptography'],
    socialProfiles: {
      twitter: '@phantom_box',
      github: 'phantombox',
      discord: 'phantom#9012'
    }
  },
  { 
    address: '0x6860f1A0eF0AB11d762DAe619457Eb54143f849c', 
    ensName: 'bing.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Search Algorithms', 'Data Analytics', 'AI Integration', 'Web Services'],
    socialProfiles: {
      twitter: '@bing_box',
      github: 'bingbox',
      linkedin: 'bingbox',
      discord: 'bing#3456'
    }
  },
  { 
    address: '0x21FB4411FA5828344c2788aB07D4cc12a12571b9', 
    ensName: 'hunter.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Airdrop Hunting', 'Token Research', 'DeFi Strategies', 'Alpha Finding'],
    socialProfiles: {
      twitter: '@hunter_box',
      discord: 'hunter#7890'
    }
  },
  { 
    address: '0x983110309620D911731Ac0932219af06091b6744', 
    ensName: 'mike.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Web Development', 'Digital Marketing', 'Drone Piloting', 'Content Creation'],
    socialProfiles: {
      twitter: '@mike_box',
      github: 'mikebox',
      linkedin: 'mikebox'
    }
  },
  { 
    address: '0x20fFeD7d3Ec1f10074159D59C53DaD137d7EFb1C', 
    ensName: 'smith.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Multichain ID Services', 'Cross-Chain Solutions', 'Identity Verification', 'DID Standards'],
    socialProfiles: {
      twitter: '@smith_box',
      github: 'smithbox',
      discord: 'smith#2345'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c799C5', 
    ensName: 'blockchaineazy.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Community Management', 'Web Design', 'Social Media Strategy', 'Content Creation'],
    socialProfiles: {
      twitter: '@blockchaineazy',
      github: 'blockchaineazy',
      linkedin: 'blockchaineazy'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c799D6', 
    ensName: 'stars.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['NFT Collecting', 'Virtual Worlds', 'Metaverse Design', 'Digital Art'],
    socialProfiles: {
      twitter: '@stars_box',
      discord: 'stars#1111'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c799E7', 
    ensName: 'mystic.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Oracle Development', 'Prediction Markets', 'Forecasting Systems', 'Randomness'],
    socialProfiles: {
      twitter: '@mystic_box',
      github: 'mysticbox',
      discord: 'mystic#2222'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c799F8', 
    ensName: 'doom.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Gaming', 'Game Economics', 'Play-to-Earn', 'eSports'],
    socialProfiles: {
      twitter: '@doom_box',
      discord: 'doom#3333'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c7A001', 
    ensName: 'seansky.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Airdrop Hunting', 'Node Setup', 'Crypto Tutorials', 'Token Research'],
    socialProfiles: {
      twitter: '@seansky_box',
      discord: 'seansky#4444'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c7A112', 
    ensName: 'onigiri.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['DeFi Protocol Design', 'Yield Farming', 'Liquidity Provision', 'Tokenomics'],
    socialProfiles: {
      twitter: '@onigiri_box',
      github: 'onigiribox',
      discord: 'onigiri#5555'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c7A223', 
    ensName: 'cypherpunk.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Privacy Tech', 'Cryptography', 'Decentralized Identity', 'Security'],
    socialProfiles: {
      twitter: '@cypherpunk_box',
      github: 'cypherpunkbox'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c7A334', 
    ensName: 'yx.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Blockchain Gaming', 'Game Development', 'Smart Contract Gaming', 'Tokenized Games'],
    socialProfiles: {
      twitter: '@yx_box',
      discord: 'yx#6666'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c7A445', 
    ensName: 'dude.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Community Building', 'Men\'s Support Networks', 'Content Creation', 'Social Media'],
    socialProfiles: {
      twitter: '@dude_box',
      discord: 'dude#7777'
    }
  },
  { 
    address: '0x3e6c8431A2f091Fbd55cB9888B789f29B1c7A556', 
    ensName: 'pen.box',
    avatar: '', // We'll fetch the real avatar
    skills: ['Investment Analysis', 'Entrepreneurship', 'Business Strategy', 'Financial Writing'],
    socialProfiles: {
      twitter: '@pen_box',
      linkedin: 'penbox'
    }
  }
];

// Mock data for Skill NFTs
const mockSkillNfts = [
  {
    tokenId: '1',
    name: 'Ethereum Grandmaster',
    issuer: 'Ethereum Foundation',
    issuedDate: '2015-07-30',
    description: 'Creator and lead architect of Ethereum',
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
    owners: ['0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF', '0x20fFeD7d3Ec1f10074159D59C53DaD137d7EFb1C']
  },
  {
    tokenId: '4',
    name: 'NFT Creator',
    issuer: 'Foundation',
    issuedDate: '2023-06-18',
    description: 'Accomplished NFT artist and creator',
    image: 'https://ipfs.io/ipfs/QmRPJKEJmKmHYkA7L3iVuswijzD3yzjXbnjw3xrc1GvpNK',
    owners: ['0x99C85bb64564D9eF9A99621301f22C9993Cb4E3F', '0x21FB4411FA5828344c2788aB07D4cc12a12571b9']
  },
  {
    tokenId: '5',
    name: 'DAO Governance Expert',
    issuer: 'Aragon',
    issuedDate: '2023-07-29',
    description: 'Mastery in DAO governance mechanisms',
    image: 'https://ipfs.io/ipfs/QmPSZVVRWTwXU8VYrGUqZhQNGVYwc8CbBY3eexpwsQsVhN',
    owners: ['0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678', '0x20fFeD7d3Ec1f10074159D59C53DaD137d7EFb1C']
  },
  {
    tokenId: '6',
    name: 'ZK Proof Engineer',
    issuer: 'StarkWare',
    issuedDate: '2023-08-15',
    description: 'Expert in zero-knowledge proof systems',
    image: 'https://ipfs.io/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
    owners: ['0x983110309620D911731Ac0932219af06091b6744', '0x3e6c8431A2f091Fbd55cB9888B789f29B1c799C5']
  },
  {
    tokenId: '7',
    name: 'Ethereum Educator',
    issuer: 'Blockchain Education Network',
    issuedDate: '2023-04-12',
    description: 'Recognized for outstanding contribution to blockchain education',
    image: 'https://ipfs.io/ipfs/QmTHfkHAjCkpz2SbpKbQdmeu8k5h4mh5DSCAbgQd8CBz86',
    owners: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', '0x6860f1A0eF0AB11d762DAe619457Eb54143f849c']
  },
  {
    tokenId: '8',
    name: 'ENS Domain Specialist',
    issuer: 'ENS DAO',
    issuedDate: '2023-02-28',
    description: 'Expert in Ethereum Name Service domains and infrastructure',
    image: 'https://ipfs.io/ipfs/QmUQKFQnHDJGgCvpxU9iQjt3j8iZtELDDMvwpDsfdGGJtW',
    owners: ['0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678', '0x3e6c8431A2f091Fbd55cB9888B789f29B1c799C5']
  },
  {
    tokenId: '9',
    name: 'Crypto Economics Researcher',
    issuer: 'Crypto Economics Lab',
    issuedDate: '2023-09-05',
    description: 'Contributor to advanced blockchain economic models',
    image: 'https://ipfs.io/ipfs/QmXwrZMUC3jXDtRvoBdKCZadK6dGJFLUSJQQiM5DEbRZkD',
    owners: ['0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF', '0x9C4eb242AcEbc6bfC068Ca16B8c851920Dd7BF11']
  },
  {
    tokenId: '10',
    name: 'MEV Specialist',
    issuer: 'Flashbots',
    issuedDate: '2023-07-14',
    description: 'Expert in miner extractable value research and implementation',
    image: 'https://ipfs.io/ipfs/QmRDvLwMMxe5SewdVy8gpgqtQscxQsEUQyGbYyrANxKZpK',
    owners: ['0x983110309620D911731Ac0932219af06091b6744']
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
    discord?: string;
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

export interface Web3BioProfile {
  address: string;
  identity: string;
  platform: string;
  displayName: string;
  avatar: string | null;
  description: string | null;
}

// Functions to fetch data from Web3.bio API
async function fetchWeb3BioProfile(identity: string): Promise<Web3BioProfile | null> {
  try {
    const response = await fetch(`https://api.web3.bio/profile/${identity}`);
    if (!response.ok) {
      console.warn(`Failed to fetch Web3.bio profile for ${identity}`);
      return null;
    }
    
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      // Return the first profile in the array
      return data[0] as Web3BioProfile;
    } else if (data.error) {
      console.warn(`Web3.bio error for ${identity}:`, data.error);
      return null;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Web3.bio profile for ${identity}:`, error);
    return null;
  }
}

// Cache for storing already fetched avatars to reduce API calls
const avatarCache: Record<string, string> = {
  // Pre-populate with some fallbacks
  'vitalik.eth': 'https://storage.googleapis.com/ethereum-hackmd/upload_7a91319e830e3961cc56e1bfeb4926b5.png',
};

// Initialize the mockEnsRecords with real avatars
(async function initializeRealAvatars() {
  for (const record of mockEnsRecords) {
    if (avatarCache[record.ensName]) {
      record.avatar = avatarCache[record.ensName];
      continue;
    }
    
    try {
      const profile = await fetchWeb3BioProfile(record.ensName);
      if (profile && profile.avatar) {
        record.avatar = profile.avatar;
        avatarCache[record.ensName] = profile.avatar;
      } else {
        // Use a random avatar from pravatar or other service as fallback
        const fallbackIdx = Math.floor(Math.random() * 30) + 1;
        record.avatar = `https://i.pravatar.cc/300?img=${fallbackIdx}`;
      }
    } catch (error) {
      console.error(`Error initializing avatar for ${record.ensName}:`, error);
      // Use a random avatar as fallback
      const fallbackIdx = Math.floor(Math.random() * 30) + 1;
      record.avatar = `https://i.pravatar.cc/300?img=${fallbackIdx}`;
    }
  }
})();

export const web3Api = {
  // Get real avatar for an ENS name
  getRealAvatar: async (ensName: string): Promise<string | null> => {
    // Check cache first
    if (avatarCache[ensName]) {
      return avatarCache[ensName];
    }
    
    // If not in cache, fetch from API
    try {
      const profile = await fetchWeb3BioProfile(ensName);
      if (profile && profile.avatar) {
        avatarCache[ensName] = profile.avatar;
        return profile.avatar;
      }
    } catch (error) {
      console.error(`Error fetching avatar for ${ensName}:`, error);
    }
    
    return null;
  },
  
  // Lookup ENS record by address
  getEnsByAddress: async (address: string): Promise<ENSRecord | null> => {
    await delay(300); // Simulate network delay
    const record = mockEnsRecords.find(record => record.address.toLowerCase() === address.toLowerCase());
    
    if (record && !record.avatar) {
      // Try to fetch real avatar if not already set
      const avatar = await web3Api.getRealAvatar(record.ensName);
      if (avatar) {
        record.avatar = avatar;
      } else {
        // Use a random avatar as fallback
        const fallbackIdx = Math.floor(Math.random() * 30) + 1;
        record.avatar = `https://i.pravatar.cc/300?img=${fallbackIdx}`;
      }
    }
    
    return record || null;
  },
  
  // Reverse lookup address by ENS name
  getAddressByEns: async (ensName: string): Promise<ENSRecord | null> => {
    await delay(300); // Simulate network delay
    const record = mockEnsRecords.find(record => record.ensName.toLowerCase() === ensName.toLowerCase());
    
    if (record && !record.avatar) {
      // Try to fetch real avatar if not already set
      const avatar = await web3Api.getRealAvatar(record.ensName);
      if (avatar) {
        record.avatar = avatar;
      } else {
        // Use a random avatar as fallback
        const fallbackIdx = Math.floor(Math.random() * 30) + 1;
        record.avatar = `https://i.pravatar.cc/300?img=${fallbackIdx}`;
      }
    }
    
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
    
    // Make sure all records have avatars
    await Promise.all(
      mockEnsRecords.map(async (record) => {
        if (!record.avatar) {
          const avatar = await web3Api.getRealAvatar(record.ensName);
          if (avatar) {
            record.avatar = avatar;
          } else {
            // Use a random avatar as fallback
            const fallbackIdx = Math.floor(Math.random() * 30) + 1;
            record.avatar = `https://i.pravatar.cc/300?img=${fallbackIdx}`;
          }
        }
      })
    );
    
    return [...mockEnsRecords];
  },
  
  // Get all available skill NFTs (for demo purposes)
  getAllSkillNfts: async (): Promise<SkillNFT[]> => {
    await delay(400);
    return [...mockSkillNfts];
  }
};
