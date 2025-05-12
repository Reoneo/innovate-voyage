
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
