
import React, { useState, useEffect } from 'react';
import { fetchFollowStats, fetchFollowers, fetchFollowing } from '@/api/services/ethFollowService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface FollowersSectionProps {
  ensNameOrAddress: string;
}

interface FollowStats {
  followers_count: string;
  following_count: string;
}

interface FollowerData {
  address: string;
  updated_at: string;
  ens_name?: string;
}

const FollowersSection: React.FC<FollowersSectionProps> = ({ ensNameOrAddress }) => {
  const [stats, setStats] = useState<FollowStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<FollowerData[]>([]);
  const [following, setFollowing] = useState<FollowerData[]>([]);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      if (!ensNameOrAddress) return;
      
      setLoading(true);
      try {
        const data = await fetchFollowStats(ensNameOrAddress);
        setStats(data);
      } catch (error) {
        console.error('Error fetching follow stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, [ensNameOrAddress]);

  const handleShowFollowers = async () => {
    if (!ensNameOrAddress) return;
    
    try {
      const data = await fetchFollowers(ensNameOrAddress);
      setFollowers(data?.followers || []);
      setShowFollowersDialog(true);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const handleShowFollowing = async () => {
    if (!ensNameOrAddress) return;
    
    try {
      const data = await fetchFollowing(ensNameOrAddress);
      setFollowing(data?.following || []);
      setShowFollowingDialog(true);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const navigateToProfile = (address: string) => {
    setShowFollowersDialog(false);
    setShowFollowingDialog(false);
    navigate(`/${address}`);
  };

  if (loading) {
    return (
      <div className="flex gap-4 items-center justify-center mt-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  // If no stats or both counts are 0, hide this section
  if (!stats || (stats.followers_count === "0" && stats.following_count === "0")) {
    return null;
  }

  return (
    <div className="flex gap-6 items-center justify-center mt-1 text-sm">
      <Button 
        variant="link" 
        className="font-medium p-0 h-auto text-black hover:text-primary"
        onClick={handleShowFollowers}
      >
        {stats.followers_count} Followers
      </Button>
      
      <Button 
        variant="link" 
        className="font-medium p-0 h-auto text-black hover:text-primary"
        onClick={handleShowFollowing}
      >
        Following {stats.following_count}
      </Button>

      {/* Followers Dialog */}
      <Dialog open={showFollowersDialog} onOpenChange={setShowFollowersDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          {followers.length > 0 ? (
            <div className="space-y-4">
              {followers.map((follower, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer" onClick={() => navigateToProfile(follower.address)}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://metadata.ens.domains/mainnet/avatar/${follower.ens_name || follower.address}`} />
                    <AvatarFallback>{(follower.ens_name || follower.address).substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{follower.ens_name || `${follower.address.substring(0, 6)}...${follower.address.substring(follower.address.length - 4)}`}</p>
                    <p className="text-xs text-muted-foreground">{new Date(follower.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No followers found
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Following Dialog */}
      <Dialog open={showFollowingDialog} onOpenChange={setShowFollowingDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          {following.length > 0 ? (
            <div className="space-y-4">
              {following.map((follow, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer" onClick={() => navigateToProfile(follow.data || follow.address)}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://metadata.ens.domains/mainnet/avatar/${follow.data || follow.address}`} />
                    <AvatarFallback>{(follow.data || follow.address).substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{follow.data || `${follow.address?.substring(0, 6)}...${follow.address?.substring(follow.address.length - 4)}`}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No following found
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowersSection;
