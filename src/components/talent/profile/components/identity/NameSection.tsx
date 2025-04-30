
import React, { useState } from 'react';
import AddressDisplay from './AddressDisplay';
import { useEfpStats } from '@/hooks/useEfpStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ExternalLink, UserPlus, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface NameSectionProps {
  name: string;
  ownerAddress: string;
  displayIdentity?: string;
}

function shortenAddress(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

const NameSection: React.FC<NameSectionProps> = ({ name, ownerAddress, displayIdentity }) => {
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/)
    ? `${name}.eth`
    : name);
  
  const { 
    followers, 
    following, 
    followersList, 
    followingList, 
    mutualFollows,
    mutualFollowsList,
    loading, 
    followAddress, 
    isFollowing 
  } = useEfpStats(ownerAddress);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'followers' | 'following' | 'mutuals'>('followers');
  const { toast } = useToast();
  const [followLoading, setFollowLoading] = useState<{[key: string]: boolean}>({});

  // Check if the user is connected
  const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
  const isConnected = !!connectedWalletAddress;
  const isSelf = connectedWalletAddress && connectedWalletAddress.toLowerCase() === ownerAddress?.toLowerCase();

  const openFollowersDialog = () => {
    setDialogType('followers');
    setDialogOpen(true);
  };

  const openFollowingDialog = () => {
    setDialogType('following');
    setDialogOpen(true);
  };

  const openMutualsDialog = () => {
    setDialogType('mutuals');
    setDialogOpen(true);
  };

  const handleFollow = async (address: string) => {
    if (!address) return;

    // Check if wallet is connected
    if (!isConnected) {
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
    
    setFollowLoading(prev => ({ ...prev, [address]: true }));
    
    try {
      await followAddress(address);
      toast({
        title: "Success!",
        description: "You are now following this address"
      });
    } catch (error) {
      console.error('Follow error:', error);
      toast({
        title: "Error",
        description: "Failed to follow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setFollowLoading(prev => ({ ...prev, [address]: false }));
    }
  };

  const efpLogo = 'https://storage.googleapis.com/zapper-fi-assets/apps%2Fethereum-follow-protocol.png';

  return (
    <div className="mt-2 text-center">
      <h3 className="text-2xl font-semibold">{displayName}</h3>
      <div className="flex items-center justify-center gap-2 mt-1">
        <AddressDisplay address={ownerAddress} />
      </div>
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
            
            {mutualFollows && mutualFollows > 0 && !isSelf && (
              <>
                <span className="text-black opacity-70">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                <button 
                  onClick={openMutualsDialog}
                  className="text-black hover:underline transition-colors flex items-center gap-1"
                >
                  <Users className="h-3 w-3" /> {mutualFollows} Mutual
                </button>
              </>
            )}
          </>
        )}
      </div>
      
      {!isSelf && isConnected && (
        <div className="mt-3">
          <Button 
            variant={isFollowing(ownerAddress) ? "outline" : "default"}
            size="sm"
            className="flex items-center gap-1"
            disabled={followLoading[ownerAddress]}
            onClick={() => handleFollow(ownerAddress)}
          >
            {isFollowing(ownerAddress) ? (
              <>
                <Check className="h-4 w-4" /> Following
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Follow
              </>
            )}
          </Button>
        </div>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img 
                src={efpLogo}
                className="h-6 w-6 rounded-full"
                alt="EFP"
              />
              {dialogType === 'followers' ? 'Followers' : dialogType === 'following' ? 'Following' : 'Mutual Follows'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {(dialogType === 'followers' && followersList && followersList.length > 0) ? (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {followersList.map((follower, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={follower.avatar} />
                        <AvatarFallback>
                          {follower.ensName
                            ? follower.ensName.substring(0, 2).toUpperCase()
                            : shortenAddress(follower.address).substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{follower.ensName || shortenAddress(follower.address)}</p>
                        {follower.ensName && (
                          <p className="text-xs text-muted-foreground">{shortenAddress(follower.address)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant={isFollowing(follower.address) ? "outline" : "default"}
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={followLoading[follower.address] || !isConnected}
                        onClick={() => handleFollow(follower.address)}
                      >
                        {isFollowing(follower.address) ? (
                          <>
                            <Check className="h-4 w-4" /> Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" /> Follow
                          </>
                        )}
                      </Button>
                      <a 
                        href={`/${follower.ensName || follower.address}`}
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (dialogType === 'following' && followingList && followingList.length > 0) ? (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {followingList.map((following, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={following.avatar} />
                        <AvatarFallback>
                          {following.ensName
                            ? following.ensName.substring(0, 2).toUpperCase()
                            : shortenAddress(following.address).substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{following.ensName || shortenAddress(following.address)}</p>
                        {following.ensName && (
                          <p className="text-xs text-muted-foreground">{shortenAddress(following.address)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={followLoading[following.address] || !isConnected}
                        onClick={() => handleFollow(following.address)}
                      >
                        <Check className="h-4 w-4" /> Following
                      </Button>
                      <a 
                        href={`/${following.ensName || following.address}`}
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (dialogType === 'mutuals' && mutualFollowsList && mutualFollowsList.length > 0) ? (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {mutualFollowsList.map((mutual, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={mutual.avatar} />
                        <AvatarFallback>
                          {mutual.ensName
                            ? mutual.ensName.substring(0, 2).toUpperCase()
                            : shortenAddress(mutual.address).substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{mutual.ensName || shortenAddress(mutual.address)}</p>
                        {mutual.ensName && (
                          <p className="text-xs text-muted-foreground">{shortenAddress(mutual.address)}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" /> Mutual
                      </Button>
                      <a 
                        href={`/${mutual.ensName || mutual.address}`}
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No {dialogType} found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NameSection;
