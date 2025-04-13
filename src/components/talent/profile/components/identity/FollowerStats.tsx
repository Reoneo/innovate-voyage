
import React from 'react';
import { Link } from 'react-router-dom';
import { useEthFollowData } from '@/hooks/useEthFollowData';

interface FollowerStatsProps {
  address?: string;
  ensName?: string;
}

const FollowerStats: React.FC<FollowerStatsProps> = ({ 
  address, 
  ensName
}) => {
  // Use ENS name for profile link if available, otherwise use address
  const profileBaseUrl = ensName || address;
  const addressOrEns = ensName || address;
  
  const { followersCount, followingCount, loading } = useEthFollowData(addressOrEns);
  
  if (!profileBaseUrl) return null;
  
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };
  
  return (
    <div className="flex items-center justify-center gap-4 w-full mt-2 text-sm text-black">
      <Link 
        to={`/${profileBaseUrl}/followers/`} 
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <span className="font-medium">{loading ? '...' : formatCount(followersCount)}</span>
        <span>Followers</span>
      </Link>
      
      <Link 
        to={`/${profileBaseUrl}/following/`}
        className="flex items-center gap-1 hover:text-primary transition-colors"
      >
        <span className="font-medium">{loading ? '...' : formatCount(followingCount)}</span>
        <span>Following</span>
      </Link>
    </div>
  );
};

export default FollowerStats;
