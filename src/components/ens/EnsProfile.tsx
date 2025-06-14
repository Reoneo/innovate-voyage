
import React from 'react';
import { useEnsProfile } from '@/hooks/useEnsProfile';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const EnsProfile: React.FC = () => {
  const { address, ensName, ensAvatar, isConnected, isLoading } = useEnsProfile();

  if (!isConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={ensAvatar || undefined} alt={ensName || 'User'} />
          <AvatarFallback>
            {ensName ? ensName.charAt(0).toUpperCase() : address?.slice(2, 4).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">
              {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </h3>
            {ensName && <Badge variant="secondary">ENS</Badge>}
          </div>
          
          {ensName && (
            <p className="text-sm text-gray-600">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EnsProfile;
