
import React, { useState } from 'react';
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

const NameSection: React.FC<NameSectionProps> = ({
  name,
  ownerAddress,
  displayIdentity
}) => {
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/) ? `${name}.eth` : name);
  const {
    followers,
    following,
    followersList,
    followingList,
    loading,
    followAddress,
    isFollowing,
    isProcessing
  } = useEfpStats(ownerAddress);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'followers' | 'following'>('followers');
  const {
    toast
  } = useToast();
  const [followLoading, setFollowLoading] = useState<{
    [key: string]: boolean;
  }>({});

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
      await followAddress(address);
    } catch (error) {
      console.error('Follow error:', error);
      // Error is already handled in useEfpFollow
    }
  };

  return <div className="mt-2 text-center mx-0 px-0 my-0">
      {/* Follow Stats - MOVED UP */}
      <FollowStats 
        followers={followers} 
        following={following} 
        loading={loading} 
        openFollowersDialog={openFollowersDialog} 
        openFollowingDialog={openFollowingDialog} 
      />
      
      {/* Name - Added mt-2 for spacing */}
      <h3 className="text-2xl font-semibold mt-2">{displayName}</h3>
      
      {/* Address */}
      <div className="flex items-center justify-center gap-2 mt-1 my-0">
        <AddressDisplay address={ownerAddress} />
      </div>
      
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
    </div>;
};

export default NameSection;
