
import { WebacyScoreData } from '@/hooks/useWebacyData';

export interface ScoreDialogData {
  score?: number | null;
  webacyData?: WebacyScoreData | null;
  txCount?: number | null;
  walletAddress?: string | null;
}

export interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'talent' | 'security' | 'transactions';
  data: ScoreDialogData;
}
