
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { getBuilderTitle } from '../utils/scoreUtils';

interface TalentScoreDialogContentProps {
  score: number | null;
  walletAddress: string;
}

const TalentScoreDialogContent: React.FC<TalentScoreDialogContentProps> = ({ score, walletAddress }) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <img 
            src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/0b83e516-c3cb-4c3e-b00a-9d6a927898aa/Logo_TalentPassport.jpg?table=block&id=e47be4ed-acec-4839-a019-c20295bba22d&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1746043200000&signature=nhPbTdjNSmsIdiFDNE5oArkW94dSk4ezIhfnCVXR5yo&downloadName=Logo_TalentPassport.jpg" 
            alt="Talent Passport" 
            className="h-6"
          />
          Builder Score Details
        </DialogTitle>
        <DialogDescription>
          Builder progression and activity metrics
        </DialogDescription>
      </DialogHeader>
      
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Total Builder Score</h3>
            <span className="text-xl font-bold text-yellow-500">
              {score ?? 'N/A'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            <p>Current Level: {score ? getBuilderTitle(score) : 'Unknown'}</p>
          </div>
          
          <ScoreBreakdownSection />
          <OtherPlatformsSection />
          
          <div className="mt-4">
            <a 
              href={`https://app.talentprotocol.com/profile/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-1"
            >
              Verify on Talent Protocol <ExternalLink size={14} />
            </a>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const ScoreBreakdownSection = () => (
  <div className="border-t pt-4 mt-4">
    <h4 className="font-medium mb-3">Score Breakdown</h4>
    <div className="space-y-2">
      <ScoreItem label="Human Checkmark" score="20/20" />
      <ScoreItem label="GitHub" score="26/130" />
      <ScoreItem label="Onchain Activity" score="24/48" />
      <ScoreItem label="Talent Protocol" score="0/20" />
      <ScoreItem label="X/Twitter" score="4/4" />
    </div>
  </div>
);

const OtherPlatformsSection = () => (
  <div className="border-t pt-4 mt-4">
    <h4 className="font-medium mb-3">Other Platforms</h4>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <ScoreItem label="Base" score="0/127" />
      <ScoreItem label="Bountycaster" score="0/12" />
      <ScoreItem label="BUILD" score="0/20" />
      <ScoreItem label="Crypto Nomads" score="0/12" />
      <ScoreItem label="DAOBase" score="0/8" />
      <ScoreItem label="Developer DAO" score="0/20" />
      <ScoreItem label="Devfolio" score="0/64" />
      <ScoreItem label="ENS" score="0/6" />
      <ScoreItem label="ETHGlobal" score="0/106" />
      <ScoreItem label="Farcaster" score="0/82" />
      <ScoreItem label="Lens" score="0/6" />
      <ScoreItem label="Stack" score="0/12" />
    </div>
  </div>
);

interface ScoreItemProps {
  label: string;
  score: string;
}

const ScoreItem: React.FC<ScoreItemProps> = ({ label, score }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className="font-medium">{score}</span>
  </div>
);

export default TalentScoreDialogContent;
