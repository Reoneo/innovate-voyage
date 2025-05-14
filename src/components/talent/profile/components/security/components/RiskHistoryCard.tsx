
import React from 'react';
import { TrendingUp } from 'lucide-react';
import type { ThreatLevel } from '../../scores/types';

interface RiskHistoryCardProps {
  riskHistory: any[];
}

const RiskHistoryCard: React.FC<RiskHistoryCardProps> = ({ riskHistory }) => {
  const getThreatColor = (threatLevel: ThreatLevel) => {
    switch (threatLevel) {
      case 'LOW':
        return 'text-green-500';
      case 'MEDIUM':
        return 'text-yellow-500';
      case 'HIGH':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">Risk History</h3>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {riskHistory.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
            <span className={getThreatColor(item.riskLevel)}>{item.score}</span>
          </div>
        ))}
        {riskHistory.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">No risk history available</p>
        )}
      </div>
    </div>
  );
};

export default RiskHistoryCard;
