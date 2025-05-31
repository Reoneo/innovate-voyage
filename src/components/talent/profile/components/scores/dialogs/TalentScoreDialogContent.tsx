
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TalentScoreDialogContentProps {
  score: number | null;
  walletAddress: string;
}

const TalentScoreDialogContent: React.FC<TalentScoreDialogContentProps> = ({
  score,
  walletAddress
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Builder Score Details</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 pt-4">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-900 mb-2">{score || 'N/A'}</div>
          <p className="text-lg text-muted-foreground">
            {score ? getBuilderTitle(score) : 'Unknown Level'}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">About Builder Score</h3>
            <p className="text-sm text-muted-foreground">
              The Builder Score represents your overall activity and contributions in the web3 ecosystem.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Wallet Address</h3>
            <p className="text-sm font-mono text-muted-foreground break-all">
              {walletAddress}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function for builder titles
const getBuilderTitle = (score: number) => {
  if (score >= 80) return 'Expert Builder';
  if (score >= 60) return 'Advanced Builder';
  if (score >= 40) return 'Intermediate Builder';
  if (score >= 20) return 'Apprentice Builder';
  return 'Beginner Builder';
};

export default TalentScoreDialogContent;
