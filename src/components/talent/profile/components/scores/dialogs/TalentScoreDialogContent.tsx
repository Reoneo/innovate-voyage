
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBuilderTitle } from '../utils/scoreUtils';
import TalentProtocolDetails from './TalentProtocolDetails';

interface TalentScoreDialogContentProps {
  score: number | null;
  walletAddress: string;
}

const TalentScoreDialogContent: React.FC<TalentScoreDialogContentProps> = ({ score, walletAddress }) => {
  return (
    <>
      <DialogHeader className="border-b border-gray-200 pb-3 mb-6">
        <DialogTitle className="flex items-center gap-2 text-xl">
          <img 
            src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1749456000000&signature=wVpMGWARK-VoESebvUStRy5M3WSFWM1ky_PBwsJR4tU&downloadName=logomark_dark.jpg"
            alt="Talent Protocol"
            className="h-6 w-6"
          />
          Builder Score & Profile Details
        </DialogTitle>
        <DialogDescription>
          A comprehensive overview of your on-chain reputation and Talent Protocol profile.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Builder Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <span className="text-6xl font-bold text-primary">
                    {score ?? 'N/A'}
                  </span>
                  <p className="text-lg font-medium text-muted-foreground mt-2">
                      {score ? getBuilderTitle(score) : 'Unknown'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>About Builder Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Builder Score reflects your on-chain contributions, project involvement, 
                  and overall impact in the Web3 ecosystem.
                </p>
              </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
          <TalentProtocolDetails walletAddress={walletAddress} />
        </div>
      </div>
    </>
  );
};

export default TalentScoreDialogContent;
