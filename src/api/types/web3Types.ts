
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
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  email?: string;
}

// Extended version of BlockchainPassport for PDF export
export interface TalentProfileData {
  passport_id: string;
  owner_address: string;
  avatar_url: string;
  name: string;
  issued: string;
  score?: number;
  category?: string;
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    email?: string;
    discord?: string;
    telegram?: string;
  };
  skills: PassportSkill[];
  blockchainProfile?: {
    balance?: string;
    transactionCount?: number;
    latestTransactions?: any[];
  };
  resolvedEns?: string;
}

export interface PassportSkill {
  name: string;
  proof?: string;
  issued_by?: string;
  level?: number;
}
