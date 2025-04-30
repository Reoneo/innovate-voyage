
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { shortenAddress } from './efpUtils';

/**
 * Hook for handling follow actions
 */
export function useFollowAction() {
  const [followLoading, setFollowLoading] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  /**
   * Follow an Ethereum address
   */
  const followAddress = async (addressToFollow: string): Promise<void> => {
    // Check if wallet is connected
    const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
    if (!connectedWalletAddress) {
      throw new Error("Please connect your wallet first");
    }

    // Implementation of EFP follow functionality
    try {
      toast({
        title: "Following address",
        description: `Connecting to wallet to follow ${shortenAddress(addressToFollow)}...`
      });

      // Check if we have the Ethereum object available from Metamask
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No wallet accounts available");
        }
        
        // Get the current user account
        const userAddress = accounts[0];
        
        // To follow on EFP, user needs to sign a message
        const message = `Follow ${addressToFollow} on ethereum-follow-protocol`;
        
        // Request signature from the user
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, userAddress]
        });
        
        if (!signature) {
          throw new Error("Signature was not provided");
        }
        
        console.log(`Successfully signed follow message for ${addressToFollow}`);
        
        // In a full implementation, you would now submit this signature to the EFP backend
        
        toast({
          title: "Success",
          description: `You are now following ${shortenAddress(addressToFollow)}`
        });

        return Promise.resolve();
      } else {
        throw new Error("Ethereum provider not found. Please install MetaMask.");
      }
    } catch (error: any) {
      console.error('Error following address:', error);
      throw new Error(error.message || "Failed to follow. Please try again.");
    }
  };

  const setFollowLoadingState = (address: string, isLoading: boolean) => {
    setFollowLoading(prev => ({ ...prev, [address]: isLoading }));
  };

  return {
    followAddress,
    followLoading,
    setFollowLoadingState
  };
}
