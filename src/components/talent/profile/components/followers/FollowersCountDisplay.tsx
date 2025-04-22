
import React from 'react';

interface FollowersCountDisplayProps {
  followersCount: string | number;
  followingCount: string | number;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
  isLoading: boolean;
  error: string | null;
}

const FollowersCountDisplay: React.FC<FollowersCountDisplayProps> = ({
  followersCount,
  followingCount,
  onOpenFollowers,
  onOpenFollowing,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-2">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-xs text-red-500 mt-1">{error}</div>;
  }

  return (
    <div className="flex justify-center space-x-6 mt-2">
      <button 
        onClick={onOpenFollowers}
        className="text-sm text-foreground hover:underline focus:outline-none"
      >
        <span className="font-bold">{followersCount || "0"}</span> Followers
      </button>
      <button 
        onClick={onOpenFollowing}
        className="text-sm text-foreground hover:underline focus:outline-none"
      >
        Following <span className="font-bold">{followingCount || "0"}</span>
      </button>
    </div>
  );
};

export default FollowersCountDisplay;
