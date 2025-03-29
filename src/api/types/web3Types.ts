
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
