
import React, { useState } from 'react';
import { useEthFollowStats, useEthFollowFollowers, useEthFollowFollowing } from '@/hooks/useEthFollow';
import FollowersCountDisplay from './FollowersCountDisplay';
import FollowersDialog from './FollowersDialog';

interface FollowersSectionProps {
  walletAddress?: string;
  ensName?: string;
}

const FollowersSection: React.FC<FollowersSectionProps> = ({ walletAddress, ensName }) => {
  // Prefer ENS name if available, otherwise use wallet address
  const addressOrEns = ensName || walletAddress;
  const { stats, loading: statsLoading, error: statsError } = useEthFollowStats(addressOrEns);
  
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('followers');
  
  // Only fetch follower/following data when the dialog is opened
  const { followers, loading: followersLoading } = useEthFollowFollowers(
    showFollowDialog && activeTab === 'followers' ? addressOrEns : undefined, 
    50
  );
  
  const { following, loading: followingLoading } = useEthFollowFollowing(
    showFollowDialog && activeTab === 'following' ? addressOrEns : undefined,
    50
  );

  if (!addressOrEns) {
    return null;
  }

  const openFollowDialog = (tab: string) => {
    setActiveTab(tab);
    setShowFollowDialog(true);
  };

  return (
    <div className="py-2 w-full">
      <FollowersCountDisplay 
        followersCount={stats?.followers_count || "0"}
        followingCount={stats?.following_count || "0"}
        onOpenFollowers={() => openFollowDialog('followers')}
        onOpenFollowing={() => openFollowDialog('following')}
        isLoading={statsLoading}
        error={statsError}
      />

      <FollowersDialog 
        isOpen={showFollowDialog}
        onClose={() => setShowFollowDialog(false)}
        walletAddress={walletAddress}
        ensName={ensName}
        followers={followers || []}
        following={following || []}
        followersCount={stats?.followers_count || "0"}
        followingCount={stats?.following_count || "0"}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        followersLoading={followersLoading}
        followingLoading={followingLoading}
      />
    </div>
  );
};

export default FollowersSection;
