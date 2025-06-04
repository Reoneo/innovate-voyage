
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Award, TrendingUp, Users, Star } from 'lucide-react';
import { getBuilderTitle } from '../utils/scoreUtils';

interface TalentScoreDialogContentProps {
  score: number | null;
  walletAddress: string;
}

const TalentScoreDialogContent: React.FC<TalentScoreDialogContentProps> = ({ score, walletAddress }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <img 
              src="/talent-protocol-logo.png" 
              alt="Talent Protocol" 
              className="h-16 w-16 object-contain filter brightness-0 invert"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Builder Score</h1>
          <div className="text-6xl font-bold text-yellow-400">
            {score ?? 'N/A'}
          </div>
          <p className="text-xl text-gray-300">
            {score ? getBuilderTitle(score) : 'Unknown Level'}
          </p>
        </div>

        {/* Overview Card */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="h-5 w-5 text-yellow-400" />
              Builder Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{score || 0}</div>
                <div className="text-sm text-gray-300">Total Score</div>
              </div>
              <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                <Star className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {score ? Math.floor(score / 10) + 1 : 1}
                </div>
                <div className="text-sm text-gray-300">Builder Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ScoreItem label="Human Checkmark" score="20/20" percentage={100} />
            <ScoreItem label="GitHub Activity" score="26/130" percentage={20} />
            <ScoreItem label="Onchain Activity" score="24/48" percentage={50} />
            <ScoreItem label="Talent Protocol" score="0/20" percentage={0} />
            <ScoreItem label="X/Twitter" score="4/4" percentage={100} />
          </CardContent>
        </Card>

        {/* Platform Connections */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-purple-400" />
              Platform Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <PlatformItem label="Base" score="0/127" />
              <PlatformItem label="Bountycaster" score="0/12" />
              <PlatformItem label="BUILD" score="0/20" />
              <PlatformItem label="Crypto Nomads" score="0/12" />
              <PlatformItem label="DAOBase" score="0/8" />
              <PlatformItem label="Developer DAO" score="0/20" />
              <PlatformItem label="Devfolio" score="0/64" />
              <PlatformItem label="ENS" score="0/6" />
              <PlatformItem label="ETHGlobal" score="0/106" />
              <PlatformItem label="Farcaster" score="0/82" />
              <PlatformItem label="Lens" score="0/6" />
              <PlatformItem label="Stack" score="0/12" />
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <a 
            href={`https://app.talentprotocol.com/profile/${walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all"
          >
            View Full Profile <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

interface ScoreItemProps {
  label: string;
  score: string;
  percentage: number;
}

const ScoreItem: React.FC<ScoreItemProps> = ({ label, score, percentage }) => (
  <div className="flex items-center justify-between p-3 bg-gray-700/20 rounded-lg">
    <span className="text-gray-300">{label}</span>
    <div className="flex items-center gap-3">
      <div className="w-20 bg-gray-600 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="font-medium text-white min-w-[60px] text-right">{score}</span>
    </div>
  </div>
);

interface PlatformItemProps {
  label: string;
  score: string;
}

const PlatformItem: React.FC<PlatformItemProps> = ({ label, score }) => (
  <div className="flex justify-between p-2 bg-gray-700/10 rounded">
    <span className="text-gray-300">{label}</span>
    <span className="font-medium text-white">{score}</span>
  </div>
);

export default TalentScoreDialogContent;
