
/**
 * Function to determine the endpoint to use based on identity type
 * Focus only on ENS (.eth and .box) domains
 */
export function getWeb3BioEndpoint(identity: string): { endpoint: string, type: string } {
  // Normalize the identity
  const normalizedId = identity.toLowerCase().trim();
  
  // Check if this is an Ethereum address (0x...)
  if (normalizedId.startsWith('0x') && normalizedId.length === 42) {
    return { endpoint: `https://api.web3.bio/profile/${normalizedId}`, type: 'address' };
  }
  
  // ENS domains (.eth)
  if (normalizedId.endsWith('.eth')) {
    return { endpoint: `https://api.web3.bio/profile/ens/${normalizedId}`, type: 'ens' };
  }
  
  // Box domains (.box) - improved handling for .box domains
  if (normalizedId.endsWith('.box')) {
    // Try to use ENS endpoint for .box domains for better compatibility
    return { endpoint: `https://api.web3.bio/profile/ens/${normalizedId}`, type: 'ens' };
  }
  
  // If no specific extension but looks like a domain name, treat as ENS
  if (!normalizedId.startsWith('0x') && !normalizedId.includes('.') && /^[a-zA-Z0-9]+$/.test(normalizedId)) {
    return { endpoint: `https://api.web3.bio/profile/ens/${normalizedId}.eth`, type: 'ens' };
  }
  
  // Default to universal endpoint
  return { endpoint: `https://api.web3.bio/profile/${normalizedId}`, type: 'universal' };
}
