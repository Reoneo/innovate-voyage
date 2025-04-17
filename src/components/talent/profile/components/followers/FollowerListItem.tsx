
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useEnsResolver } from '@/hooks/useEnsResolver';

interface FollowerData {
  address: string;
  ens_name?: string;
  avatar_url?: string;
  bio?: string;
}

interface FollowerListItemProps {
  user: FollowerData;
}

const FollowerListItem: React.FC<FollowerListItemProps> = ({ user }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user.avatar_url);
  
  // Resolve ENS if needed
  const { resolvedEns, avatarUrl: resolvedAvatarUrl } = useEnsResolver(undefined, user.address);
  
  // Update ENS when resolved
  useEffect(() => {
    if (resolvedAvatarUrl) {
      setAvatarUrl(resolvedAvatarUrl);
    }
  }, [resolvedAvatarUrl]);
  
  // Use the ENS name from either props or resolver
  const displayName = user.ens_name || resolvedEns || (user.address ? `${user.address.substring(0, 6)}...${user.address.substring(38)}` : 'Unknown');
  
  // Generate initials for avatar fallback
  const initials = (displayName.slice(0, 2) || "").toUpperCase();

  return (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-md">
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">
          {displayName}
        </p>
        {(user.ens_name || resolvedEns) && 
          <p className="text-sm text-gray-500 truncate">
            {user.address.substring(0, 6)}...{user.address.substring(38)}
          </p>
        }
        {user.bio && <p className="text-sm truncate">{user.bio}</p>}
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => window.open(`/${user.ens_name || resolvedEns || user.address}`, '_blank')}
        className="ml-2"
      >
        <ExternalLink className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Profile</span>
      </Button>
    </div>
  );
};

export default FollowerListItem;
