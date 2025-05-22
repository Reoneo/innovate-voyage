
export interface EnsResolutionState {
  resolvedAddress: string | undefined;
  resolvedEns: string | undefined;
  avatarUrl: string | undefined;
  ensBio: string | undefined;
  ensLinks: {
    socials: Record<string, string>;
    ensLinks: string[];
    description?: string;
    keywords?: string[];
  };
}

export interface EnsResolutionResult {
  state: EnsResolutionState;
  setState: React.Dispatch<React.SetStateAction<EnsResolutionState>>;
  isLoading: boolean;
  error: string | null;
  resolveEns: (ensName: string) => Promise<void>;
  lookupAddress: (address: string) => Promise<void>;
}
