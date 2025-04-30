
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
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
                  <a 
                    href={`/${follower.ensName || follower.address}/`}
                    className="flex items-center gap-3 flex-grow hover:text-primary"
                  >
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
                  </a>
                </div>
              ))}
            </div>
          ) : (dialogType === 'following' && followingList && followingList.length > 0) ? (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {followingList.map((following, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <a 
                    href={`/${following.ensName || following.address}/`}
                    className="flex items-center gap-3 flex-grow hover:text-primary"
                  >
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
                  </a>
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
