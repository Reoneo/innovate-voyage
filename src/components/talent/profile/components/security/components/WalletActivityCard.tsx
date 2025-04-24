
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import type { WebacyData } from '../../scores/types';

interface WalletActivityCardProps {
  webacyData: WebacyData | null;
}

const WalletActivityCard: React.FC<WalletActivityCardProps> = ({ webacyData }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium mb-4">Wallet Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-semibold">
              {webacyData?.quickProfile?.transactions || 0}
            </span>
            <span className="text-sm text-muted-foreground">Transactions</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold">
              {webacyData?.quickProfile?.contracts || 0}
            </span>
            <span className="text-sm text-muted-foreground">Contracts</span>
          </div>
        </div>
        
        {webacyData?.riskScore !== undefined && (
          <div className="mt-4 text-right">
            <a 
              href={`https://app.webacy.com/wallet/${webacyData?.walletAddress || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center justify-end gap-1 text-blue-500 hover:underline"
            >
              View detailed analysis <ExternalLink size={14} />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletActivityCard;
