
export interface EnsResolutionState {
  resolvedAddress?: string;
  resolvedEns?: string;
  avatarUrl?: string;
  ensBio?: string;
  ensLinks: {
    socials: Record<string, string>;
    ensLinks: string[];
    keywords: string[];
  };
  textRecords?: Record<string, string | null>;
}

export interface EnsResolutionResult {
  state: EnsResolutionState;
  setState: React.Dispatch<React.SetStateAction<EnsResolutionState>>;
  isLoading: boolean;
  error: string | null;
  resolveEns: (ensName: string) => Promise<void>;
  lookupAddress: (address: string) => Promise<void>;
}

export interface ENSMetadata {
  address?: string;
  name?: string;
  description?: string;
  avatar?: string;
  avatarUrl?: string;
  twitter?: string;
  github?: string;
  url?: string;
}
