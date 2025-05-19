
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
  cacheTime?: number; // Added for cache validation
}

export interface ScoreBadgeProps {
  onClick?: () => void;
  isLoading?: boolean;
}
