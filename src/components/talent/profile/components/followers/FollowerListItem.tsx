
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, Check, ExternalLink } from 'lucide-react';

interface FollowerListItemProps {
  address: string;
  ensName?: string;
  avatar?: string;
  isFollowing: boolean;
  onFollow: (address: string) => Promise<void>;
  isLoading: boolean;
}

function shortenAddress(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

export function FollowerListItem({ 
  address, 
  ensName, 
  avatar, 
  isFollowing, 
  onFollow, 
  isLoading 
}: FollowerListItemProps) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>
            {ensName
              ? ensName.substring(0, 2).toUpperCase()
              : shortenAddress(address).substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{ensName || shortenAddress(address)}</p>
          {ensName && (
            <p className="text-xs text-muted-foreground">{shortenAddress(address)}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          className="flex items-center gap-1"
          disabled={isLoading}
          onClick={() => onFollow(address)}
        >
          {isFollowing ? (
            <>
              <Check className="h-4 w-4" /> Following
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" /> Follow
            </>
          )}
        </Button>
        <a 
          href={`/${ensName || address}`}
          className="text-primary hover:text-primary/80"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
