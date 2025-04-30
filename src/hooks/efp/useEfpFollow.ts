
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { shortenAddress } from "./utils";
import { mainnetProvider } from "@/utils/ethereumProviders";
import { ethers } from "ethers";

// EFP contract ABI - simplified to just what we need for the follow function
const EFP_ABI = [
  "function follow(address _account) external"
];

// EFP contract address on mainnet
const EFP_CONTRACT_ADDRESS = "0x0C5C2B34235e536e4C4DE65CD88E34BC3801c9d1";

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

    // Implementation of EFP follow functionality
    try {
      // If already following, don't do anything
      if (isFollowing) {
        console.log(`Already following ${shortenAddress(addressToFollow)}`);
        return;
      }

      setIsProcessing(true);
      
      toast({
        title: "Following address",
        description: `Connecting to wallet to follow ${shortenAddress(addressToFollow)}...`
      });

      // Check if we have the Ethereum object available from Metamask
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          if (!accounts || accounts.length === 0) {
            throw new Error("No wallet accounts available");
          }
          
          // Get the current user account
          const userAddress = accounts[0];
          
          // Create a Web3Provider using the injected provider
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          
          // Connect to the EFP contract
          const efpContract = new ethers.Contract(EFP_CONTRACT_ADDRESS, EFP_ABI, signer);
          
          // Prepare the transaction
          toast({
            title: "Preparing transaction",
            description: `Please confirm the transaction in your wallet to follow ${shortenAddress(addressToFollow)}`
          });
          
          // Execute the follow function on the EFP contract
          const tx = await efpContract.follow(addressToFollow);
          
          // Wait for the transaction to be mined
          toast({
            title: "Transaction submitted",
            description: "Waiting for blockchain confirmation..."
          });
          
          const receipt = await tx.wait();
          
          console.log(`Successfully followed ${addressToFollow} on the blockchain`, receipt);
          
          if (onSuccess) {
            onSuccess();
          }

          toast({
            title: "Success",
            description: `You are now following ${shortenAddress(addressToFollow)} on the blockchain`
          });
        } catch (error: any) {
          console.error('Error following address on blockchain:', error);
          
          // Check if user rejected the transaction
          if (error.message && error.message.includes("user rejected")) {
            toast({
              title: "Transaction cancelled",
              description: "You cancelled the follow transaction",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Error",
              description: "Failed to follow on the blockchain. Please try again.",
              variant: "destructive"
            });
          }
          
          throw new Error(error.message || "Failed to follow. Please try again.");
        }
      } else {
        toast({
          title: "Error",
          description: "Ethereum provider not found. Please install MetaMask.",
          variant: "destructive"
        });
        throw new Error("Ethereum provider not found. Please install MetaMask.");
      }
    } catch (error: any) {
      console.error('Error in followAddress:', error);
      
      toast({
        title: "Error",
        description: "Failed to follow on the blockchain. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { followAddress, isProcessing };
}
