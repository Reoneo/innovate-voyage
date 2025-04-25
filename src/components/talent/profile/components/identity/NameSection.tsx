
import React, { useState } from 'react';
import AddressDisplay from './AddressDisplay';
import { useEfpStats } from '@/hooks/useEfpStats';
import { useToast } from '@/hooks/use-toast';
import { FollowersDialog } from '../followers/FollowersDialog';
import { FollowStats } from '../followers/FollowStats';

interface NameSectionProps {
  name: string;
  ownerAddress: string;
  displayIdentity?: string;
}

const NameSection: React.FC<NameSectionProps> = ({ name, ownerAddress, displayIdentity }) => {
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/)
    ? `${name}.eth`
    : name);
  
  const { followers, following, followersList, followingList, loading, followAddress, isFollowing } = useEfpStats(ownerAddress);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'followers' | 'following'>('followers');
  const { toast } = useToast();
  const [followLoading, setFollowLoading] = useState<{[key: string]: boolean}>({});

  const handleFollow = async (address: string) => {
    if (!address) return;
    
    setFollowLoading(prev => ({ ...prev, [address]: true }));
    
    try {
      await followAddress(address);
      toast({
        title: "Success!",
        description: "You are now following this address"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow. Please connect your wallet first.",
        variant: "destructive"
      });
      console.error('Follow error:', error);
    } finally {
      setFollowLoading(prev => ({ ...prev, [address]: false }));
    }
  };

  const openFollowersDialog = () => {
    setDialogType('followers');
    setDialogOpen(true);
  };

  const openFollowingDialog = () => {
    setDialogType('following');
    setDialogOpen(true);
  };

  return (
    <div className="mt-2 text-center">
      <h3 className="text-2xl font-semibold">{displayName}</h3>
      <div className="flex items-center justify-center gap-2 mt-1">
        <AddressDisplay address={ownerAddress} />
      </div>
      
      <FollowStats
        followers={followers}
        following={following}
        loading={loading}
        onOpenFollowers={openFollowersDialog}
        onOpenFollowing={openFollowingDialog}
      />

      <FollowersDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={dialogType}
        list={dialogType === 'followers' ? followersList : followingList}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        followLoading={followLoading}
      />
    </div>
  );
};

export default NameSection;
