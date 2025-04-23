
import React, { useState } from 'react';
import AddressDisplay from './AddressDisplay';
import { useEfpStats } from '@/hooks/useEfpStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ExternalLink } from 'lucide-react';

interface NameSectionProps {
  name: string;
  ownerAddress: string;
  displayIdentity?: string;
}

const NameSection: React.FC<NameSectionProps> = ({ name, ownerAddress, displayIdentity }) => {
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/)
    ? `${name}.eth`
    : name);
  
  const { followers, following, followersList, followingList, loading } = useEfpStats(ownerAddress);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'followers' | 'following'>('followers');

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
      {/* EFP stats */}
      <div className="mt-1 flex items-center justify-center text-[#9b87f5] font-semibold space-x-1 text-sm">
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <button 
              onClick={openFollowersDialog}
              className="hover:underline transition-colors"
            >
              {followers} Followers
            </button>
            <span className="opacity-70">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            <button 
              onClick={openFollowingDialog}
              className="hover:underline transition-colors"
            >
              Following {following}
            </button>
          </>
        )}
      </div>

      {/* Dialog for followers/following */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img 
                src="https://storage.googleapis.com/zapper-fi-assets/apps%2Fethereum-follow-protocol.png"
                className="h-6 w-6 rounded-full"
                alt="EFP"
              />
              {dialogType === 'followers' ? 'Followers' : 'Following'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {dialogType === 'followers' && followersList && followersList.length > 0 ? (
              <div className="space-y-3">
                {followersList.map((follower, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={follower.avatar} />
                        <AvatarFallback>{follower.ensName?.substring(0, 2) || "EN"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{follower.ensName || follower.address}</p>
                        {follower.ensName && (
                          <p className="text-xs text-muted-foreground">{follower.address}</p>
                        )}
                      </div>
                    </div>
                    <a 
                      href={`/${follower.ensName || follower.address}`}
                      target="_blank"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                ))}
              </div>
            ) : dialogType === 'following' && followingList && followingList.length > 0 ? (
              <div className="space-y-3">
                {followingList.map((following, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={following.avatar} />
                        <AvatarFallback>{following.ensName?.substring(0, 2) || "EN"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{following.ensName || following.address}</p>
                        {following.ensName && (
                          <p className="text-xs text-muted-foreground">{following.address}</p>
                        )}
                      </div>
                    </div>
                    <a 
                      href={`/${following.ensName || following.address}`}
                      target="_blank"
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink size={16} />
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
    </div>
  );
};

export default NameSection;
