
import React, { useState, useEffect } from 'react';
import AddressDisplay from './AddressDisplay';
import { useEfpStats } from '@/hooks/useEfpStats';
import { useToast } from '@/hooks/use-toast';
import FollowStats from './FollowStats';
import FollowersDialog from './FollowersDialog';

interface NameSectionProps {
  name: string;
  ownerAddress: string;
  displayIdentity?: string;
}

const NameSection: React.FC<NameSectionProps> = ({ name, ownerAddress, displayIdentity }) => {
  // Format display name - either use displayIdentity, or if name looks like a raw address, format as short address
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/)
    ? name.startsWith('0x') && name.length === 42 
      ? `${name.substring(0, 6)}...${name.substring(name.length - 4)}`
      : `${name}.eth`
    : name);
  
  // Use React Query for caching and faster loading
  const { 
    followers, 
    following, 
    followersList, 
    followingList, 
    loading, 
    followAddress, 
    isFollowing, 
    isProcessing,
    refreshData 
  } = useEfpStats(ownerAddress);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'followers' | 'following'>('followers');
  const { toast } = useToast();
  const [followLoading, setFollowLoading] = useState<{[key: string]: boolean}>({});

  // Load EFP data immediately and set up faster polling
  useEffect(() => {
    if (ownerAddress) {
      // Initial fetch with higher priority
      refreshData();
      
      // Set up polling for faster updates (every 5 seconds - reduced from 10)
      const intervalId = setInterval(() => {
        refreshData();
      }, 5000);
      
      return () => clearInterval(intervalId);
    }
  }, [ownerAddress, refreshData]);

  const openFollowersDialog = () => {
    setDialogType('followers');
    setDialogOpen(true);
  };

  const openFollowingDialog = () => {
    setDialogType('following');
    setDialogOpen(true);
  };

  const handleFollow = async (address: string) => {
    if (!address) return;

    // Check if wallet is connected
    const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
    if (!connectedWalletAddress) {
      // Trigger wallet connect modal
      const event = new CustomEvent('open-wallet-connect');
      document.dispatchEvent(event);
      
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet first to follow this address",
        variant: "default"
      });
      return;
    }
    
    try {
      setFollowLoading(prev => ({ ...prev, [address]: true }));
      await followAddress(address);
      
      // Update followers data immediately
      refreshData();
      
      toast({
        title: "Success",
        description: "Follow status updated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Follow error:', error);
      toast({
        title: "Error",
        description: "There was a problem updating follow status",
        variant: "destructive"
      });
    } finally {
      setFollowLoading(prev => ({ ...prev, [address]: false }));
    }
  };

  return (
    <div className="mt-2 text-center">
      <h3 className="text-2xl font-semibold">{displayName}</h3>
      <div className="flex items-center justify-center gap-2 mt-1">
        <AddressDisplay address={ownerAddress} />
      </div>
      
      {/* Follow Stats */}
      <FollowStats 
        followers={followers}
        following={following}
        loading={loading}
        openFollowersDialog={openFollowersDialog}
        openFollowingDialog={openFollowingDialog}
      />
      
      {/* Followers/Following Dialog */}
      <FollowersDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dialogType={dialogType}
        followersList={followersList}
        followingList={followingList}
        handleFollow={handleFollow}
        isFollowing={isFollowing}
        followLoading={followLoading}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default NameSection;
