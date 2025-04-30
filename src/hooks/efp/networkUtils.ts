
import { ethers } from "ethers";
import { BASE_CHAIN_HEX, BASE_CHAIN_ID } from "./constants";

/**
 * Switches the Ethereum provider to Base network
 */
export async function switchToBaseNetwork(): Promise<boolean> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("Ethereum provider not found. Please install MetaMask.");
  }
  
  try {
    // Try to switch to Base network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_HEX }],
    });
    
    // Wait a moment for the network change to take effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
    
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
        return true;
      } catch (addError) {
        throw new Error("Failed to add Base network to MetaMask");
      }
    } else {
      throw new Error("Failed to switch to Base network");
    }
  }
}

/**
 * Checks if the current network is Base
 */
export async function checkNetworkIsBase(provider: ethers.BrowserProvider): Promise<boolean> {
  const { chainId } = await provider.getNetwork();
  return chainId === BigInt(BASE_CHAIN_ID);
}

/**
 * Connects to Ethereum provider and returns provider, signer and wallet address
 */
export async function connectWallet(): Promise<{
  provider: ethers.BrowserProvider,
  signer: ethers.JsonRpcSigner,
  walletAddress: string
}> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("Ethereum provider not found. Please install MetaMask.");
  }
  
  // Request account access
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
  if (!accounts || accounts.length === 0) {
    throw new Error("No wallet accounts available");
  }
  
  // Get the current user account
  const walletAddress = accounts[0];
  
  // Create a Web3Provider using the injected provider
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return { provider, signer, walletAddress };
}
