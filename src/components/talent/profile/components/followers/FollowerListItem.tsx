
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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
  return (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-md">
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage 
          src={user.ens_name ? `https://metadata.ens.domains/mainnet/avatar/${user.ens_name}` : user.avatar_url} 
        />
        <AvatarFallback>
          {(user.ens_name || "").substring(0, 2).toUpperCase() || user.address.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">
          {user.ens_name || user.address.substring(0, 6) + '...' + user.address.substring(38)}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {user.ens_name ? user.address.substring(0, 6) + '...' + user.address.substring(38) : ''}
        </p>
        {user.bio && <p className="text-sm truncate">{user.bio}</p>}
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => window.open(`/${user.ens_name || user.address}`, '_blank')}
        className="ml-2"
      >
        <ExternalLink className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Profile</span>
      </Button>
    </div>
  );
};

export default FollowerListItem;
