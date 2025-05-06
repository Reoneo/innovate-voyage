
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

export interface EnsResolverProps {
  state: EnsResolutionState;
  setState: React.Dispatch<React.SetStateAction<EnsResolutionState>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  retryCount: number;
  setRetryCount: (count: number) => void;
  maxRetries: number;
}

export interface EnsFetchResult {
  ensLinks?: {
    socials: Record<string, string>;
    ensLinks: string[];
    description?: string;
    keywords?: string[];
  };
  avatar?: string;
  bio?: string;
}
