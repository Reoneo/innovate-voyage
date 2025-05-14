
// Score dialog types
export interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'security' | 'talent' | 'transactions' | 'webacy' | 'tally';
  walletAddress: string;
  data?: any;
}

// Score badge types
export interface ScoreBadgeProps {
  score: number;
  label: string;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'security' | 'talent' | 'transactions';
}

// Webacy data types
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
    riskLevel: ThreatLevel;
  };
  riskItems?: any[];
  riskHistory?: any[];
}

// Define threat level types
export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';

// TallyBadge props
export interface TallyBadgeProps {
  walletAddress: string;
  onClick?: () => void;
  loading?: boolean;
}
