
import React, { useState } from 'react';
import { useEthFollowStats, useEthFollowFollowers, useEthFollowFollowing } from '@/hooks/useEthFollow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface FollowersSectionProps {
  walletAddress?: string;
  ensName?: string;
}

interface FollowerData {
  address: string;
  ens_name?: string;
  avatar_url?: string;
}

const FollowersSection: React.FC<FollowersSectionProps> = ({ walletAddress, ensName }) => {
  // Prefer ENS name if available, otherwise use wallet address
  const addressOrEns = ensName || walletAddress;
  const { stats, loading: statsLoading, error: statsError } = useEthFollowStats(addressOrEns);
  
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  
  // Only fetch follower/following data when the respective dialog is opened
  const { followers, loading: followersLoading } = useEthFollowFollowers(
    showFollowers ? addressOrEns : undefined, 
    50
  );
  
  const { following, loading: followingLoading } = useEthFollowFollowing(
    showFollowing ? addressOrEns : undefined,
    50
  );

  if (!addressOrEns) {
    return null;
  }

  const openFollowersDialog = () => {
    setShowFollowers(true);
  };

  const openFollowingDialog = () => {
    setShowFollowing(true);
  };

  const closeFollowersDialog = () => {
    setShowFollowers(false);
  };

  const closeFollowingDialog = () => {
    setShowFollowing(false);
  };

  return (
    <div className="py-2 w-full">
      {statsLoading ? (
        <div className="flex justify-center py-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : statsError ? (
        <div className="text-xs text-red-500 mt-1">{statsError}</div>
      ) : stats ? (
        <div className="flex justify-center space-x-6 mt-2">
          <button 
            onClick={openFollowersDialog}
            className="text-sm text-foreground hover:underline focus:outline-none"
          >
            <span className="font-bold">{stats.followers_count || "0"}</span> Followers
          </button>
          <button 
            onClick={openFollowingDialog}
            className="text-sm text-foreground hover:underline focus:outline-none"
          >
            Following <span className="font-bold">{stats.following_count || "0"}</span>
          </button>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground text-center py-2">
          No follower data available
        </div>
      )}

      {/* Followers Dialog */}
      <Dialog open={showFollowers} onOpenChange={setShowFollowers}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Followers ({stats?.followers_count || "0"})</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {followersLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : followers && followers.length > 0 ? (
              <div className="space-y-2">
                {followers.map((follower: FollowerData) => (
                  <div key={follower.address} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={follower.avatar_url} />
                      <AvatarFallback>{follower.ens_name?.substring(0, 2) || follower.address.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{follower.ens_name || follower.address.substring(0, 6) + '...' + follower.address.substring(38)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`/${follower.ens_name || follower.address}`, '_blank')}
                      className="ml-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No followers found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog open={showFollowing} onOpenChange={setShowFollowing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Following ({stats?.following_count || "0"})</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {followingLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : following && following.length > 0 ? (
              <div className="space-y-2">
                {following.map((followedUser: FollowerData) => (
                  <div key={followedUser.address} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={followedUser.avatar_url} />
                      <AvatarFallback>{followedUser.ens_name?.substring(0, 2) || followedUser.address.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{followedUser.ens_name || followedUser.address.substring(0, 6) + '...' + followedUser.address.substring(38)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`/${followedUser.ens_name || followedUser.address}`, '_blank')}
                      className="ml-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No following found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowersSection;
