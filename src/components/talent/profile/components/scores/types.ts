
export type ThreatLevel = 'UNKNOWN' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface WebacyData {
  threatLevel: ThreatLevel;
  riskScore?: number;
  walletAddress?: string;
  approvals?: {
    count: number;
    riskyCount: number;
  };
  quickProfile?: {
    transactions: number;
    contracts: number;
    riskLevel: ThreatLevel;
  };
  riskItems?: any[];
  riskHistory?: any[];
  cacheTime?: number; // Timestamp when this data was cached
  cacheExpiryTime?: number; // Time when cache should expire (in ms)
}

export interface ScoreBadgeProps {
  onClick?: () => void;
  isLoading?: boolean;
}
