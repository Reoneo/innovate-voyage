
export interface ScoreBadgeProps {
  onClick?: () => void;
  isLoading?: boolean;
}

// Webacy related types are removed as requested.

export interface ScoreDialogData {
  score: number | null;
  txCount: number | null;
  walletAddress: string;
}

export type DialogType = 'talent' | 'security' | 'transactions' | 'blockchain';
