
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
    <div className="bg-black text-white rounded-lg">
      <DialogHeader className="border-b border-white/10 flex flex-col items-center text-center px-4 py-6">
        <div className="flex flex-col items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center overflow-hidden mb-3">
            <img 
              src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1746064800000&signature=NrmlObpAbCJOzeEZfVJ7zb-a2H4jiI9HQ1OcbvA6ckY&downloadName=logomark_dark.jpg" 
              alt="Builder Score" 
              className="h-full w-full object-cover"
            />
          </div>
          <DialogTitle className="text-white text-xl">Builder Score Details</DialogTitle>
        </div>
        <DialogDescription className="text-gray-300">
          Builder progression and activity metrics
        </DialogDescription>
      </DialogHeader>
      
      <div className="p-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-white">Total Builder Score</h3>
              <span className="text-xl font-bold text-yellow-400">
                {score ?? 'N/A'}
              </span>
            </div>
            <div className="text-sm text-gray-300 mb-2">
              <p>Current Level: {score ? getBuilderTitle(score) : 'Unknown'}</p>
            </div>
            
            <ScoreBreakdownSection />
            <OtherPlatformsSection />
            
            <div className="mt-4 text-center">
              <a 
                href={`https://app.talentprotocol.com/profile/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 justify-center"
              >
                Verify on Talent Protocol <ExternalLink size={14} />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ScoreBreakdownSection = () => (
  <div className="border-t border-gray-700 pt-4 mt-4">
    <h4 className="font-medium mb-3 text-white">Score Breakdown</h4>
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
  <div className="border-t border-gray-700 pt-4 mt-4">
    <h4 className="font-medium mb-3 text-white">Other Platforms</h4>
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
    <span className="text-gray-300">{label}</span>
    <span className="font-medium text-white">{score}</span>
  </div>
);

export default TalentScoreDialogContent;
