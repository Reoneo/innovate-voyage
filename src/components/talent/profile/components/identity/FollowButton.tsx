
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEfpStats } from '@/hooks/useEfpStats';

interface FollowButtonProps {
  targetAddress: string;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetAddress, className }) => {
  const { isFollowing, followAddress, isProcessing } = useEfpStats();
  const { toast } = useToast();
  
  // Don't show follow button for your own profile
  const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
  if (connectedWalletAddress?.toLowerCase() === targetAddress?.toLowerCase()) {
    return null;
  }

  const handleFollow = async () => {
    if (!targetAddress) return;
    
    // Check if wallet is connected
    if (!connectedWalletAddress) {
      // Trigger wallet connect modal
      const event = new CustomEvent('open-wallet-connect');
      document.dispatchEvent(event);
      
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet first to follow this address",
      });
      return;
    }
    
    try {
      await followAddress(targetAddress);
    } catch (error: any) {
      console.error('Follow error:', error);
      
      // Special handling for no EFP List case
      if (error.message && error.message.includes("No EFP List found")) {
        // We'll open ethfollow.xyz in a new tab
        window.open('https://app.ethfollow.xyz/', '_blank');
      }
    }
  };

  const efpLogo = 'https://storage.googleapis.com/zapper-fi-assets/apps%2Fethereum-follow-protocol.png';

  return (
    <div className={`flex justify-center mt-2 mb-2 ${className || ''}`}>
      <Button 
        variant={isFollowing(targetAddress) ? "outline" : "default"}
        size="sm"
        className="flex items-center gap-2 mx-auto"
        disabled={isProcessing}
        onClick={handleFollow}
      >
        <img 
          src={efpLogo}
          className="h-4 w-4 rounded-full"
          alt="EFP"
        />
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isFollowing(targetAddress) ? (
          "Following"
        ) : (
          "Follow"
        )}
      </Button>
    </div>
  );
};

export default FollowButton;
