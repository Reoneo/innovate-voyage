
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEfpStats } from '@/hooks/useEfpStats';

interface FollowButtonProps {
  targetAddress: string;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetAddress, className }) => {
  const { isFollowing, followAddress } = useEfpStats();
  const [loading, setLoading] = useState(false);
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
    
    setLoading(true);
    
    try {
      await followAddress(targetAddress);
    } catch (error) {
      console.error('Follow error:', error);
      toast({
        title: "Error",
        description: "Failed to follow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const efpLogo = 'https://storage.googleapis.com/zapper-fi-assets/apps%2Fethereum-follow-protocol.png';

  return (
    <div className={`flex justify-center mt-2 mb-2 ${className || ''}`}>
      <Button 
        variant={isFollowing(targetAddress) ? "outline" : "default"}
        size="sm"
        className="flex items-center gap-1 mx-auto"
        disabled={loading}
        onClick={handleFollow}
      >
        <img 
          src={efpLogo}
          className="h-4 w-4 rounded-full"
          alt="EFP"
        />
        {isFollowing(targetAddress) ? (
          <>
            <Check className="h-4 w-4" /> Following
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" /> Follow
          </>
        )}
      </Button>
    </div>
  );
};

export default FollowButton;
