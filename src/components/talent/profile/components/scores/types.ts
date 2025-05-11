
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

export interface ScoreBadgeProps {
  onClick?: () => void;
  isLoading?: boolean;
}

export interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'transactions' | 'webacy';
  data: {
    score: number | null;
    webacyData: WebacyData | null;
    txCount: number | null;
    walletAddress: string;
  };
}
