
// Import required types from useWebacyData hook
import { WebacyScoreData, ThreatLevel } from '@/hooks/useWebacyData';

export interface ScoreBadgeProps {
  score?: number | null;
  onClick?: () => void;
  isLoading?: boolean;
}

export interface TalentScoreBadgeProps extends ScoreBadgeProps {
  score: number | null;
}

export interface SecurityScoreBadgeProps extends ScoreBadgeProps {
  data?: WebacyData;
}

export interface TransactionsBadgeProps extends ScoreBadgeProps {
  txCount?: number | null;
  walletAddress: string;
}

export interface TallyBadgeProps extends ScoreBadgeProps {
  tallyScore?: number | null;
}

export type WebacyData = WebacyScoreData;

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
