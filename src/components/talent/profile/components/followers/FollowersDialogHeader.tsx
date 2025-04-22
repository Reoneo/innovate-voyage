
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FollowersDialogHeaderProps {
  ensName?: string;
  walletAddress?: string;
  closeDialog: () => void;
}

const FollowersDialogHeader: React.FC<FollowersDialogHeaderProps> = ({ 
  ensName, 
  walletAddress,
  closeDialog 
}) => {
  return (
    <>
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-transparent rounded-full w-8 h-8 overflow-hidden">
            <img 
              src="https://pbs.twimg.com/profile_images/1899112167468638208/H7XicSUE_400x400.png" 
              alt="Ethereum Follow Protocol"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold">Ethereum Follow Protocol</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeDialog}
          className="rounded-full h-8 w-8"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Profile section */}
      <div className="flex flex-col items-center py-6">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src={ensName ? `https://metadata.ens.domains/mainnet/avatar/${ensName}` : undefined} />
          <AvatarFallback>{(ensName || "").substring(0, 2).toUpperCase() || (walletAddress || "").substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-bold mb-1">
          {ensName || (walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : 'Unknown')}
        </h3>
      </div>
    </>
  );
};

export default FollowersDialogHeader;
