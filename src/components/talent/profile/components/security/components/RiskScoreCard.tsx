
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getThreatColor } from '../../scores/utils/scoreUtils';
import { WebacyData } from '../../scores/types';

interface RiskScoreCardProps {
  webacyData: WebacyData | null;
}

const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ webacyData }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Risk Score</h3>
          <span className={`text-xl font-bold ${getThreatColor(webacyData?.threatLevel)}`}>
            {webacyData?.riskScore !== undefined ? webacyData.riskScore : 'Unknown'}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">
            The wallet has a {webacyData?.threatLevel?.toLowerCase() || 'unknown'} threat level.
            {webacyData?.threatLevel === 'LOW' && ' This indicates normal blockchain activity.'}
            {webacyData?.threatLevel === 'MEDIUM' && ' Some suspicious transactions were detected.'}
            {webacyData?.threatLevel === 'HIGH' && ' High-risk activity detected in this wallet.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskScoreCard;
