
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { getBuilderTitle } from '../utils/scoreUtils';

interface TalentScoreDialogContentProps {
  score: number | null;
  walletAddress: string;
}

const TalentScoreDialogContent: React.FC<TalentScoreDialogContentProps> = ({ score, walletAddress }) => {
  // Using same look as NFT dialog: sidebar header, two-column layout on desktop, cohesive card style
  return (
    <div className="max-w-3xl mx-auto bg-white text-gray-900 rounded-2xl overflow-hidden shadow border border-gray-200 p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[320px]">
        {/* Left Side: Visual/summary */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#f7f7ff] via-[#f6f2fb] to-[#eceafe] p-8 md:border-r border-gray-100">
          <img 
            src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1749456000000&signature=wVpMGWARK-VoESebvUStRy5M3WSFWM1ky_PBwsJR4tU&downloadName=logomark_dark.jpg"
            alt="Talent Protocol"
            className="h-14 w-14 mb-3 rounded-full border border-primary/30 shadow"
          />
          <div className="text-xl font-semibold text-primary mb-2">Builder Score</div>
          <div className="text-5xl font-bold text-indigo-700 mb-1">{score ?? 'N/A'}</div>
          <div className="text-base font-medium text-muted-foreground">
            Level: {score ? getBuilderTitle(score) : 'Unknown'}
          </div>
          <div className="mt-4 text-xs text-gray-400">Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</div>
        </div>
        {/* Right Side: Description/details */}
        <div className="flex flex-col justify-center p-8 space-y-6">
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                Builder Score Details
              </DialogTitle>
              <DialogDescription>
                Your talent and contribution score based on on-chain activity
              </DialogDescription>
            </DialogHeader>
          </div>
          <div>
            <h3 className="font-medium mb-2">What is Builder Score?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Builder Score reflects your on-chain contributions, project involvement, 
              and overall impact in the Web3 ecosystem. It's calculated based on factors like transaction history, smart contract interactions, and community participation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentScoreDialogContent;
