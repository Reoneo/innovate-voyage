
import { ethers } from "ethers";
import { 
  checkPrimaryList, 
  getListStorageLocation, 
  encodeFollowOperation 
} from "./listUtils";
import { 
  connectWallet, 
  checkNetworkIsBase, 
  switchToBaseNetwork 
} from "./networkUtils";
import { EFP_LIST_RECORDS, EFP_LIST_RECORDS_ABI } from "./constants";

/**
 * Execute follow operation on the blockchain
 */
export async function executeFollow(
  addressToFollow: string
): Promise<{ success: boolean, txHash?: string, error?: string }> {
  try {
    console.log('Starting follow transaction for:', addressToFollow);
    
    // 1. Connect wallet and get provider
    let { provider, signer, walletAddress } = await connectWallet();
    console.log('Connected wallet address:', walletAddress);
    
    // 2. Check network and switch to Base if needed
    const isBaseNetwork = await checkNetworkIsBase(provider);
    console.log('Is Base network:', isBaseNetwork);
    
    if (!isBaseNetwork) {
      console.log('Switching to Base network...');
      await switchToBaseNetwork();
      // Re-initialize provider after network switch
      console.log('Reconnecting wallet after network switch');
      const updatedConnection = await connectWallet();
      provider = updatedConnection.provider;
      signer = updatedConnection.signer;
      walletAddress = updatedConnection.walletAddress;
    }
    
    // 3. Check if user has primary EFP list
    console.log('Checking for primary EFP list...');
    const { hasList, hasLists, primaryTokenId } = await checkPrimaryList(provider, walletAddress);
    console.log('Has primary list:', hasList, 'Has lists:', hasLists, 'Primary token ID:', primaryTokenId?.toString());
    
    if (!hasList) {
      if (hasLists) {
        throw new Error("You have EFP lists but no primary list set. Please visit efp.app to set a primary list.");
      } else {
        throw new Error("No EFP List found. Visit efp.app to create one.");
      }
    }
    
    // 4. Get storage location of the list
    console.log('Getting list storage location for token ID:', primaryTokenId?.toString());
    const listLocation = await getListStorageLocation(provider, primaryTokenId!);
    console.log('List location:', listLocation);
    
    if (!listLocation.isValid) {
      throw new Error("List storage location is not on Base list records contract.");
    }
    
    // 5. Encode the follow operation
    console.log('Encoding follow operation for address:', addressToFollow);
    const opBytes = encodeFollowOperation(addressToFollow);
    
    // 6. Execute the follow transaction
    console.log('Creating contract instance with signer:', signer);
    const listRecords = new ethers.Contract(
      EFP_LIST_RECORDS,
      EFP_LIST_RECORDS_ABI,
      signer
    );
    
    console.log('Preparing to send transaction...');
    
    // First, explicitly get the current nonce to ensure fresh transaction
    const nonce = await provider.getTransactionCount(walletAddress, "pending");
    console.log('Using nonce:', nonce);
    
    // Try to estimate gas first to catch potential errors before showing popup
    try {
      console.log('Estimating gas...');
      const gasEstimate = await listRecords.applyListOp.estimateGas(
        listLocation.slot, 
        opBytes
      );
      console.log('Estimated gas:', gasEstimate.toString());
    } catch (gasError) {
      console.error('Gas estimation failed (transaction would likely fail):', gasError);
      // Continue anyway, as sometimes estimation fails but transaction succeeds
    }
    
    // Explicitly request accounts to trigger the MetaMask popup if it's locked
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Force MetaMask to show the confirmation popup with explicit parameters
    const txRequest = await listRecords.applyListOp.populateTransaction(
      listLocation.slot, 
      opBytes
    );
    
    // Add transaction parameters to ensure MetaMask shows the popup
    txRequest.gasLimit = ethers.toBigInt(300000); // Explicitly set gas limit
    txRequest.nonce = nonce; // Use fresh nonce
    
    console.log('Sending transaction request to MetaMask:', txRequest);
    
    // Use the lower level sendTransaction to ensure MetaMask shows the popup
    const tx = await signer.sendTransaction(txRequest);
    
    console.log('Transaction sent:', tx.hash);
    console.log('Waiting for transaction confirmation...');
    const receipt = await tx.wait();
    console.log('Transaction confirmed, receipt:', receipt);
    
    return {
      success: true,
      txHash: receipt.hash
    };
    
  } catch (error: any) {
    console.error('Error executing follow:', error);
    
    // Check for specific MetaMask errors
    if (error.code === 4001) {
      return {
        success: false,
        error: "Transaction was rejected by the user"
      };
    } else if (error.code === -32002) {
      return {
        success: false,
        error: "MetaMask is already processing a request. Please check your MetaMask extension."
      };
    }
    
    return {
      success: false,
      error: error.message || "Unknown error"
    };
  }
}
