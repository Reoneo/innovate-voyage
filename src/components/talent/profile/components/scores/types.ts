
// Score dialog types
export interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'security' | 'talent' | 'transactions';
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
