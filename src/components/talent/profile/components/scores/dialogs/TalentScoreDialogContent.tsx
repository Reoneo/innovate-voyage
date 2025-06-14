
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getBuilderTitle } from '../utils/scoreUtils';
import { useTalentProtocolScores } from './hooks/useTalentProtocolScores';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle } from 'lucide-react';

interface TalentScoreDialogContentProps {
  score: number | null;
  walletAddress: string;
}

const TalentScoreDialogContent: React.FC<TalentScoreDialogContentProps> = ({ score, walletAddress }) => {
  const { scores, isLoading } = useTalentProtocolScores(walletAddress);

  const getScoresWithPoints = () => {
    if (!scores) return [];
    
    return Object.values(scores).filter(category => category.score > 0);
  };

  return (
    <>
      <DialogHeader className="border-b border-gray-700 pb-3 mb-6">
        <DialogTitle className="flex items-center gap-2 text-xl text-white">
          <img 
            src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1749456000000&signature=wVpMGWARK-VoESebvUStRy5M3WSFWM1ky_PBwsJR4tU&downloadName=logomark_dark.jpg"
            alt="Talent Protocol"
            className="h-6 w-6"
          />
          Builder Score & Credentials
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Comprehensive breakdown of your Talent Protocol credentials and scoring.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Total Builder Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <span className="text-6xl font-bold text-white">
                  {score ?? 'N/A'}
                </span>
                <p className="text-lg font-medium text-gray-400 mt-2">
                  {score ? getBuilderTitle(score) : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Credential Breakdown</CardTitle>
              <p className="text-sm text-gray-400">Only showing categories with earned points</p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-20 bg-gray-800" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getScoresWithPoints().map((category) => (
                    <div key={category.name} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white text-sm">{category.name}</h4>
                        {category.verified && (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">
                          {category.score}
                        </span>
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          /{category.maxScore} pts
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min((category.score / category.maxScore) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!isLoading && getScoresWithPoints().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">No credential points found for this wallet address.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TalentScoreDialogContent;
