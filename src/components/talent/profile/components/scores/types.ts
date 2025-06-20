

export interface ScoreBadgeProps {
  onClick?: () => void;
  isLoading?: boolean;
}

export interface ScoreDialogData {
  score: number | null;
  txCount: number | null;
  walletAddress: string;
}

export type DialogType = 'talent' | 'security' | 'transactions' | 'blockchain';
