
import { ethers } from "ethers";
import { 
  EFP_ACCOUNT_METADATA, 
  EFP_LIST_REGISTRY, 
  EFP_ACCOUNT_METADATA_ABI, 
  EFP_LIST_REGISTRY_ABI, 
  BASE_CHAIN_ID 
} from "./constants";

/**
 * Check if user has a primary EFP list
 */
export async function checkPrimaryList(
  provider: ethers.BrowserProvider, 
  walletAddress: string
): Promise<{ hasList: boolean, hasLists: boolean, primaryTokenId?: bigint }> {
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
  
  // Check if the user has lists but hasn't set a primary
  const listsCount = await listRegistry.balanceOf(walletAddress);
  const hasLists = listsCount > 0;
  
  // Check if user has set a primary list
  let primaryData = await accountMetadata.getValue(walletAddress, "primary-list");
  
  if (primaryData === "0x" || primaryData === null || primaryData.length <= 2) {
    return { hasList: false, hasLists };
  }
  
  const tokenId = ethers.getBigInt(primaryData);
  return { hasList: true, hasLists, primaryTokenId: tokenId };
}

/**
 * Get list storage location details
 */
export async function getListStorageLocation(
  provider: ethers.BrowserProvider, 
  tokenId: bigint
): Promise<{ 
  isValid: boolean, 
  slot?: bigint,
  chainId?: bigint,
  contractAddress?: string 
}> {
  const listRegistry = new ethers.Contract(
    EFP_LIST_REGISTRY,
    EFP_LIST_REGISTRY_ABI,
    provider
  );
  
  const locBytes = await listRegistry.getListStorageLocation(tokenId);
  const hex = locBytes;
  
  // Decode bytes: [version(1), type(1), chainId(32), contract(20), slot(32)]
  const chainIdHex = "0x" + hex.slice(6, 6+64);
  const contractHex = "0x" + hex.slice(6+64, 6+64+40);
  const slotHex = "0x" + hex.slice(6+64+40, 6+64+40+64);
  
  const chainId = ethers.getBigInt(chainIdHex);
  const slot = ethers.getBigInt(slotHex);
  
  // Validate that the list is on Base chain
  const isValid = chainId === BigInt(BASE_CHAIN_ID);
  
  return {
    isValid,
    slot,
    chainId,
    contractAddress: contractHex
  };
}

/**
 * Encode the follow operation (adding an address to the list)
 */
export function encodeFollowOperation(addressToFollow: string): Uint8Array {
  // Build the operation bytes: version=1, opcode=1 (Add), recVer=1, recType=1, followed by address
  const addrHex = ethers.zeroPadBytes(ethers.getBytes(addressToFollow), 20);
  return ethers.concat([
    ethers.getBytes("0x01"), // ListOp version
    ethers.getBytes("0x01"), // opcode=Add record
    ethers.getBytes("0x01"), // ListRecord version
    ethers.getBytes("0x01"), // ListRecord type=1 (address)
    addrHex                  // 20-byte address to follow
  ]);
}
