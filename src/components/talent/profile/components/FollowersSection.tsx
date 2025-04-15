
import React from 'react';
import { useEthFollowStats } from '@/hooks/useEthFollow';
import { Users } from 'lucide-react';

interface FollowersSectionProps {
  walletAddress?: string;
  ensName?: string;
}

const FollowersSection: React.FC<FollowersSectionProps> = ({ walletAddress, ensName }) => {
  // Prefer ENS name if available, otherwise use wallet address
  const addressOrEns = ensName || walletAddress;
  const { stats, loading, error } = useEthFollowStats(addressOrEns);

  if (!addressOrEns) {
    return null;
  }

  return (
    <div className="py-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">Ethereum Follow Protocol</span>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="text-center p-2 border rounded-md">
            <p className="text-xs text-muted-foreground">Followers</p>
            <p className="font-bold text-foreground">{stats.followers_count || "0"}</p>
          </div>
          <div className="text-center p-2 border rounded-md">
            <p className="text-xs text-muted-foreground">Following</p>
            <p className="font-bold text-foreground">{stats.following_count || "0"}</p>
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground text-center py-2">
          No follower data available
        </div>
      )}
    </div>
  );
};

export default FollowersSection;
