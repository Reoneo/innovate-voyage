
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { executeFollow } from "./followService";
import { shortenAddress } from "./utils";

export function useEfpFollow() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const followAddress = async (addressToFollow: string, isFollowing: boolean = false, onSuccess?: () => void): Promise<void> => {
    if (isProcessing) {
      toast({
        title: "Please wait",
        description: "Another follow transaction is in progress",
      });
      return;
    }

    // Check if wallet is connected
    const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
    if (!connectedWalletAddress) {
      throw new Error("Please connect your wallet first");
    }

    // If already following, don't do anything
    if (isFollowing) {
      console.log(`Already following ${shortenAddress(addressToFollow)}`);
      return;
    }

    try {
      setIsProcessing(true);
      
      toast({
        title: "Following address",
        description: `Connecting to wallet to follow ${shortenAddress(addressToFollow)}...`
      });
      
      if (typeof window.ethereum === 'undefined') {
        toast({
          title: "Error",
          description: "Ethereum provider not found. Please install MetaMask.",
          variant: "destructive"
        });
        throw new Error("Ethereum provider not found. Please install MetaMask.");
      }
      
      toast({
        title: "Preparing transaction",
        description: `Please check your wallet for the transaction popup to follow ${shortenAddress(addressToFollow)}`
      });
      
      // Force wallet to refresh connection
      if (window.ethereum.isMetaMask) {
        console.log("Requesting accounts to ensure MetaMask is active");
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
      
      console.log("Executing follow for address:", addressToFollow);
      const result = await executeFollow(addressToFollow);
      
      if (result.success) {
        toast({
          title: "Success",
          description: `You are now following ${shortenAddress(addressToFollow)} on the Base blockchain`
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        handleFollowError(result.error);
        throw new Error(result.error);
      }
      
    } catch (error: any) {
      console.error('Error in followAddress:', error);
      handleFollowError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFollowError = (errorMessage?: string) => {
    if (!errorMessage) return;
    
    // Check if user rejected the transaction
    if (errorMessage.includes("user rejected") || errorMessage.includes("User denied")) {
      toast({
        title: "Transaction cancelled",
        description: "You cancelled the follow transaction",
        variant: "destructive"
      });
    } 
    // No EFP List cases are handled in executeFollow
    else if (errorMessage.includes("No EFP List found")) {
      // This error is handled in the FollowButton component
    } 
    else if (errorMessage.includes("primary list")) {
      // This error is handled in the FollowButton component
    } 
    else {
      toast({
        title: "Error",
        description: errorMessage || "Failed to follow on the blockchain. Please try again.",
        variant: "destructive"
      });
    }
  };

  return { followAddress, isProcessing };
}
