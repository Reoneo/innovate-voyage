
import React, { useState } from 'react';
import AddressDisplay from './AddressDisplay';
import { useToast } from '@/hooks/use-toast';
import FollowStats from './FollowStats';
import FollowersDialog from './FollowersDialog';

interface NameSectionProps {
  name: string;
  ownerAddress: string;
  displayIdentity?: string;
}

const NameSection: React.FC<NameSectionProps> = ({ name, ownerAddress, displayIdentity }) => {
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/)
    ? `${name}.eth`
    : name);
  
  // Mock data since EFP is removed
  const followers = 0;
  const following = 0;
  const followersList: any[] = [];
  const followingList: any[] = [];
  const loading = false;
  const isProcessing = false;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'followers' | 'following'>('followers');
  const { toast } = useToast();
  const [followLoading, setFollowLoading] = useState<{[key: string]: boolean}>({});

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
    
    // Mock follow implementation
    toast({
      title: "Follow feature disabled",
      description: "Follow functionality has been removed",
      variant: "default"
    });
  };

  const isFollowing = (address: string) => false;

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
