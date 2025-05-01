
import React, { useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EfpPerson } from "@/hooks/efp/types";

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogType: 'followers' | 'following';
  followersList: EfpPerson[];
  followingList: EfpPerson[];
  handleFollow: (address: string) => void;
  isFollowing: (address: string) => boolean;
  followLoading: {[key: string]: boolean};
  isProcessing: boolean;
  loadMoreFollowers?: () => void;
  loadMoreFollowing?: () => void;
  hasMoreFollowers?: boolean;
  hasMoreFollowing?: boolean;
  isLoadingMore?: boolean;
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
  isProcessing,
  loadMoreFollowers,
  loadMoreFollowing,
  hasMoreFollowers = false,
  hasMoreFollowing = false,
  isLoadingMore = false
}) => {
  const followersEndRef = useRef<HTMLDivElement>(null);
  const followingEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup intersection observer for followers infinite scroll
  const setupObserver = useCallback(() => {
    if (!open) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        
        if (dialogType === 'followers' && hasMoreFollowers && loadMoreFollowers) {
          loadMoreFollowers();
        } else if (dialogType === 'following' && hasMoreFollowing && loadMoreFollowing) {
          loadMoreFollowing();
        }
      },
      { threshold: 0.5 }
    );
    
    if (dialogType === 'followers' && followersEndRef.current) {
      observerRef.current.observe(followersEndRef.current);
    } else if (dialogType === 'following' && followingEndRef.current) {
      observerRef.current.observe(followingEndRef.current);
    }
  }, [dialogType, open, hasMoreFollowers, hasMoreFollowing, loadMoreFollowers, loadMoreFollowing]);

  // Setup observer when tab changes
  useEffect(() => {
    if (open) {
      setupObserver();
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [dialogType, open, setupObserver]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Network</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={dialogType} onValueChange={(value) => setupObserver()}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="followers" className="max-h-96 overflow-y-auto">
            {followersList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No followers yet</p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                {followersList.map((follower) => (
                  <FollowerItem 
                    key={follower.address}
                    person={follower}
                    handleFollow={handleFollow}
                    isFollowing={isFollowing}
                    isFollowLoading={followLoading[follower.address] || isProcessing}
                  />
                ))}
                <div ref={followersEndRef} className="h-8 w-full">
                  {isLoadingMore && hasMoreFollowers && (
                    <div className="flex justify-center py-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="following" className="max-h-96 overflow-y-auto">
            {followingList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Not following anyone yet</p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                {followingList.map((following) => (
                  <FollowerItem 
                    key={following.address}
                    person={following}
                    handleFollow={handleFollow}
                    isFollowing={isFollowing}
                    isFollowLoading={followLoading[following.address] || isProcessing}
                  />
                ))}
                <div ref={followingEndRef} className="h-8 w-full">
                  {isLoadingMore && hasMoreFollowing && (
                    <div className="flex justify-center py-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const FollowerItem = ({ 
  person, 
  handleFollow, 
  isFollowing,
  isFollowLoading
}: { 
  person: EfpPerson, 
  handleFollow: (address: string) => void, 
  isFollowing: (address: string) => boolean,
  isFollowLoading: boolean
}) => {
  const displayName = person.ensName || 
    `${person.address.substring(0, 6)}...${person.address.substring(person.address.length - 4)}`;
  
  return (
    <div className="flex items-center justify-between bg-muted/40 rounded-lg p-2">
      <Link to={`/${person.ensName || person.address}`} className="flex items-center gap-2 flex-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={person.avatar || ''} />
          <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="font-medium truncate">{displayName}</span>
      </Link>
      <Button 
        variant={isFollowing(person.address) ? "secondary" : "outline"}
        size="sm"
        onClick={() => handleFollow(person.address)}
        disabled={isFollowLoading}
        className="ml-2"
      >
        {isFollowLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : isFollowing(person.address) ? "Following" : "Follow"}
      </Button>
    </div>
  );
};

export default FollowersDialog;
