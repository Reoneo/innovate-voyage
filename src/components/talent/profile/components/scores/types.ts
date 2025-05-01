export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export interface RiskHistoryItem {
  timestamp: string;
  score: number;
  riskLevel: ThreatLevel;
}

export interface WebacyTransaction {
  id: string;
  date: string;
  riskLevel: ThreatLevel;
  description: string;
}

export interface WebacyData {
  riskScore?: number;
  threatLevel?: ThreatLevel;
  walletAddress?: string;
  approvals?: {
    count: number;
    riskyCount: number;
  };
  quickProfile?: {
    transactions: number;
    contracts: number;
    riskLevel?: ThreatLevel;
  };
  riskTransactions?: WebacyTransaction[];
  riskHistory?: RiskHistoryItem[];
}

export interface ScoreBadgeProps {
  onClick?: () => void;
  isLoading?: boolean;
}

export interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'webacy' | 'transactions';
  data: {
    score?: number | null;
    webacyData?: WebacyData | null;
    txCount?: number | null;
    walletAddress: string;
  };
}
