
export interface ScoreData {
  score?: number | null;
  webacyData?: any;
  txCount?: number;
  walletAddress?: string;
}

export interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'webacy' | 'transactions';
  data: ScoreData;
}
