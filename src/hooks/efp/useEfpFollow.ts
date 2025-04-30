
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { shortenAddress } from "./utils";
import { ethers } from "ethers";

// EFP contract addresses on Base chain (ID 8453)
const EFP_ACCOUNT_METADATA = "0x5289fE5daBC021D02FDDf23d4a4DF96F4E0F17EF";
const EFP_LIST_REGISTRY = "0x0E688f5DCa4a0a4729946ACbC44C792341714e08";
const EFP_LIST_RECORDS = "0x41Aa48Ef3c0446b46a5b1cc6337FF3d3716E2A33";
const BASE_CHAIN_ID = 8453; 
const BASE_CHAIN_HEX = "0x2105"; // Hexadecimal for 8453

// EFP ListRecords ABI - simplified to just what we need
const EFP_LIST_RECORDS_ABI = [
  "function applyListOp(uint256 slot, bytes calldata op) external"
];

// Account Metadata ABI
const EFP_ACCOUNT_METADATA_ABI = [
  "function getValue(address owner, string calldata key) external view returns (bytes memory)"
];

// List Registry ABI
const EFP_LIST_REGISTRY_ABI = [
  "function getListStorageLocation(uint256 tokenId) external view returns (bytes memory)",
  "function balanceOf(address owner) external view returns (uint256)"
];

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
          
          // Check if we're on the correct network (Base)
          const { chainId } = await provider.getNetwork();
          
          if (chainId !== BigInt(BASE_CHAIN_ID)) {
            toast({
              title: "Wrong Network",
              description: "Switching to Base network...",
            });
            
            try {
              // Try to switch to Base network
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BASE_CHAIN_HEX }],
              });
              
              // Wait a moment for the network change to take effect
              await new Promise(resolve => setTimeout(resolve, 1000));
              
            } catch (switchError: any) {
              // This error code indicates that the chain has not been added to MetaMask
              if (switchError.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: BASE_CHAIN_HEX,
                        chainName: 'Base',
                        nativeCurrency: {
                          name: 'ETH',
                          symbol: 'ETH',
                          decimals: 18
                        },
                        rpcUrls: ['https://mainnet.base.org'],
                        blockExplorerUrls: ['https://basescan.org']
                      },
                    ],
                  });
                } catch (addError) {
                  throw new Error("Failed to add Base network to MetaMask");
                }
              } else {
                throw new Error("Failed to switch to Base network");
              }
            }
          }
          
          // Get the signer after ensuring we're on the correct network
          const signer = await provider.getSigner();
          
          // Step 1: Check if user has a primary list
          toast({
            title: "Checking EFP List",
            description: "Verifying your EFP primary list..."
          });
          
          const accountMetadata = new ethers.Contract(
            EFP_ACCOUNT_METADATA, 
            EFP_ACCOUNT_METADATA_ABI,
            provider
          );
          
          const listRegistry = new ethers.Contract(
            EFP_LIST_REGISTRY,
            EFP_LIST_REGISTRY_ABI,
            provider
          );
          
          // First check if the user has lists but hasn't set a primary
          const listsCount = await listRegistry.balanceOf(userAddress);
          
          let primaryData = await accountMetadata.getValue(userAddress, "primary-list");
          if (primaryData === "0x" || primaryData === null || primaryData.length <= 2) {
            if (listsCount > 0) {
              // User has lists but no primary list set
              throw new Error("You have EFP lists but no primary list set. Please visit efp.app to set a primary list.");
            } else {
              // No lists at all
              throw new Error("No EFP List found. Visit efp.app to create one.");
            }
          }
          
          const tokenId = ethers.getBigInt(primaryData);
          console.log("Primary EFP List tokenId:", tokenId.toString());
          
          // Step 2: Get list storage location
          const locBytes = await listRegistry.getListStorageLocation(tokenId);
          const hex = locBytes;
          
          // Decode bytes: [version(1), type(1), chainId(32), contract(20), slot(32)]
          const version = parseInt(hex.slice(2, 4), 16);
          const locType = parseInt(hex.slice(4, 6), 16);
          const chainIdHex = "0x" + hex.slice(6, 6+64);
          const contractHex = "0x" + hex.slice(6+64, 6+64+40);
          const slotHex = "0x" + hex.slice(6+64+40, 6+64+40+64);
          const slot = ethers.getBigInt(slotHex);
          
          console.log(`ListStorageLocation: version ${version}, type ${locType}, chainId ${ethers.getBigInt(chainIdHex)}, contract ${contractHex}, slot ${slot.toString()}`);
          
          // Sanity check: ensure chainId and contract match Base/EFPListRecords
          if (ethers.getBigInt(chainIdHex) !== BigInt(BASE_CHAIN_ID) || contractHex.toLowerCase() !== EFP_LIST_RECORDS.toLowerCase()) {
            toast({
              title: "Invalid List Location",
              description: "Your EFP List is not stored on the Base chain.",
              variant: "destructive"
            });
            throw new Error("List storage location is not on Base list records contract.");
          }
          
          // Step 3: Prepare the follow operation
          // Build the operation bytes: version=1, opcode=1 (Add), recVer=1, recType=1, followed by address
          const addrHex = ethers.zeroPadBytes(ethers.getBytes(addressToFollow), 20);
          const opBytes = ethers.concat([
            ethers.getBytes("0x01"), // ListOp version
            ethers.getBytes("0x01"), // opcode=Add record
            ethers.getBytes("0x01"), // ListRecord version
            ethers.getBytes("0x01"), // ListRecord type=1 (address)
            addrHex                  // 20-byte address to follow
          ]);
          
          console.log("Encoded ListOp:", ethers.hexlify(opBytes));
          
          // Step 4: Call applyListOp on EFPListRecords
          const listRecords = new ethers.Contract(
            EFP_LIST_RECORDS,
            EFP_LIST_RECORDS_ABI,
            signer
          );
          
          toast({
            title: "Preparing transaction",
            description: `Please confirm the transaction in your wallet to follow ${shortenAddress(addressToFollow)}`
          });
          
          const tx = await listRecords.applyListOp(slot, opBytes);
          
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
            description: `You are now following ${shortenAddress(addressToFollow)} on the Base blockchain`
          });
        } catch (error: any) {
          console.error('Error following address on blockchain:', error);
          
          // Check if user rejected the transaction
          if (error.message && (error.message.includes("user rejected") || error.message.includes("User denied"))) {
            toast({
              title: "Transaction cancelled",
              description: "You cancelled the follow transaction",
              variant: "destructive"
            });
          } else if (error.message && error.message.includes("No EFP List found")) {
            // Error is already handled above
          } else if (error.message && error.message.includes("primary list")) {
            // Error is already handled above
          } else {
            toast({
              title: "Error",
              description: error.message || "Failed to follow on the blockchain. Please try again.",
              variant: "destructive"
            });
          }
          
          throw error;
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
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { followAddress, isProcessing };
}
