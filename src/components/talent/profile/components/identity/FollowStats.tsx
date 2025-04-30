
import React from 'react';

interface FollowStatsProps {
  followers: number;
  following: number;
  loading: boolean;
  openFollowersDialog: () => void;
  openFollowingDialog: () => void;
}

const FollowStats: React.FC<FollowStatsProps> = ({
  followers,
  following,
  loading,
  openFollowersDialog,
  openFollowingDialog
}) => {
  return (
    <div className="mt-1 flex items-center justify-center text-black font-semibold space-x-1 text-sm">
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <button 
            onClick={openFollowersDialog}
            className="text-black hover:underline transition-colors"
          >
            {followers} Followers
          </button>
          <span className="text-black opacity-70">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
          <button 
            onClick={openFollowingDialog}
            className="text-black hover:underline transition-colors"
          >
            Following {following}
          </button>
        </>
      )}
    </div>
  );
};

export default FollowStats;
