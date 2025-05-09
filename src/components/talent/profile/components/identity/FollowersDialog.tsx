
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEfpStats } from '@/hooks/useEfpStats';
import { Skeleton } from '@/components/ui/skeleton';
import AddressDisplay from './AddressDisplay';
import { X } from 'lucide-react';
import { EfpPerson } from '@/hooks/useEfpStats';

interface FollowProps {
  name?: string;
  address: string;
  avatar?: string;
  timestamp?: number;
}

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress?: string;
  dialogType?: 'followers' | 'following';
  followersList?: FollowProps[];
  followingList?: FollowProps[];
  handleFollow?: (address: string) => Promise<void>;
  isFollowing?: (address: string) => boolean;
  followLoading?: {[key: string]: boolean};
  isProcessing?: boolean;
}

const FollowersDialog: React.FC<FollowersDialogProps> = ({ 
  walletAddress, 
  open, 
  onOpenChange,
  dialogType = 'followers',
  followersList: externalFollowersList,
  followingList: externalFollowingList,
  handleFollow,
  isFollowing,
  followLoading,
  isProcessing
}) => {
  const [activeTab, setActiveTab] = useState(dialogType);
  const { 
    followers: statsFollowers, 
    following: statsFollowing, 
    followersList, 
    followingList,
    loading, 
    refreshData 
  } = useEfpStats(walletAddress);

  // Use external data if provided, otherwise use data from useEfpStats
  const actualFollowersList = externalFollowersList || followersList;
  const actualFollowingList = externalFollowingList || followingList;

  useEffect(() => {
    if (open && walletAddress) {
      refreshData();
    }
    
    // Update active tab when dialogType prop changes
    if (dialogType) {
      setActiveTab(dialogType);
    }
  }, [open, walletAddress, refreshData, dialogType]);

  const FollowList = ({ items, isLoading }: { items: FollowProps[] | undefined, isLoading: boolean }) => {
    if (isLoading) {
      return (
        <div className="space-y-4 pt-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No {activeTab} found
        </div>
      );
    }

    return (
      <div className="space-y-4 pt-4">
        {items.map((item) => (
          <div key={item.address} className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-gray-200">
              <AvatarImage src={item.avatar} alt={item.name || item.address} />
              <AvatarFallback>{item.name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div>
              {item.name && <div className="font-medium">{item.name}</div>}
              <AddressDisplay address={item.address} />
            </div>
            {handleFollow && isFollowing && item.address !== walletAddress && (
              <Button 
                variant={isFollowing(item.address) ? "secondary" : "default"}
                size="sm"
                className="ml-auto"
                onClick={() => handleFollow(item.address)}
                disabled={followLoading?.[item.address] || isProcessing}
              >
                {isFollowing(item.address) ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Followers & Following</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            View followers and accounts you follow.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="followers">
            <FollowList items={actualFollowersList} isLoading={loading} />
          </TabsContent>
          <TabsContent value="following">
            <FollowList items={actualFollowingList} isLoading={loading} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
