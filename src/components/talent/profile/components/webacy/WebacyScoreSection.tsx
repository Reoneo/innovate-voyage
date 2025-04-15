
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchWalletScore } from '@/api/services/webacyService';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WebacyScoreSectionProps {
  walletAddress: string;
}

const WebacyScoreSection: React.FC<WebacyScoreSectionProps> = ({ walletAddress }) => {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoreDescription, setScoreDescription] = useState('');
  
  useEffect(() => {
    const loadScore = async () => {
      if (!walletAddress) return;
      
      setLoading(true);
      try {
        const data = await fetchWalletScore(walletAddress);
        if (data && typeof data.score === 'number') {
          setScore(data.score);
          setScoreDescription(getScoreDescription(data.score));
        }
      } catch (error) {
        console.error('Error fetching Webacy score:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadScore();
  }, [walletAddress]);
  
  // Skip rendering if no score is available and not loading
  if (!loading && score === null) {
    return null;
  }
  
  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-gray-300';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent wallet reputation';
    if (score >= 60) return 'Good wallet reputation';
    if (score >= 40) return 'Average wallet reputation';
    return 'Low wallet reputation - use caution';
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <span>Wallet Reputation Score</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This score is provided by Webacy and indicates the wallet's reputation 
                  based on on-chain activity and interactions.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{scoreDescription}</span>
              <span className="text-2xl font-bold">{score}/100</span>
            </div>
            <Progress 
              value={score || 0} 
              max={100} 
              className="h-2"
              indicatorClassName={getScoreColor(score)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebacyScoreSection;
