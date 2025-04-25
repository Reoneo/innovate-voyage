
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FollowerListItem } from './FollowerListItem';

interface FollowerData {
  address: string;
  ensName?: string;
  avatar?: string;
}

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'followers' | 'following';
  list?: FollowerData[];
  isFollowing: (address: string) => boolean;
  onFollow: (address: string) => Promise<void>;
  followLoading: { [key: string]: boolean };
}

export function FollowersDialog({
  open,
  onOpenChange,
  type,
  list = [],
  isFollowing,
  onFollow,
  followLoading,
}: FollowersDialogProps) {
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
            {type === 'followers' ? 'Followers' : 'Following'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {list && list.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {list.map((item, index) => (
                <FollowerListItem
                  key={index}
                  address={item.address}
                  ensName={item.ensName}
                  avatar={item.avatar}
                  isFollowing={isFollowing(item.address)}
                  onFollow={onFollow}
                  isLoading={followLoading[item.address] || false}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No {type} found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
