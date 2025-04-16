
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FollowerListItem from './FollowerListItem';

interface FollowerData {
  address: string;
  ens_name?: string;
  avatar_url?: string;
  bio?: string;
}

interface FollowersDialogTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  followers: FollowerData[];
  following: FollowerData[];
  followersLoading: boolean;
  followingLoading: boolean;
  followersCount: string | number;
  followingCount: string | number;
}

const FollowersDialogTabs: React.FC<FollowersDialogTabsProps> = ({
  activeTab,
  setActiveTab,
  sortOption,
  setSortOption,
  followers,
  following,
  followersLoading,
  followingLoading,
  followersCount,
  followingCount
}) => {
  const renderLoadingState = () => (
    <div className="flex justify-center py-4">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const renderEmptyState = (text: string) => (
    <p className="text-center py-4 text-muted-foreground">{text}</p>
  );

  const renderUserList = (users: FollowerData[]) => (
    <div className="space-y-2">
      {users.map((user) => (
        <FollowerListItem key={user.address} user={user} />
      ))}
    </div>
  );

  return (
    <div className="w-full px-4">
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <TabsList className="h-auto p-1 bg-gray-100 rounded-lg">
            <TabsTrigger 
              value="following" 
              className={`px-4 py-2 ${activeTab === 'following' ? 'bg-white shadow' : ''}`}
            >
              Following <span className="font-bold ml-1">{followingCount || "0"}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="followers" 
              className={`px-4 py-2 ${activeTab === 'followers' ? 'bg-white shadow' : ''}`}
            >
              Followers <span className="font-bold ml-1">{followersCount || "0"}</span>
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
          {followersLoading ? renderLoadingState() : 
            followers && followers.length > 0 ? renderUserList(followers) : 
            renderEmptyState("No followers found")}
        </TabsContent>

        <TabsContent value="following" className="h-[40vh] overflow-y-auto">
          {followingLoading ? renderLoadingState() : 
            following && following.length > 0 ? renderUserList(following) : 
            renderEmptyState("No following found")}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowersDialogTabs;
