
export interface ScoreBadgeProps {
  onClick?: () => void;
  isLoading?: boolean;
}

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export interface WebacyData {
  riskScore?: number;
  threatLevel: ThreatLevel;
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
}

export interface ScoreDialogData {
  score: number | null;
  webacyData: WebacyData | null;
  txCount: number | null;
  walletAddress: string;
  githubUsername?: string;
}

export type DialogType = 'talent' | 'webacy' | 'transactions' | 'blockchain' | 'github';
