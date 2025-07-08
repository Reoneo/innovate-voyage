
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { getBuilderTitle } from '../utils/scoreUtils';
import TalentProtocolDetails from './TalentProtocolDetails';

interface TalentScoreDialogContentProps {
  score: number | null;
  walletAddress: string;
}

const TalentScoreDialogContent: React.FC<TalentScoreDialogContentProps> = ({ score, walletAddress }) => {
  return (
    <>
      <DialogHeader className="border-b border-gray-200 pb-3">
        <DialogTitle className="flex items-center gap-2">
          <img 
            src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1749456000000&signature=wVpMGWARK-VoESebvUStRy5M3WSFWM1ky_PBwsJR4tU&downloadName=logomark_dark.jpg"
            alt="Talent Protocol"
            className="h-6 w-6"
          />
          Builder Score Details
        </DialogTitle>
        <DialogDescription>
          Your talent and contribution score based on on-chain activity
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Current Score</h3>
              <span className="text-3xl font-bold text-primary">
                {score ?? 'N/A'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Level</span>
                <span className="text-sm font-medium">
                  {score ? getBuilderTitle(score) : 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <TalentProtocolDetails walletAddress={walletAddress} />
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-3">About Builder Score</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Builder Score reflects your on-chain contributions, project involvement, 
              and overall impact in the Web3 ecosystem. It's calculated based on various 
              factors including transaction history, smart contract interactions, and 
              community participation.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TalentScoreDialogContent;
