
/**
 * Function to determine the endpoint to use based on identity type
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
  
  // Base domains (.base.eth)
  if (normalizedId.endsWith('.base.eth')) {
    return { endpoint: `https://api.web3.bio/profile/basenames/${normalizedId}`, type: 'basenames' };
  }
  
  // Linea domains (.linea.eth)
  if (normalizedId.endsWith('.linea.eth')) {
    return { endpoint: `https://api.web3.bio/profile/linea/${normalizedId}`, type: 'linea' };
  }
  
  // Farcaster identities
  if (normalizedId.endsWith('.farcaster') || normalizedId.includes('#')) {
    return { endpoint: `https://api.web3.bio/profile/farcaster/${normalizedId}`, type: 'farcaster' };
  }
  
  // Lens handles
  if (normalizedId.endsWith('.lens')) {
    return { endpoint: `https://api.web3.bio/profile/lens/${normalizedId}`, type: 'lens' };
  }
  
  // Unstoppable domains
  if (normalizedId.endsWith('.crypto') || normalizedId.endsWith('.nft') || 
      normalizedId.endsWith('.blockchain') || normalizedId.endsWith('.x') || 
      normalizedId.endsWith('.wallet') || normalizedId.endsWith('.dao')) {
    return { endpoint: `https://api.web3.bio/profile/unstoppabledomains/${normalizedId}`, type: 'unstoppabledomains' };
  }
  
  // Solana domains
  if (normalizedId.endsWith('.sol')) {
    return { endpoint: `https://api.web3.bio/profile/solana/${normalizedId}`, type: 'solana' };
  }
  
  // .bit domains
  if (normalizedId.endsWith('.bit')) {
    return { endpoint: `https://api.web3.bio/profile/dotbit/${normalizedId}`, type: 'dotbit' };
  }
  
  // If no specific extension but looks like a domain name, treat as ENS
  if (!normalizedId.startsWith('0x') && !normalizedId.includes('.') && /^[a-zA-Z0-9]+$/.test(normalizedId)) {
    return { endpoint: `https://api.web3.bio/profile/ens/${normalizedId}.eth`, type: 'ens' };
  }
  
  // Default to universal endpoint
  return { endpoint: `https://api.web3.bio/profile/${normalizedId}`, type: 'universal' };
}
