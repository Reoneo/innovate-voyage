
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getThreatColor } from './utils/scoreUtils';
import { Shield } from 'lucide-react';
import type { WebacyData, ScoreBadgeProps } from './types';

interface SecurityScoreBadgeProps extends ScoreBadgeProps {
  webacyData: WebacyData | null;
}

const SecurityScoreBadge: React.FC<SecurityScoreBadgeProps> = ({
  webacyData,
  onClick,
  isLoading
}) => {
  return null;
};

export default SecurityScoreBadge;
