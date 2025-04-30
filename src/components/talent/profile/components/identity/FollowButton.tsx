
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FollowButton as EthIdentityFollowButton } from 'ethereum-identity-kit';

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

  const handleDisconnectedClick = () => {
    // Trigger wallet connect modal
    const event = new CustomEvent('open-wallet-connect');
    document.dispatchEvent(event);
    
    toast({
      title: "Wallet Connection Required",
      description: "Please connect your wallet first to follow this address",
    });
  };

  const efpLogo = 'https://storage.googleapis.com/zapper-fi-assets/apps%2Fethereum-follow-protocol.png';

  // If we have a connected wallet, use the EthIdentityFollowButton
  if (connectedWalletAddress) {
    return (
      <div className={`flex justify-center mt-2 mb-2 ${className || ''}`}>
        <EthIdentityFollowButton
          lookupAddress={targetAddress}
          connectedAddress={connectedWalletAddress}
          onDisconnectedClick={handleDisconnectedClick}
          className="flex items-center gap-2 mx-auto"
        />
      </div>
    );
  }

  // If no wallet is connected, show our custom button that triggers wallet connect
  return (
    <div className={`flex justify-center mt-2 mb-2 ${className || ''}`}>
      <Button 
        variant="default"
        size="sm"
        className="flex items-center gap-2 mx-auto"
        onClick={handleDisconnectedClick}
      >
        <img 
          src={efpLogo}
          className="h-4 w-4 rounded-full"
          alt="EFP"
        />
        Follow
      </Button>
    </div>
  );
};

export default FollowButton;
