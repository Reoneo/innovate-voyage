
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useEthFollowData } from '@/hooks/useEthFollowData';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface FollowerStatsProps {
  address?: string;
  ensName?: string;
}

const FollowerStats: React.FC<FollowerStatsProps> = ({ 
  address, 
  ensName
}) => {
  const addressOrEns = ensName || address;
  const { followersCount, followingCount, loading } = useEthFollowData(addressOrEns);
  
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  
  if (!addressOrEns) return null;
  
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };
  
  return (
    <div className="flex items-center justify-center gap-4 w-full mt-2 text-sm text-black">
      <Dialog>
        <DialogTrigger asChild>
          <button 
            className="flex items-center gap-1 hover:text-primary transition-colors text-black cursor-pointer"
            onClick={() => setActiveTab('followers')}
          >
            <span className="font-medium text-black">{loading ? '...' : formatCount(followersCount)}</span>
            <span className="text-black">Followers</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {addressOrEns} • {activeTab === 'followers' ? 'Followers' : 'Following'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex border-b mb-4">
            <button 
              className={`px-4 py-2 ${activeTab === 'followers' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveTab('followers')}
            >
              Followers
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'following' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveTab('following')}
            >
              Following
            </button>
          </div>
          <div className="py-4">
            {loading ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>This feature is coming soon!</p>
                  <p className="text-sm">{activeTab === 'followers' ? formatCount(followersCount) : formatCount(followingCount)} {activeTab}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog>
        <DialogTrigger asChild>
          <button
            className="flex items-center gap-1 hover:text-primary transition-colors text-black cursor-pointer"
            onClick={() => setActiveTab('following')}
          >
            <span className="font-medium text-black">{loading ? '...' : formatCount(followingCount)}</span>
            <span className="text-black">Following</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {addressOrEns} • {activeTab === 'followers' ? 'Followers' : 'Following'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex border-b mb-4">
            <button 
              className={`px-4 py-2 ${activeTab === 'followers' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveTab('followers')}
            >
              Followers
            </button>
            <button 
              className={`px-4 py-2 ${activeTab === 'following' ? 'border-b-2 border-primary font-medium' : ''}`}
              onClick={() => setActiveTab('following')}
            >
              Following
            </button>
          </div>
          <div className="py-4">
            {loading ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>This feature is coming soon!</p>
                  <p className="text-sm">{activeTab === 'followers' ? formatCount(followersCount) : formatCount(followingCount)} {activeTab}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowerStats;
