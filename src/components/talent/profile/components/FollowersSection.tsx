
import React, { useState } from 'react';
import { useEthFollowStats, useEthFollowFollowers, useEthFollowFollowing } from '@/hooks/useEthFollow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, X } from 'lucide-react';

interface FollowersSectionProps {
  walletAddress?: string;
  ensName?: string;
}

interface FollowerData {
  address: string;
  ens_name?: string;
  avatar_url?: string;
  bio?: string;
}

const FollowersSection: React.FC<FollowersSectionProps> = ({ walletAddress, ensName }) => {
  // Prefer ENS name if available, otherwise use wallet address
  const addressOrEns = ensName || walletAddress;
  const { stats, loading: statsLoading, error: statsError } = useEthFollowStats(addressOrEns);
  
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('followers');
  const [sortOption, setSortOption] = useState<string>('recent');
  
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

  const closeFollowDialog = () => {
    setShowFollowDialog(false);
  };

  return (
    <div className="py-2 w-full">
      {statsLoading ? (
        <div className="flex justify-center py-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : statsError ? (
        <div className="text-xs text-red-500 mt-1">{statsError}</div>
      ) : stats ? (
        <div className="flex justify-center space-x-6 mt-2">
          <button 
            onClick={() => openFollowDialog('followers')}
            className="text-sm text-foreground hover:underline focus:outline-none"
          >
            <span className="font-bold">{stats.followers_count || "0"}</span> Followers
          </button>
          <button 
            onClick={() => openFollowDialog('following')}
            className="text-sm text-foreground hover:underline focus:outline-none"
          >
            Following <span className="font-bold">{stats.following_count || "0"}</span>
          </button>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground text-center py-2">
          No follower data available
        </div>
      )}

      {/* Followers/Following Dialog - Redesigned to match the provided image */}
      <Dialog open={showFollowDialog} onOpenChange={setShowFollowDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden p-0">
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <span className="text-xl">🔥</span>
                </div>
                <h2 className="text-xl font-semibold">Ethereum Follow Protocol</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeFollowDialog}
                className="rounded-full h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Profile section */}
            <div className="flex flex-col items-center py-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={ensName ? `https://metadata.ens.domains/mainnet/avatar/${ensName}` : undefined} />
                <AvatarFallback>{ensName?.substring(0, 2).toUpperCase() || walletAddress?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-bold mb-1">{ensName || walletAddress?.substring(0, 6) + '...' + walletAddress?.substring(38)}</h3>
              <p className="text-gray-500 mb-4">{ensName || walletAddress?.substring(0, 6) + '...' + walletAddress?.substring(38)}</p>

              {/* Tabs */}
              <div className="w-full px-4">
                <Tabs 
                  defaultValue={activeTab} 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="flex gap-4 mb-4">
                    <TabsList className="h-auto p-1 bg-gray-100 rounded-lg">
                      <TabsTrigger 
                        value="following" 
                        className={`px-4 py-2 ${activeTab === 'following' ? 'bg-white shadow' : ''}`}
                      >
                        Following <span className="font-bold ml-1">{stats?.following_count || "0"}</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="followers" 
                        className={`px-4 py-2 ${activeTab === 'followers' ? 'bg-white shadow' : ''}`}
                      >
                        Followers <span className="font-bold ml-1">{stats?.followers_count || "0"}</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="ml-auto">
                      <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort: Recent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Sort: Recent</SelectItem>
                          <SelectItem value="followers">Sort: Followers</SelectItem>
                          <SelectItem value="following">Sort: Following</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <TabsContent value="followers" className="h-[40vh] overflow-y-auto">
                    {followersLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : followers && followers.length > 0 ? (
                      <div className="space-y-2">
                        {followers.map((follower: FollowerData) => (
                          <div key={follower.address} className="flex items-center p-3 hover:bg-gray-50 rounded-md">
                            <Avatar className="h-12 w-12 mr-3">
                              <AvatarImage src={follower.avatar_url} />
                              <AvatarFallback>{follower.ens_name?.substring(0, 2).toUpperCase() || follower.address.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold">{follower.ens_name || follower.address.substring(0, 6) + '...' + follower.address.substring(38)}</p>
                              <p className="text-sm text-gray-500">{follower.ens_name ? follower.address.substring(0, 6) + '...' + follower.address.substring(38) : ''}</p>
                              {follower.bio && <p className="text-sm truncate">{follower.bio}</p>}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`/${follower.ens_name || follower.address}`, '_blank')}
                              className="ml-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="ml-1">Profile</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No followers found</p>
                    )}
                  </TabsContent>

                  <TabsContent value="following" className="h-[40vh] overflow-y-auto">
                    {followingLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : following && following.length > 0 ? (
                      <div className="space-y-2">
                        {following.map((followedUser: FollowerData) => (
                          <div key={followedUser.address} className="flex items-center p-3 hover:bg-gray-50 rounded-md">
                            <Avatar className="h-12 w-12 mr-3">
                              <AvatarImage src={followedUser.avatar_url} />
                              <AvatarFallback>{followedUser.ens_name?.substring(0, 2).toUpperCase() || followedUser.address.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold">{followedUser.ens_name || followedUser.address.substring(0, 6) + '...' + followedUser.address.substring(38)}</p>
                              <p className="text-sm text-gray-500">{followedUser.ens_name ? followedUser.address.substring(0, 6) + '...' + followedUser.address.substring(38) : ''}</p>
                              {followedUser.bio && <p className="text-sm truncate">{followedUser.bio}</p>}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`/${followedUser.ens_name || followedUser.address}`, '_blank')}
                              className="ml-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="ml-1">Profile</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No following found</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {/* Connect wallet button */}
            <div className="mt-auto p-4 border-t">
              <Button className="w-full flex items-center justify-center gap-2">
                <span>🔗</span> Connect Wallet and Follow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowersSection;
