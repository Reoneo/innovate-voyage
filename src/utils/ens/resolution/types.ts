
// Types for ENS resolution functionality
export interface EnsResolutionResult {
  address?: string;
  ensName?: string;
  network?: 'mainnet';
  textRecords?: Record<string, string | null>;
}

export interface DotBitResult {
  address?: string;
  avatar?: string;
  ensName?: string;
  textRecords?: Record<string, string | null>;
}

export interface ResolvedENS {
  address?: string;
  name?: string;
  avatarUrl?: string;
  textRecords: Record<string, string | null>;
  metadata?: any;
}

export interface TextRecord {
  key: string;
  value: string | null;
}
