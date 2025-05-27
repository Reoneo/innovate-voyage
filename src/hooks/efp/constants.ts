
// EFP contract addresses on Base chain (ID 8453)
export const EFP_ACCOUNT_METADATA = "0x5289fE5daBC021D02FDDf23d4a4DF96F4E0F17EF";
export const EFP_LIST_REGISTRY = "0x0E688f5DCa4a0a4729946ACbC44C792341714e08";
export const EFP_LIST_RECORDS = "0x41Aa48Ef3c0446b46a5b1cc6337FF3d3716E2A33";
export const BASE_CHAIN_ID = 8453; 
export const BASE_CHAIN_HEX = "0x2105"; // Hexadecimal for 8453

// Contract ABIs - simplified to just what we need
export const EFP_LIST_RECORDS_ABI = [
  "function applyListOp(uint256 slot, bytes calldata op) external"
];

export const EFP_ACCOUNT_METADATA_ABI = [
  "function getValue(address owner, string calldata key) external view returns (bytes memory)"
];

export const EFP_LIST_REGISTRY_ABI = [
  "function getListStorageLocation(uint256 tokenId) external view returns (bytes memory)",
  "function balanceOf(address owner) external view returns (uint256)"
];
