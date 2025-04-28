
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

export interface WebacyData {
  riskScore?: number;
  threatLevel?: ThreatLevel;
  approvals?: {
    count: number;
    riskyCount: number;
  };
  quickProfile?: {
    transactions?: number;
    contracts?: number;
    riskLevel?: string;
  };
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

export interface ScoreBadgeProps {
  onClick: () => void;
  isLoading: boolean;
}
