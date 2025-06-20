
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useEfpFollow } from '@/hooks/efp/useEfpFollow';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface FollowButtonProps {
  targetAddress: string;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  targetAddress,
  className
}) => {
  const { toast } = useToast();
  const { followAddress, isProcessing } = useEfpFollow();
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();

  // Don't show follow button for your own profile
  if (isConnected && address && address.toLowerCase() === targetAddress?.toLowerCase()) {
    return null;
  }

  const handleClick = async () => {
    if (!targetAddress) return;

    // If wallet not connected, open the connect modal
    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      }
      return;
    }

    try {
      // Store the connected wallet address for persistence
      if (address) {
        localStorage.setItem('connectedWalletAddress', address);
        window.connectedWalletAddress = address;
      }

      // Execute the follow transaction on Base network
      await followAddress(targetAddress, false, () => {
        toast({
          title: "Successfully followed!",
          description: `You are now following ${targetAddress.substring(0, 6)}...${targetAddress.substring(38)}`,
        });
      });

    } catch (error: any) {
      console.error('Follow error:', error);
      
      // Handle specific error cases
      if (error.message?.includes("No EFP List found")) {
        toast({
          title: "Create EFP List First",
          description: "Visit efp.app to create your EFP list before following others.",
          variant: "destructive",
        });
        // Open EFP app in new tab
        window.open('https://efp.app', '_blank');
      } else if (error.message?.includes("primary list")) {
        toast({
          title: "Set Primary List",
          description: "Visit efp.app to set a primary list before following.",
          variant: "destructive",
        });
        window.open('https://efp.app', '_blank');
      } else if (!error.message?.includes("user rejected") && !error.message?.includes("User denied")) {
        toast({
          title: "Follow Failed",
          description: error.message || "Failed to follow. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={`flex justify-center mt-2 mb-2 ${className || ''}`}>
      <button 
        onClick={handleClick}
        disabled={isProcessing}
        className={`mx-auto transition-opacity ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
      >
        <img 
          src="/lovable-uploads/99ee2ca1-bf63-4bf4-9d80-75bf2583163b.png" 
          alt={isConnected ? "Follow on EFP" : "Connect Wallet to Follow"} 
          style={{ height: "36px" }} 
          className="rounded-md transition-opacity object-fill" 
        />
      </button>
    </div>
  );
};

export default FollowButton;
