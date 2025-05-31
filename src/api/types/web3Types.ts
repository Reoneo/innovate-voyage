
export interface ENSRecord {
  ensName: string;
  address: string;
  avatar?: string | null;
  description?: string | null;
}

export interface SkillNFT {
  id: string;
  name: string;
  description?: string;
  image?: string;
  skill: string;
  level?: number;
  issuer?: string;
  dateEarned?: string;
  verificationUrl?: string;
  category?: string;
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
  avatar?: string | null;
  description?: string | null;
  status?: string | null;
  location?: string | null;
  telephone?: string | null;
  header?: string | null;
  contenthash?: string | null;
  github?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  website?: string | null;
  email?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
  bluesky?: string | null;
  discord?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  telegram?: string | null;
  reddit?: string | null;
  farcaster?: string | null;
  lens?: string | null;
  links?: any;
  social?: any;
  aliases?: string[];
}
