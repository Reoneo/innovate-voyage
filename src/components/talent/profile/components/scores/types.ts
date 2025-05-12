
export interface ScoreDialogData {
  score?: number | null;
  webacyData?: any | null;
  txCount?: number | null;
  walletAddress?: string | null;
}

export interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'security' | 'transactions' | 'webacy' | 'tally';
  data: ScoreDialogData;
}

export interface ScoreBadgeProps {
  onClick?: () => void;
  isLoading?: boolean;
}

// Add missing WebacyData type
export interface WebacyData {
  riskScore?: number;
  threatLevel?: ThreatLevel;
  approvalCount?: number;
  approvalPercentage?: number;
  lastEvaluationTimestamp?: number;
  transactionCount?: number;
  walletAddress?: string;
  threats?: any[];
  [key: string]: any; // Allow for additional properties
}

// Add missing ThreatLevel type
export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical' | 'None' | 'Unknown';
