
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogType: 'followers' | 'following';
  followersList?: any[];
  followingList?: any[];
  handleFollow?: (address: string) => Promise<void>;
  isFollowing?: (address: string) => boolean;
  followLoading?: {[key: string]: boolean};
  isProcessing?: boolean;
}

const FollowersDialog: React.FC<FollowersDialogProps> = ({
  open,
  onOpenChange,
  dialogType,
  followersList = [],
  followingList = []
}) => {
  const list = dialogType === 'followers' ? followersList : followingList;
  const title = dialogType === 'followers' ? 'Followers' : 'Following';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="text-center text-muted-foreground py-8">
          No {dialogType} found
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
