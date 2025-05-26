import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { shortenAddress } from '@/hooks/efp/utils';
import { EfpPerson } from '@/hooks/efp/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';

interface FollowersDialogProps {
  walletAddress: string;
  isOpen: boolean;
  onClose: () => void;
  type: 'followers' | 'following';
}

const FollowersDialog: React.FC<FollowersDialogProps> = () => {
  // Component removed for speed optimization
  return null;
};

export default FollowersDialog;
