
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

// Add missing type definitions to fix type errors
export interface ScoreBadgeProps {
  onClick?: () => void;
  isLoading?: boolean;
}

export interface TalentScoreBadgeProps extends ScoreBadgeProps {
  score: number;
}

export interface SecurityScoreBadgeProps extends ScoreBadgeProps {
  securityData?: WebacyData;
}

export interface TransactionsBadgeProps extends ScoreBadgeProps {
  txCount: number;
  walletAddress: string;
}

export interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'transactions';
  data: {
    score?: number;
    webacyData?: WebacyData | null;
    txCount?: number;
    walletAddress?: string;
  };
}
