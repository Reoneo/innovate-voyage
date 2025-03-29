
// Types for Web3 data structures
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
  status?: string | null;
  location?: string | null;
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
  links?: {
    website?: {
      link: string;
      handle: string;
    };
    github?: {
      link: string;
      handle: string;
    };
    twitter?: {
      link: string;
      handle: string;
    };
    linkedin?: {
      link: string;
      handle: string;
    };
    facebook?: {
      link: string;
      handle: string;
    };
    whatsapp?: {
      link: string;
      handle: string;
    };
    bluesky?: {
      link: string;
      handle: string;
    };
  };
  social?: Record<string, any>;
}
