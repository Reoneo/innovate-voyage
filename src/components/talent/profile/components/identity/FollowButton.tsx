
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFollowButton, useTransactions } from 'ethereum-identity-kit';

interface FollowButtonProps {
  targetAddress: string;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetAddress, className }) => {
  const { toast } = useToast();
  
  // Don't show follow button for your own profile
  const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
  if (connectedWalletAddress?.toLowerCase() === targetAddress?.toLowerCase()) {
    return null;
  }

  // Format addresses properly with 0x prefix
  const formatAddress = (address: string | null): `0x${string}` | undefined => {
    if (!address) return undefined;
    
    if (address.toLowerCase().startsWith('0x')) {
      return address.toLowerCase() as `0x${string}`;
    }
    
    return `0x${address.toLowerCase()}` as `0x${string}`;
  };

  const formattedTargetAddress = formatAddress(targetAddress);
  const formattedConnectedAddress = formatAddress(connectedWalletAddress);

  const handleDisconnectedClick = () => {
    // Trigger wallet connect modal
    const event = new CustomEvent('open-wallet-connect');
    document.dispatchEvent(event);
    
    toast({
      title: "Wallet Connection Required",
      description: "Please connect your wallet first to follow this address",
    });
  };

  // If we don't have both addresses properly formatted, show the disconnected button
  if (!formattedConnectedAddress || !formattedTargetAddress) {
    return (
      <div className={`flex justify-center mt-2 mb-2 ${className || ''}`}>
        <Button 
          variant="default"
          size="sm"
          className="flex items-center gap-2 mx-auto"
          onClick={handleDisconnectedClick}
        >
          <img 
            src="https://storage.googleapis.com/zapper-fi-assets/apps%2Fethereum-follow-protocol.png"
            className="h-4 w-4 rounded-full"
            alt="EFP"
          />
          Follow
        </Button>
      </div>
    );
  }

  // Use the useFollowButton hook for connected users
  const { 
    buttonText, 
    buttonState, 
    handleAction, 
    isLoading, 
    disableHover, 
    setDisableHover 
  } = useFollowButton({
    lookupAddress: formattedTargetAddress,
    connectedAddress: formattedConnectedAddress,
  });

  // Access the transaction context
  const { txModalOpen } = useTransactions();

  return (
    <div className={`flex justify-center mt-2 mb-2 ${className || ''}`}>
      <Button 
        variant={buttonState === 'FOLLOWING' ? 'outline' : 'default'}
        size="sm"
        className={`flex items-center gap-2 mx-auto transition-colors ${disableHover ? 'pointer-events-none' : ''}`}
        onClick={handleAction}
        onMouseEnter={() => setDisableHover(false)}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <img 
              src="https://storage.googleapis.com/zapper-fi-assets/apps%2Fethereum-follow-protocol.png"
              className="h-4 w-4 rounded-full"
              alt="EFP"
            />
            {buttonText}
          </>
        )}
      </Button>
    </div>
  );
};

export default FollowButton;
