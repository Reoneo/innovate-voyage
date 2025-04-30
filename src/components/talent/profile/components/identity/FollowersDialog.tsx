
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ExternalLink, UserPlus, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EfpPerson } from '@/hooks/useEfpStats';

function shortenAddress(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogType: 'followers' | 'following';
  followersList: EfpPerson[] | undefined;
  followingList: EfpPerson[] | undefined;
  handleFollow: (address: string) => Promise<void>;
  isFollowing: (address: string) => boolean;
  followLoading: { [key: string]: boolean };
  isProcessing?: boolean;
}

const FollowersDialog: React.FC<FollowersDialogProps> = ({ 
  open, 
  onOpenChange, 
  dialogType, 
  followersList, 
  followingList,
  handleFollow,
  isFollowing,
  followLoading,
  isProcessing = false
}) => {
  const efpLogo = 'https://storage.googleapis.com/zapper-fi-assets/apps%2Fethereum-follow-protocol.png';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img 
              src={efpLogo}
              className="h-6 w-6 rounded-full"
              alt="EFP"
            />
            {dialogType === 'followers' ? 'Followers' : 'Following'}
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
                      disabled={isProcessing}
                      onClick={() => handleFollow(follower.address)}
                    >
                      <img 
                        src={efpLogo}
                        className="h-4 w-4 rounded-full"
                        alt="EFP"
                      />
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Processing
                        </>
                      ) : isFollowing(follower.address) ? (
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
                      disabled={true}
                      onClick={() => {}} // No unfollow functionality in EFP
                    >
                      <img 
                        src={efpLogo}
                        className="h-4 w-4 rounded-full"
                        alt="EFP"
                      />
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
          ) : (
            <p className="text-center text-muted-foreground">No {dialogType} found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
