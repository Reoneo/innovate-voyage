
// Types for Web3 data structures
export interface ENSRecord {
  address: string;
  ensName: string;
  avatar: string;
  skills: string[];
  description?: string; // Add description field for ENS bio
  socialProfiles: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    discord?: string;
    website?: string;
    email?: string;
    facebook?: string;
    whatsapp?: string;
    messenger?: string;
    reddit?: string;
    telegram?: string;
    instagram?: string;
    youtube?: string;
    bluesky?: string;
    telephone?: string;  // Added telephone field
    location?: string;   // Added location field
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

// Updated the social interface to be more flexible
export interface Web3BioProfile {
  address: string;
  identity: string;
  platform: string;
  displayName: string;
  avatar: string | null;
  description: string | null;
  status?: string | null;
  location?: string | null;
  telephone?: string | null;  // Added telephone field
  header?: string | null;
  contenthash?: string | null;
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  email?: string;
  facebook?: string;
  whatsapp?: string;
  messenger?: string;
  reddit?: string;
  telegram?: string;
  instagram?: string;
  youtube?: string;
  bluesky?: string;
  discord?: string;
  farcaster?: string;
  lens?: string;
  aliases?: string[];
  links?: {
    website?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    github?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    twitter?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    linkedin?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    facebook?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    whatsapp?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    bluesky?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    instagram?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    youtube?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    telegram?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    discord?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    farcaster?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    lens?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    nostr?: {
      link: string;
      handle: string;
      sources?: string[];
    };
    opensea?: {
      link: string;
      handle: string;
      sources?: string[];
    };
  };
  social?: {
    uid?: string | number | null;
    follower?: number;
    following?: number;
    [key: string]: any; // Add index signature to allow additional properties
  };
  error?: string;
}
