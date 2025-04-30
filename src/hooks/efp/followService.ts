
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
    // 1. Connect wallet and get provider
    let { provider, signer, walletAddress } = await connectWallet();
    
    // 2. Check network and switch to Base if needed
    const isBaseNetwork = await checkNetworkIsBase(provider);
    if (!isBaseNetwork) {
      await switchToBaseNetwork();
      // Re-initialize provider after network switch
      const updatedConnection = await connectWallet();
      provider = updatedConnection.provider;
      signer = updatedConnection.signer;
    }
    
    // 3. Check if user has primary EFP list
    const { hasList, hasLists, primaryTokenId } = await checkPrimaryList(provider, walletAddress);
    
    if (!hasList) {
      if (hasLists) {
        throw new Error("You have EFP lists but no primary list set. Please visit efp.app to set a primary list.");
      } else {
        throw new Error("No EFP List found. Visit efp.app to create one.");
      }
    }
    
    // 4. Get storage location of the list
    const listLocation = await getListStorageLocation(provider, primaryTokenId!);
    
    if (!listLocation.isValid) {
      throw new Error("List storage location is not on Base list records contract.");
    }
    
    // 5. Encode the follow operation
    const opBytes = encodeFollowOperation(addressToFollow);
    
    // 6. Execute the follow transaction
    const listRecords = new ethers.Contract(
      EFP_LIST_RECORDS,
      EFP_LIST_RECORDS_ABI,
      signer
    );
    
    const tx = await listRecords.applyListOp(listLocation.slot, opBytes);
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.hash
    };
    
  } catch (error: any) {
    console.error('Error executing follow:', error);
    return {
      success: false,
      error: error.message || "Unknown error"
    };
  }
}
