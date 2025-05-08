
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AddressDisplay from './AddressDisplay';
import { Loader, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogType: 'followers' | 'following';
  followersList: Array<{ address: string; ensName?: string; avatar?: string }>;
  followingList: Array<{ address: string; ensName?: string; avatar?: string }>;
  handleFollow: (address: string) => void;
  isFollowing: (address: string) => boolean;
  followLoading: { [key: string]: boolean };
  isProcessing: boolean;
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
  isProcessing
}) => {
  const listToShow = dialogType === 'followers' ? followersList : followingList;

  // Generate initials for the fallback
  const getInitials = (name: string): string => {
    if (!name) return 'BP';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-center flex-1">
            {dialogType === 'followers' ? 'Followers' : 'Following'}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)} 
            className="absolute right-4 top-4"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {isProcessing ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-sm">Loading...</span>
            </div>
          ) : listToShow.length > 0 ? (
            <ul className="space-y-2">
              {listToShow.map((item, index) => (
                <React.Fragment key={item.address}>
                  <li className="flex items-center justify-between">
                    <Link 
                      to={`/${item.ensName || item.address}`} 
                      className="flex items-center gap-2 flex-1"
                      onClick={() => onOpenChange(false)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.avatar} alt={item.ensName || item.address} />
                        <AvatarFallback>{getInitials(item.ensName || '')}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        {item.ensName && <span className="text-sm font-medium">{item.ensName}</span>}
                        <AddressDisplay address={item.address} className="text-xs" />
                      </div>
                    </Link>
                    
                    {dialogType === 'followers' && (
                      <Button 
                        variant={isFollowing(item.address) ? "outline" : "default"} 
                        size="sm" 
                        onClick={() => handleFollow(item.address)}
                        disabled={followLoading[item.address]}
                        className="ml-2"
                      >
                        {followLoading[item.address] ? (
                          <Loader className="h-3 w-3 animate-spin" />
                        ) : isFollowing(item.address) ? (
                          'Following'
                        ) : (
                          'Follow'
                        )}
                      </Button>
                    )}
                  </li>
                  {index < listToShow.length - 1 && <Separator className="my-2" />}
                </React.Fragment>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {dialogType === 'followers' ? 'No followers yet' : 'Not following anyone'}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
