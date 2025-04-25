
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { shortenAddress } from '@/utils/ensResolver';

export function useFollowAddress() {
  const { toast } = useToast();
  const [followingAddresses, setFollowingAddresses] = useState<string[]>([]);

  const isFollowing = (address: string): boolean => {
    return followingAddresses.includes(address);
  };

  const followAddress = async (addressToFollow: string): Promise<void> => {
    const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
    if (!connectedWalletAddress) {
      throw new Error("Please connect your wallet first");
    }

    try {
      if (isFollowing(addressToFollow)) {
        return;
      }

      toast({
        title: "Following address",
        description: `Connecting to wallet to follow ${shortenAddress(addressToFollow)}...`
      });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFollowingAddresses(prev => [...prev, addressToFollow]);

      toast({
        title: "Success",
        description: `You are now following ${shortenAddress(addressToFollow)}`
      });

    } catch (error) {
      console.error('Error following address:', error);
      throw error;
    }
  };

  return {
    followingAddresses,
    setFollowingAddresses,
    isFollowing,
    followAddress
  };
}
