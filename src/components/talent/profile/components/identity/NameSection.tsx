
import React, { useState } from 'react';
import { useEfpStats } from '@/hooks/useEfpStats';
import { useToast } from '@/hooks/use-toast'; // Keep this if used by useEfpStats or other parts
import FollowStats from './FollowStats';
import FollowersDialog from './FollowersDialog';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast as sonnerToast } from 'sonner'; // Renamed to avoid conflict if useToast().toast is different
import { Badge } from '@/components/ui/badge';

interface NameSectionProps {
  name: string;
  ownerAddress: string;
  displayIdentity?: string;
  bio?: string;
  keywords?: string[];
}

const NameSection: React.FC<NameSectionProps> = ({
  name,
  ownerAddress,
  displayIdentity,
  bio,
  keywords = []
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
  const { toast } = useToast(); // This is shadcn/ui toast from use-toast hook
  const [followLoading, setFollowLoading] = useState<{ [key: string]: boolean }>({});

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
    const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
    if (!connectedWalletAddress) {
      const event = new CustomEvent('open-wallet-connect');
      document.dispatchEvent(event);
      toast({ // Using shadcn/ui toast
        title: "Wallet Connection Required",
        description: "Please connect your wallet first to follow this address",
        variant: "default"
      });
      return;
    }
    try {
      setFollowLoading(prev => ({ ...prev, [address]: true }));
      await followAddress(address);
    } catch (error) {
      console.error('Follow error:', error);
      // Error is already handled in useEfpFollow hook
    } finally {
      setFollowLoading(prev => ({ ...prev, [address]: false }));
    }
  };

  const copyOwnerAddressToClipboard = () => {
    if (ownerAddress) {
      navigator.clipboard.writeText(ownerAddress);
      sonnerToast.success("Address copied to clipboard"); // Using sonner toast
    }
  };

  return (
    <div className="mt-2 text-center mx-auto px-0 my-0 max-w-md"> {/* Added max-w-md for better centering of content */}
      {/* Follow Stats - Moved up */}
      <FollowStats
        followers={followers}
        following={following}
        loading={loading}
        openFollowersDialog={openFollowersDialog}
        openFollowingDialog={openFollowingDialog}
      />

      {/* Display Name and Copy Button */}
      <div className="flex items-center justify-center gap-2 mt-3 mb-3">
        <h3 className="text-2xl font-semibold">{displayName}</h3>
        {ownerAddress && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={copyOwnerAddressToClipboard}
            title="Copy owner address"
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* ENS Bio */}
      {bio && (
        <p className="text-sm text-muted-foreground my-3 px-2 leading-relaxed">
          {bio}
        </p>
      )}

      {/* ENS Keywords */}
      {keywords && keywords.length > 0 && (
        <div className="my-3 flex flex-wrap justify-center gap-2 px-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Followers/Following Dialog - remains for functionality */}
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
