
import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FollowerStatsProps {
  walletAddress: string;
}

interface EthFollowData {
  followerCount: number;
  followingCount: number;
}

const FollowerStats: React.FC<FollowerStatsProps> = ({ walletAddress }) => {
  const [stats, setStats] = useState<EthFollowData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFollowerStats = async () => {
      if (!walletAddress) return;
      
      setLoading(true);
      try {
        const response = await fetch(`https://api.ethfollow.xyz/api/v1/users/${walletAddress}/stats`);
        
        if (response.ok) {
          const data = await response.json();
          setStats({
            followerCount: data.followers || 0,
            followingCount: data.following || 0
          });
        } else {
          console.error('Error fetching follower stats:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching follower stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowerStats();
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
        <Users className="h-4 w-4" />
        <span>Loading stats...</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-4 mb-2 text-sm text-foreground">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
              <span className="font-medium">{stats?.followerCount || 0}</span>
              <span>Followers</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>People following this profile</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer hover:text-primary">
              <span className="font-medium">{stats?.followingCount || 0}</span>
              <span>Following</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Profiles this person follows</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default FollowerStats;
