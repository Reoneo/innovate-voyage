
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FollowersDialogHeader from './FollowersDialogHeader';
import FollowersDialogTabs from './FollowersDialogTabs';

interface FollowerData {
  address: string;
  ens_name?: string;
  avatar_url?: string;
  bio?: string;
}

interface FollowersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress?: string;
  ensName?: string;
  followers: FollowerData[];
  following: FollowerData[];
  followersCount: string | number;
  followingCount: string | number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  followersLoading: boolean;
  followingLoading: boolean;
}

const FollowersDialog: React.FC<FollowersDialogProps> = ({
  isOpen,
  onClose,
  walletAddress,
  ensName,
  followers,
  following,
  followersCount,
  followingCount,
  activeTab,
  setActiveTab,
  sortOption,
  setSortOption,
  followersLoading,
  followingLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          <FollowersDialogHeader 
            ensName={ensName}
            walletAddress={walletAddress}
            closeDialog={onClose}
          />
          
          <FollowersDialogTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sortOption={sortOption}
            setSortOption={setSortOption}
            followers={followers}
            following={following}
            followersLoading={followersLoading}
            followingLoading={followingLoading}
            followersCount={followersCount}
            followingCount={followingCount}
          />
          
          {/* Connect wallet button */}
          <div className="mt-auto p-4 border-t">
            <Button className="w-full flex items-center justify-center gap-2">
              <span>🔗</span> Connect Wallet and Follow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
