
import React from 'react';

interface FollowStatsProps {
  followers: number;
  following: number;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
  loading?: boolean;
}

export function FollowStats({ 
  followers, 
  following, 
  onOpenFollowers, 
  onOpenFollowing, 
  loading 
}: FollowStatsProps) {
  return (
    <div className="mt-1 flex items-center justify-center text-black font-semibold space-x-1 text-sm">
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <button 
            onClick={onOpenFollowers}
            className="text-black hover:underline transition-colors"
          >
            {followers} Followers
          </button>
          <span className="text-black opacity-70">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
          <button 
            onClick={onOpenFollowing}
            className="text-black hover:underline transition-colors"
          >
            Following {following}
          </button>
        </>
      )}
    </div>
  );
}
